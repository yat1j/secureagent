import { useEffect, useRef, useState } from 'react'

const CHAR_MS = 30
const COMPLETE_DELAY_MS = 500

const panelStyle = {
  backgroundColor: '#030712',
  color: '#4ade80',
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  padding: '12px 16px',
  borderRadius: '6px',
}

function StatusIcon({ status }) {
  const dotBase = {
    display: 'inline-block',
    width: 8,
    height: 8,
    borderRadius: '50%',
    flexShrink: 0,
  }

  if (status === 'running') {
    return (
      <span
        className="agent-feed-pulse"
        style={{ ...dotBase, backgroundColor: '#4ade80' }}
        aria-hidden
      />
    )
  }

  if (status === 'done') {
    return (
      <span style={{ color: '#4ade80', fontSize: 14, lineHeight: 1 }} aria-hidden>
        ✓
      </span>
    )
  }

  return (
    <span
      style={{ ...dotBase, backgroundColor: '#6b7280' }}
      aria-hidden
    />
  )
}

function displayMessage(agent, revealedCount) {
  const full = agent.message ?? ''
  if (agent.status === 'done') return full
  if (agent.status === 'running') return full.slice(0, revealedCount)
  return ''
}

export default function AgentFeed({ agentStatuses = [], onComplete }) {
  const [revealed, setRevealed] = useState({})
  const prevStatusRef = useRef({})
  const completedRef = useRef(false)

  useEffect(() => {
    setRevealed((prev) => {
      let next = prev
      agentStatuses.forEach((agent) => {
        const was = prevStatusRef.current[agent.name]
        if (agent.status === 'running' && was !== 'running') {
          if (next === prev) next = { ...prev }
          next[agent.name] = 0
        }
        prevStatusRef.current[agent.name] = agent.status
      })
      return next
    })
  }, [agentStatuses])

  useEffect(() => {
    const timers = agentStatuses
      .filter((agent) => agent.status === 'running')
      .map((agent) =>
        setInterval(() => {
          setRevealed((prev) => {
            const full = agent.message ?? ''
            const cur = prev[agent.name] ?? 0
            if (cur >= full.length) return prev
            return { ...prev, [agent.name]: cur + 1 }
          })
        }, CHAR_MS),
      )

    return () => timers.forEach((id) => clearInterval(id))
  }, [agentStatuses])

  const allDone =
    agentStatuses.length > 0 &&
    agentStatuses.every((agent) => agent.status === 'done')

  useEffect(() => {
    if (!allDone) {
      completedRef.current = false
      return undefined
    }

    const timer = setTimeout(() => {
      if (!completedRef.current) {
        completedRef.current = true
        onComplete?.()
      }
    }, COMPLETE_DELAY_MS)

    return () => clearTimeout(timer)
  }, [allDone, onComplete])

  const doneCount = agentStatuses.filter((a) => a.status === 'done').length
  const progress =
    agentStatuses.length > 0 ? (doneCount / agentStatuses.length) * 100 : 0

  return (
    <div style={panelStyle}>
      <style>{`
        @keyframes agent-feed-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.35; transform: scale(0.85); }
        }
        .agent-feed-pulse {
          animation: agent-feed-pulse 1.2s ease-in-out infinite;
        }
      `}</style>

      <div
        style={{
          height: 4,
          borderRadius: 2,
          backgroundColor: '#1f2937',
          marginBottom: 12,
          overflow: 'hidden',
        }}
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          style={{
            height: '100%',
            width: `${progress}%`,
            backgroundColor: '#4ade80',
            transition: 'width 0.25s ease',
          }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {agentStatuses.map((agent) => (
          <div
            key={agent.name}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10,
              textAlign: 'left',
            }}
          >
            <span style={{ width: 14, marginTop: 2, display: 'flex', justifyContent: 'center' }}>
              <StatusIcon status={agent.status} />
            </span>
            <span style={{ color: '#86efac', minWidth: 0, flexShrink: 0 }}>
              {agent.name}
            </span>
            <span style={{ color: '#4ade80', minWidth: 0, wordBreak: 'break-word' }}>
              {displayMessage(agent, revealed[agent.name] ?? 0)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
