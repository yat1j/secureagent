// mockData.js — use this until M1's backend is ready
// Every member imports from here. When M1 is done, swap api.js to real calls.

const mockData = {
  session_id: "a1b2c3d4",
  score: 34,
  summary:
    "This codebase contains critical SQL injection and XSS vulnerabilities that expose user data to full database compromise. The most dangerous issue is an unsanitised SQL query in login.php that allows an attacker to bypass authentication entirely. Estimated remediation time is 3–4 hours for a developer familiar with parameterised queries.",
  stats: {
    files: 14,
    total: 7,
    critical: 3,
    high: 2,
    medium: 2,
    est_fix: "2h 20m",
  },
  vulnerabilities: [
    {
      id: "vuln-1",
      title: "SQL Injection",
      file: "login.php",
      line: 42,
      owasp: "A03:2021",
      severity: "critical",
      explanation:
        "User input is directly concatenated into a SQL query without sanitisation. An attacker can inject SQL commands to bypass login or dump the entire database.",
      business_impact:
        "Full database access — attacker can read all user records, passwords, and PII.",
      broken_code: `function login($username, $password) {\n  $query = "SELECT * FROM users WHERE username='$username' AND password='$password'";\n  $result = mysqli_query($conn, $query);\n  return mysqli_fetch_assoc($result);\n}`,
      fixed_code: `function login($username, $password) {\n  $stmt = $conn->prepare("SELECT * FROM users WHERE username=? AND password=?");\n  $stmt->bind_param("ss", $username, $password);\n  $stmt->execute();\n  return $stmt->get_result()->fetch_assoc();\n}`,
      fix_effort: "30 min",
      poc_payload: "' OR '1'='1' -- ",
    },
    {
      id: "vuln-2",
      title: "Reflected XSS",
      file: "search.php",
      line: 18,
      owasp: "A03:2021",
      severity: "critical",
      explanation:
        "The search query parameter is echoed directly into the HTML response without encoding. An attacker can inject scripts that run in victims' browsers.",
      business_impact:
        "Session hijacking — attacker can steal auth cookies and impersonate any user.",
      broken_code: `echo "<p>Results for: " . $_GET['q'] . "</p>";`,
      fixed_code: `echo "<p>Results for: " . htmlspecialchars($_GET['q'], ENT_QUOTES, 'UTF-8') . "</p>";`,
      fix_effort: "15 min",
      poc_payload: `<script>alert(document.cookie)</script>`,
    },
    {
      id: "vuln-3",
      title: "Hardcoded Secret",
      file: "config.py",
      line: 7,
      owasp: "A02:2021",
      severity: "critical",
      explanation:
        "A database password is hardcoded in the source file. Anyone with repo access can read it, and it will be exposed if the repo becomes public.",
      business_impact:
        "Full database takeover — anyone who sees the repo can connect directly to production.",
      broken_code: `DB_PASSWORD = "admin1234"\nDB_HOST = "prod-db.internal"`,
      fixed_code: `import os\nDB_PASSWORD = os.environ.get("DB_PASSWORD")\nDB_HOST = os.environ.get("DB_HOST")`,
      fix_effort: "10 min",
      poc_payload: "grep -r 'password' . (run in repo root)",
    },
    {
      id: "vuln-4",
      title: "Broken Access Control",
      file: "admin.php",
      line: 3,
      owasp: "A01:2021",
      severity: "high",
      explanation:
        "The admin panel only checks if a query parameter is present, not whether the user has admin privileges. Any user can access admin functions.",
      business_impact:
        "Any logged-in user can access admin functions, delete data, or promote themselves.",
      broken_code: `if (isset($_GET['admin'])) {\n  // show admin panel\n}`,
      fixed_code: `if (isset($_SESSION['role']) && $_SESSION['role'] === 'admin') {\n  // show admin panel\n}`,
      fix_effort: "20 min",
      poc_payload: "GET /admin.php?admin=1",
    },
    {
      id: "vuln-5",
      title: "Path Traversal",
      file: "download.php",
      line: 11,
      owasp: "A01:2021",
      severity: "high",
      explanation:
        "A filename from user input is used directly in a file read call. An attacker can traverse directories to read system files.",
      business_impact:
        "Attacker can read /etc/passwd, private keys, or any file on the server.",
      broken_code: `$file = $_GET['file'];\nreadfile("/uploads/" . $file);`,
      fixed_code: `$file = basename($_GET['file']);\n$path = realpath("/uploads/" . $file);\nif (strpos($path, realpath("/uploads/")) === 0) {\n  readfile($path);\n}`,
      fix_effort: "25 min",
      poc_payload: "GET /download.php?file=../../etc/passwd",
    },
    {
      id: "vuln-6",
      title: "Insecure Deserialization",
      file: "session.php",
      line: 28,
      owasp: "A08:2021",
      severity: "medium",
      explanation:
        "PHP unserialize() is called on user-supplied cookie data. Malicious serialised objects can trigger code execution.",
      business_impact: "Remote code execution — attacker can run arbitrary commands on the server.",
      broken_code: `$user = unserialize($_COOKIE['user_data']);`,
      fixed_code: `$user = json_decode(base64_decode($_COOKIE['user_data']), true);`,
      fix_effort: "40 min",
      poc_payload: 'Cookie: user_data=O:8:"stdClass":1:{s:4:"exec";s:2:"id";}',
    },
    {
      id: "vuln-7",
      title: "Missing CSRF Protection",
      file: "transfer.php",
      line: 5,
      owasp: "A01:2021",
      severity: "medium",
      explanation:
        "State-changing POST endpoints lack CSRF tokens. A malicious site can trick logged-in users into submitting forged requests.",
      business_impact:
        "Attacker can perform actions on behalf of any logged-in user — transfer funds, change passwords.",
      broken_code: `if ($_POST['amount']) {\n  transfer($_SESSION['user'], $_POST['to'], $_POST['amount']);\n}`,
      fixed_code: `if ($_POST['amount'] && hash_equals($_SESSION['csrf'], $_POST['csrf_token'])) {\n  transfer($_SESSION['user'], $_POST['to'], $_POST['amount']);\n}`,
      fix_effort: "45 min",
      poc_payload: '<form action="https://target/transfer.php" method="POST">...</form>',
    },
  ],
  attack_path: {
    nodes: [
      { id: "vuln-1", file: "login.php", vuln: "SQL Injection" },
      { id: "vuln-2", file: "search.php", vuln: "XSS" },
      { id: "vuln-4", file: "admin.php", vuln: "Broken Access Control" },
      { id: "vuln-3", file: "config.py", vuln: "Hardcoded Secret" },
    ],
    edges: [
      { from: "vuln-1", to: "vuln-4", reason: "bypass auth → gain admin" },
      { from: "vuln-2", to: "vuln-1", reason: "steal session → reuse in SQLi" },
      { from: "vuln-4", to: "vuln-3", reason: "admin panel exposes config" },
    ],
  },
  heatmap: [
    { file: "login.php", risk_score: 95, vulns: 1 },
    { file: "search.php", risk_score: 80, vulns: 1 },
    { file: "admin.php", risk_score: 75, vulns: 1 },
    { file: "config.py", risk_score: 90, vulns: 1 },
    { file: "download.php", risk_score: 70, vulns: 1 },
    { file: "session.php", risk_score: 60, vulns: 1 },
    { file: "transfer.php", risk_score: 55, vulns: 1 },
    { file: "index.php", risk_score: 10, vulns: 0 },
    { file: "utils.php", risk_score: 5, vulns: 0 },
  ],
};

export default mockData;
