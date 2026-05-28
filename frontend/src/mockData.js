export const mockScan = {
  session_id: "abc12345",
  score: 34,
  summary: "This codebase has critical SQL injection and XSS vulnerabilities that could allow full database access and session hijacking.",
  stats: { files: 14, total: 7, critical: 3, high: 2, medium: 2 },
  vulnerabilities: [
    {
      id: "v1", title: "SQL Injection", file: "db/queries.py", line: 42,
      owasp: "A03", severity: "critical",
      explanation: "User input passed directly into SQL query without sanitisation.",
      business_impact: "Attacker can dump entire database including user passwords.",
      broken_code: "query = f\"SELECT * FROM users WHERE id = {user_id}\"",
      fixed_code: "query = \"SELECT * FROM users WHERE id = %s\"\ncursor.execute(query, (user_id,))",
      fix_effort: "30 min",
      poc_payload: "1 OR 1=1--"
    },
    {
      id: "v2", title: "Reflected XSS", file: "routes/search.py", line: 17,
      owasp: "A07", severity: "high",
      explanation: "Search query reflected in response without escaping.",
      business_impact: "Attacker can steal session cookies and impersonate users.",
      broken_code: "return f\"<p>Results for: {query}</p>\"",
      fixed_code: "from markupsafe import escape\nreturn f\"<p>Results for: {escape(query)}</p>\"",
      fix_effort: "15 min",
      poc_payload: "<script>alert(document.cookie)</script>"
    }
  ],
  attack_path: {
    nodes: [
      { id: "v1", file: "db/queries.py", vuln: "SQL Injection" },
      { id: "v2", file: "routes/search.py", vuln: "XSS" }
    ],
    edges: [
      { from: "v2", to: "v1", reason: "XSS steals session → SQL used to escalate" }
    ]
  },
  heatmap: [
    { file: "db/queries.py", risk_score: 95, vulns: 3 },
    { file: "routes/search.py", risk_score: 70, vulns: 2 },
    { file: "auth/login.py", risk_score: 40, vulns: 1 },
    { file: "utils/helpers.py", risk_score: 10, vulns: 1 }
  ]
}
