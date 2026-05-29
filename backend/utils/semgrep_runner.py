def run_semgrep(code_files_dict: dict) -> list:
    mock_findings = []
    for filename, content in list(code_files_dict.items())[:10]:
        if "query" in content.lower() or "select" in content.lower() or "execute" in content.lower():
            mock_findings.append({
                "file": filename, "line": 10,
                "rule_id": "sql-injection",
                "message": "Possible SQL injection via string formatting",
                "severity": "critical",
                "code_snippet": "query = f'SELECT * FROM users WHERE id = {user_id}'"
            })
        if "innerhtml" in content.lower() or "eval(" in content.lower() or "document.write" in content.lower():
            mock_findings.append({
                "file": filename, "line": 25,
                "rule_id": "xss",
                "message": "Possible XSS via unsafe HTML injection",
                "severity": "high",
                "code_snippet": "element.innerHTML = userInput"
            })
        if "password" in content.lower() or "secret" in content.lower() or "api_key" in content.lower():
            mock_findings.append({
                "file": filename, "line": 5,
                "rule_id": "hardcoded-secret",
                "message": "Hardcoded secret or password found",
                "severity": "high",
                "code_snippet": "password = 'admin123'"
            })
        if "pickle.load" in content.lower() or "subprocess" in content.lower():
            mock_findings.append({
                "file": filename, "line": 15,
                "rule_id": "unsafe-deserialization",
                "message": "Unsafe deserialization or command execution",
                "severity": "critical",
                "code_snippet": "pickle.loads(user_data)"
            })
        if "random" in content.lower() and "token" in content.lower():
            mock_findings.append({
                "file": filename, "line": 30,
                "rule_id": "weak-random",
                "message": "Weak random number generator used for security token",
                "severity": "medium",
                "code_snippet": "token = str(random.random())"
            })

    return mock_findings if mock_findings else [
        {
            "file": list(code_files_dict.keys())[0] if code_files_dict else "app.py",
            "line": 1,
            "rule_id": "hardcoded-secret",
            "message": "Hardcoded API key found",
            "severity": "high",
            "code_snippet": "API_KEY = 'sk-abc123'"
        }
    ]