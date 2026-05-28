from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uuid
import os
from dotenv import load_dotenv

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

# --- Request models ---
class ScanRequest(BaseModel):
    url: str | None = None
    zip: str | None = None  # base64 encoded

class ChatRequest(BaseModel):
    question: str

# --- Endpoints ---

@app.post("/scan")
async def scan(body: ScanRequest):
    # TODO: call utils/github_fetcher.py → utils/semgrep_runner.py → agents pipeline
    session_id = str(uuid.uuid4())[:8]
    reports[session_id] = {}  # replace with real result
    return {"session_id": session_id}

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
    # TODO: call Agent 5 with report + body.question
    return {"reply": ""}

@app.get("/scan-status/{session_id}")
async def scan_status_endpoint(session_id: str):
    status = scan_status.get(session_id, {"stage": "queued", "agents_done": []})
    return status

@app.get("/badge/{session_id}.svg")
async def badge(session_id: str):
    report = reports.get(session_id)
    if not report:
        raise HTTPException(status_code=404, detail="Session not found")
    score = report.get("score", 0)
    # TODO: generate SVG string based on score
    color = "#1D9E75" if score >= 80 else "#BA7517" if score >= 50 else "#E24B4A"
    svg = f"""<svg><!-- badge for score {score} --></svg>"""
    from fastapi.responses import Response
    return Response(content=svg, media_type="image/svg+xml")
