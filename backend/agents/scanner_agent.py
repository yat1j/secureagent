from groq import Groq
import os

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def run_scanner(semgrep_findings: list) -> list:
    """
    Agent 1: Takes raw Semgrep findings, enriches each with
    explanation, business_impact, fixed_code, poc_payload.
    Returns enriched vulnerabilities list.
    """
    # TODO: for each finding, call Groq with prompt from ai_tools_and_prompts doc
    enriched = []
    for finding in semgrep_findings:
        # Groq call goes here
        enriched.append(finding)
    return enriched
