import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const STORAGE_KEY = 'scanHistory'
const SEVERITIES = ['critical', 'high', 'medium', 'low']

const SEVERITY_BAR = {
  critical: 'bg-red-500',
  high: 'bg-orange-500',
  medium: 'bg-amber-400',
  low: 'bg-sky-500',
}

function readScanHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function sortByDateDesc(scans) {
  return [...scans].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )
}

function scoreColorClass(score) {
  const n = Number(score) || 0
  if (n >= 70) return 'text-green-500'
  if (n >= 40) return 'text-amber-500'
  return 'text-red-500'
}

function formatDate(date) {
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return String(date ?? '')
  return d.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getSeverityCounts(scan) {
  const src = scan?.severities ?? scan?.severity_counts ?? {}
  return {
    critical: src.critical ?? 0,
    high: src.high ?? 0,
    medium: src.medium ?? 0,
    low: src.low ?? 0,
  }
}

function ScanPanel({ scan, align }) {
  return (
    <div
      className={`flex flex-1 flex-col gap-2 rounded-lg border border-gray-800 bg-gray-900/80 p-4 ${align === 'right' ? 'text-right' : 'text-left'}`}
    >
      <p className="truncate font-mono text-xs text-gray-400">{scan.session_id}</p>
      <p className="text-sm text-gray-300">{formatDate(scan.date)}</p>
      <p
        className={`text-5xl font-bold tabular-nums leading-none ${scoreColorClass(scan.score)}`}
      >
        {scan.score ?? 0}
      </p>
      <p className="text-sm text-gray-400">
        {scan.vuln_count ?? 0} vulnerabilit{scan.vuln_count === 1 ? 'y' : 'ies'}
      </p>
    </div>
  )
}

function SeverityComparison({ older, newer }) {
  const olderCounts = getSeverityCounts(older)
  const newerCounts = getSeverityCounts(newer)

  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>Older scan</span>
        <span className="uppercase tracking-wide text-gray-400">Severity</span>
        <span>Newer scan</span>
      </div>
      {SEVERITIES.map((severity) => {
        const left = olderCounts[severity]
        const right = newerCounts[severity]
        const max = Math.max(left, right, 1)

        return (
          <div key={severity} className="space-y-1">
            <div className="flex items-center justify-between text-xs capitalize text-gray-400">
              <span>{severity}</span>
              <span className="font-mono text-gray-500">
                {left} vs {right}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="h-2 overflow-hidden rounded-full bg-gray-800">
                <motion.div
                  className={`h-full rounded-full ${SEVERITY_BAR[severity]}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${(left / max) * 100}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-gray-800">
                <motion.div
                  className={`h-full rounded-full ${SEVERITY_BAR[severity]}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${(right / max) * 100}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function ScoreDelta({ from, to }) {
  return (
    <motion.div
      key={`${from}-${to}`}
      className="flex shrink-0 flex-col items-center justify-center gap-2 px-2"
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
    >
      <div className="flex items-center gap-2 font-mono text-xl font-semibold text-gray-100">
        <motion.span
          className={scoreColorClass(from)}
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.05 }}
        >
          {from}
        </motion.span>
        <motion.span
          className="text-gray-500"
          animate={{ x: [0, 4, 0] }}
          transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
          aria-hidden
        >
          →
        </motion.span>
        <motion.span
          className={scoreColorClass(to)}
          initial={{ opacity: 0, x: 6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
        >
          {to}
        </motion.span>
      </div>
      <motion.p
        className="text-xs text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        score change
      </motion.p>
    </motion.div>
  )
}

export default function CompareScans() {
  const [history, setHistory] = useState(() => sortByDateDesc(readScanHistory()))

  useEffect(() => {
    const refresh = () => setHistory(sortByDateDesc(readScanHistory()))
    window.addEventListener('storage', refresh)
    window.addEventListener('focus', refresh)
    return () => {
      window.removeEventListener('storage', refresh)
      window.removeEventListener('focus', refresh)
    }
  }, [])

  if (history.length < 2) {
    return (
      <div className="rounded-lg border border-dashed border-gray-700 bg-gray-950 px-6 py-10 text-center text-gray-400">
        Run another scan to compare
      </div>
    )
  }

  const newer = history[0]
  const older = history[1]

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-950 p-5 text-gray-100">
      <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
        <ScanPanel scan={older} align="left" />
        <ScoreDelta from={older.score ?? 0} to={newer.score ?? 0} />
        <ScanPanel scan={newer} align="right" />
      </div>
      <SeverityComparison older={older} newer={newer} />
    </div>
  )
}
