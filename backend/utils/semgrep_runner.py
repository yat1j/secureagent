def run_semgrep(code_files_dict: dict) -> list:
    """
    Semgrep doesn't run on Windows.
    Returns mock findings so the AI pipeline can be tested.
    Replace with real semgrep call when deploying on Linux/Mac.
    """
    mock_findings = []
    for filename, content in list(code_files_dict.items())[:5]:
        if "query" in content.lower() or "select" in content.lower():
            mock_findings.append({
                "file": filename, "line": 10,
                "rule_id": "sql-injection",
                "message": "Possible SQL injection via string formatting",
                "code_snippet": "query = f'SELECT * FROM users WHERE id = {user_id}'"
            })
        if "innerHTML" in content or "eval(" in content:
            mock_findings.append({
                "file": filename, "line": 25,
                "rule_id": "xss",
                "message": "Possible XSS via unsafe HTML injection",
                "code_snippet": "element.innerHTML = userInput"
            })
    return mock_findings if mock_findings else [
        {
            "file": "app.py", "line": 1,
            "rule_id": "hardcoded-secret",
            "message": "Hardcoded API key found",
            "code_snippet": "API_KEY = 'sk-abc123'"
        }
    ]