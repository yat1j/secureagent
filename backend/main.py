import asyncio
import json
import re
import uuid
from agents.chat_agent import run_chat

from dotenv import load_dotenv
load_dotenv()
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pydantic import BaseModel

from agents.pipeline import run_pipeline
from utils.badge import generate_badge_svg
from utils.github_fetcher import fetch_github_repo
from utils.semgrep_runner import run_semgrep

load_dotenv()

app = FastAPI(title="SecureAgent API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory session store — no database needed
reports = {}
scan_status = {}

SEVERITY_WEIGHT = {"critical": 4, "high": 3, "medium": 2, "low": 1}


# --- Request models ---
class ScanRequest(BaseModel):
    url: str | None = None
    zip: str | None = None  # base64 encoded


class ChatRequest(BaseModel):
    question: str


def calculate_score(vulnerabilities: list) -> int:
    score = 100
    for v in vulnerabilities:
        severity = v.get("severity", "low")
        # Handle numeric severity scores
        if isinstance(severity, (int, float)):
            if severity >= 9:
                score -= 20
            elif severity >= 7:
                score -= 10
            elif severity >= 4:
                score -= 5
            else:
                score -= 2
        else:
            severity = str(severity).lower()
            if severity == "critical":
                score -= 20
            elif severity == "high":
                score -= 10
            elif severity == "medium":
                score -= 5
            elif severity == "low":
                score -= 2
    return max(0, score)


def _parse_json_from_text(text: str):
    if not text:
        return None
    text = text.strip()
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass
    for pattern in (
        r"```(?:json)?\s*(\{.*?\}|\[.*?\])\s*```",
        r"(\{.*\})",
        r"(\[.*\])",
    ):
        match = re.search(pattern, text, re.DOTALL)
        if match:
            try:
                return json.loads(match.group(1))
            except json.JSONDecodeError:
                continue
    return None


def _findings_to_vulnerabilities(findings: list) -> list:
    vulns = []
    for f in findings:
        vulns.append(
            {
                "file": f.get("file"),
                "line": f.get("line"),
                "rule_id": f.get("rule_id"),
                "message": f.get("message"),
                "code_snippet": f.get("code_snippet"),
                "severity": f.get("severity", "medium"),
            }
        )
    return vulns


def _merge_vulnerabilities(base: list, enriched: list) -> list:
    if not enriched:
        return base
    merged = []
    for i, item in enumerate(enriched):
        vuln = {**base[i], **item} if i < len(base) else dict(item)
        if "severity" not in vuln:
            score = vuln.get("severity_score")
            if isinstance(score, (int, float)):
                if score >= 9:
                    vuln["severity"] = "critical"
                elif score >= 7:
                    vuln["severity"] = "high"
                elif score >= 4:
                    vuln["severity"] = "medium"
                else:
                    vuln["severity"] = "low"
            else:
                vuln["severity"] = "medium"
        merged.append(vuln)
    return merged or base


def _build_heatmap(vulnerabilities: list, code_files: dict) -> list:
    per_file: dict[str, dict] = {}
    for path in code_files:
        per_file[path] = {"file": path, "count": 0, "risk": 0}

    for v in vulnerabilities:
        path = v.get("file") or "unknown"
        if path not in per_file:
            per_file[path] = {"file": path, "count": 0, "risk": 0}
        per_file[path]["count"] += 1
        severity = str(v.get("severity", "low")).lower()
        per_file[path]["risk"] = max(
            per_file[path]["risk"],
            SEVERITY_WEIGHT.get(severity, 1),
        )

    return sorted(per_file.values(), key=lambda x: (-x["risk"], -x["count"], x["file"]))


def _extract_report(pipeline_result, findings: list, code_files: dict) -> dict:
    vulnerabilities = _findings_to_vulnerabilities(findings)
    attack_path = {"nodes": [], "edges": []}
    summary = ""

    outputs: list[str] = []
    if hasattr(pipeline_result, "tasks_output") and pipeline_result.tasks_output:
        outputs = [
            getattr(t, "raw", "") or str(t)
            for t in pipeline_result.tasks_output
        ]
    else:
        outputs = [getattr(pipeline_result, "raw", None) or str(pipeline_result)]

    for i, text in enumerate(outputs):
        data = _parse_json_from_text(text)
        if data is None:
            continue
        if i == 0 and isinstance(data, list):
            vulnerabilities = _merge_vulnerabilities(vulnerabilities, data)
        elif isinstance(data, dict) and "nodes" in data and "edges" in data:
            attack_path = {
                "nodes": data.get("nodes", []),
                "edges": data.get("edges", []),
            }
        elif isinstance(data, dict) and data.get("summary"):
            summary = data["summary"]

    if not summary and outputs:
        last = _parse_json_from_text(outputs[-1])
        if isinstance(last, dict):
            summary = last.get("summary", "") or summary

    return {
        "vulnerabilities": vulnerabilities,
        "attack_path": attack_path,
        "heatmap": _build_heatmap(vulnerabilities, code_files),
        "summary": summary,
    }


# --- Endpoints ---


@app.post("/scan")
async def scan(body: ScanRequest):
    if not body.url:
        raise HTTPException(status_code=400, detail="url is required")

    session_id = str(uuid.uuid4())[:8]
    scan_status[session_id] = {"stage": "fetching", "agents_done": []}

    try:
        code_files = await asyncio.to_thread(fetch_github_repo, body.url)
        if not code_files:
            raise HTTPException(status_code=400, detail="Could not fetch repository files")

        scan_status[session_id] = {"stage": "scanning", "agents_done": []}
        findings = await asyncio.to_thread(run_semgrep, code_files)

        scan_status[session_id] = {"stage": "analyzing", "agents_done": []}

        def on_agent_done(agents_done: list[str]) -> None:
            scan_status[session_id] = {"stage": "analyzing", "agents_done": agents_done}

        pipeline_result = await asyncio.to_thread(
            run_pipeline, findings, code_files, on_agent_done
        )

        report = _extract_report(pipeline_result, findings, code_files)
        score = calculate_score(report["vulnerabilities"])

        result = {
            "session_id": session_id,
            "score": score,
            "vulnerabilities": report["vulnerabilities"],
            "attack_path": report["attack_path"],
            "heatmap": report["heatmap"],
            "summary": report["summary"],
        }
        reports[session_id] = result
        scan_status[session_id] = {
            "stage": "done",
            "agents_done": ["analyst", "fixer", "mapper", "reporter"],
        }
        return result
    except HTTPException:
        raise
    except Exception as exc:
        scan_status[session_id] = {"stage": "error", "agents_done": []}
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@app.get("/report/{session_id}")
async def get_report(session_id: str):
    report = reports.get(session_id)
    if not report:
        raise HTTPException(status_code=404, detail="Session not found")
    return report


@app.post("/chat/{session_id}")
async def chat(session_id: str, body: ChatRequest):
    report = reports.get(session_id)
    if not report:
        raise HTTPException(status_code=404, detail="Session not found")
    reply = await asyncio.to_thread(run_chat, report, body.question)
    return {"reply": reply}


@app.get("/scan-status/{session_id}")
async def scan_status_endpoint(session_id: str):
    if session_id not in scan_status:
        raise HTTPException(status_code=404, detail="Session not found")
    return scan_status[session_id]


@app.get("/badge/{session_id}.svg")
async def badge(session_id: str):
    report = reports.get(session_id)
    if not report:
        raise HTTPException(status_code=404, detail="Session not found")
    score = report.get("score", 0)
    svg = generate_badge_svg(score)
    return Response(content=svg, media_type="image/svg+xml")