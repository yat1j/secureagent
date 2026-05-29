import mockData from './mockData'
import AttackGraph from './components/visuals/AttackGraph'
import FileHeatmap from './components/visuals/FileHeatmap'
import AgentFeed from './components/visuals/AgentFeed'
import CompareScans from './components/visuals/CompareScans'

const AGENT_STATUSES = [
  {
    name: 'Semgrep',
    status: 'done',
    message: 'Scanned 47 files — 3 rules matched',
  },
  {
    name: 'Classifier',
    status: 'done',
    message: 'Ranked vulnerabilities by severity and OWASP category',
  },
  {
    name: 'Attack Mapper',
    status: 'running',
    message: 'Building exploit chain across auth and profile routes...',
  },
  {
    name: 'Reporter',
    status: 'waiting',
    message: 'Waiting for attack path analysis',
  },
]

const heatmapFiles = mockData.heatmap.map(
  ({ file, risk_score, vulns, line_count }) => ({
    file,
    risk_score,
    vuln_count: vulns,
    line_count,
  }),
)

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
    // ignore localStorage errors in restricted environments
  }
}

seedScanHistory()

export default function VisualsTest() {
  return (
    <div className="mx-auto max-w-5xl space-y-10 px-4 py-8 text-left">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
        Visuals Test Page
      </h1>

      <section className="space-y-3">
        <h2 className="text-sm font-medium uppercase tracking-wide text-gray-500">
          Attack graph
        </h2>
        <AttackGraph
          nodes={mockData.attack_path.nodes}
          edges={mockData.attack_path.edges}
          onNodeClick={(id) => console.log('node:', id)}
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-medium uppercase tracking-wide text-gray-500">
          File heatmap
        </h2>
        <FileHeatmap
          files={heatmapFiles}
          onFileClick={(file) => console.log('file:', file)}
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-medium uppercase tracking-wide text-gray-500">
          Agent feed
        </h2>
        <AgentFeed
          agentStatuses={AGENT_STATUSES}
          onComplete={() => console.log('agents complete')}
        />
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
