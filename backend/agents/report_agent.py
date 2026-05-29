def run_report_writer(vulns: list) -> dict:
    """
    Agent 4: Calculates score, writes executive summary,
    generates priority queue.
    Returns { score, summary, priority_queue }
    """
    # Score formula
    score = 100
    for v in vulns:
        severity = v.get("severity", "low")
        if severity == "critical": score -= 20
        elif severity == "high": score -= 10
        elif severity == "medium": score -= 5
        elif severity == "low": score -= 2
    score = max(0, score)

    # TODO: Groq call for executive summary
    summary = ""

    return {"score": score, "summary": summary, "priority_queue": vulns}
