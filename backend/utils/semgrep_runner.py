import subprocess
import json

def run_semgrep(folder_path: str) -> list:
    """
    Runs Semgrep with OWASP Top 10 ruleset on the given folder.
    Returns list of raw findings.
    """
    result = subprocess.run(
        [
            "semgrep",
            "--config", "p/owasp-top-ten",
            "--json",
            folder_path
        ],
        capture_output=True,
        text=True
    )

    if result.returncode not in (0, 1):  # 1 = findings found, that's fine
        raise Exception(f"Semgrep error: {result.stderr}")

    data = json.loads(result.stdout)
    return data.get("results", [])
