import { useMemo, useState } from 'react'
import mockData from './mockData'
import { scanRepo } from './api'
import AttackGraph from './components/visuals/AttackGraph'
import FileHeatmap from './components/visuals/FileHeatmap'
import AgentFeed from './components/visuals/AgentFeed'
import BadgePreview from './components/visuals/BadgePreview'
import CompareScans from './components/visuals/CompareScans'

const SCANNING_AGENTS = [
  {
    name: 'Semgrep',
    status: 'running',
    message: 'Cloning repository and running OWASP ruleset...',
  },
  {
    name: 'Classifier',
    status: 'waiting',
    message: 'Waiting for static analysis results',
  },
  {
    name: 'Attack Mapper',
    status: 'waiting',
    message: 'Waiting for vulnerability classification',
  },
  {
    name: 'Reporter',
    status: 'waiting',
    message: 'Waiting for attack path analysis',
  },
]

function toHeatmapFiles(heatmap) {
  return (heatmap ?? []).map((item) => ({
    file: item.file,
    risk_score: item.risk_score,
    vuln_count: item.vulns ?? item.vuln_count ?? 0,
    line_count: item.line_count ?? 0,
  }))
}

function countSeverities(vulnerabilities) {
  const counts = { critical: 0, high: 0, medium: 0, low: 0 }
  for (const vuln of vulnerabilities ?? []) {
    const key = (vuln.severity || '').toLowerCase()
    if (key in counts) counts[key] += 1
  }
  return counts
}

function appendScanHistory(result) {
  try {
    const severities = countSeverities(result.vulnerabilities)
    const entry = {
      session_id: result.session_id,
      score: result.score,
      date: new Date().toISOString(),
      vuln_count:
        result.vulnerabilities?.length ?? result.stats?.total ?? 0,
      severities,
    }
    const history = JSON.parse(localStorage.getItem('scanHistory') || '[]')
    const next = [
      entry,
      ...(Array.isArray(history)
        ? history.filter((h) => h.session_id !== entry.session_id)
        : []),
    ].slice(0, 20)
    localStorage.setItem('scanHistory', JSON.stringify(next))
    window.dispatchEvent(new Event('focus'))
  } catch {
    // ignore localStorage errors
  }
}

function seedScanHistory() {
  try {
    const existing = JSON.parse(localStorage.getItem('scanHistory') || '[]')
    if (Array.isArray(existing) && existing.length >= 2) return

    const now = Date.now()
    localStorage.setItem(
      'scanHistory',
      JSON.stringify([
        {
          session_id: 'sess_prev_4a2b',
          score: 42,
          date: new Date(now - 3 * 24 * 60 * 60 * 1000).toISOString(),
          vuln_count: 5,
          severities: { critical: 2, high: 2, medium: 1, low: 0 },
        },
        {
          session_id: mockData.session_id,
          score: mockData.score,
          date: new Date(now).toISOString(),
          vuln_count: mockData.stats.total,
          severities: {
            critical: mockData.stats.critical,
            high: mockData.stats.high,
            medium: mockData.stats.medium,
            low: 0,
          },
        },
      ]),
    )
  } catch {
    // ignore localStorage errors
  }
}

seedScanHistory()

export default function VisualsTest() {
  const [url, setUrl] = useState('')
  const [scanning, setScanning] = useState(false)
  const [scanData, setScanData] = useState(null)
  const [error, setError] = useState(null)

  const data = scanData ?? mockData
  const heatmapFiles = useMemo(
    () => toHeatmapFiles(data.heatmap),
    [data.heatmap],
  )

  async function handleScan() {
    const trimmed = url.trim()
    if (!trimmed || scanning) return

    setError(null)
    setScanning(true)

    try {
      const result = await scanRepo(trimmed)
      setScanData(result)
      appendScanHistory(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Scan failed')
    } finally {
      setScanning(false)
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-10 px-4 py-8 text-left">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
        Visuals Test Page
      </h1>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleScan()}
          placeholder="https://github.com/org/repo"
          disabled={scanning}
          className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 font-mono text-sm text-gray-900 placeholder:text-gray-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/30 disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
        />
        <button
          type="button"
          onClick={handleScan}
          disabled={scanning || !url.trim()}
          className="rounded-lg bg-green-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {scanning ? 'Scanning…' : 'Scan'}
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-500" role="alert">
          {error}
        </p>
      )}

      {scanning && (
        <section className="space-y-3">
          <h2 className="text-sm font-medium uppercase tracking-wide text-gray-500">
            Agent feed
          </h2>
          <AgentFeed agentStatuses={SCANNING_AGENTS} />
        </section>
      )}

      <section className="space-y-3">
        <h2 className="text-sm font-medium uppercase tracking-wide text-gray-500">
          Attack graph
          {!scanData && (
            <span className="ml-2 font-normal normal-case text-gray-400">
              (mock data)
            </span>
          )}
        </h2>
        <AttackGraph
          nodes={data.attack_path?.nodes ?? []}
          edges={data.attack_path?.edges ?? []}
          onNodeClick={(id) => console.log('node:', id)}
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-medium uppercase tracking-wide text-gray-500">
          File heatmap
          {!scanData && (
            <span className="ml-2 font-normal normal-case text-gray-400">
              (mock data)
            </span>
          )}
        </h2>
        <FileHeatmap
          files={heatmapFiles}
          onFileClick={(file) => console.log('file:', file)}
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-medium uppercase tracking-wide text-gray-500">
          Badge preview
          {!scanData && (
            <span className="ml-2 font-normal normal-case text-gray-400">
              (mock data)
            </span>
          )}
        </h2>
        <BadgePreview sessionId={data.session_id} score={data.score} />
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-medium uppercase tracking-wide text-gray-500">
          Compare scans
        </h2>
        <CompareScans />
      </section>
    </div>
  )
}
