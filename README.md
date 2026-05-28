# SecureAgent 🛡️

> Find out how a hacker would break your app — before they do.

Paste a GitHub repo URL. Get a full vulnerability report with AI-powered fixes, attack chain visualisation, and a security score in under 60 seconds.

## Problem Statement
SecureAgent AI — Multi-Agent Agentic Platform for Intelligent Code Security Analysis

Background:A fast-growing startup shipped a major product update. Three days later, hackers exploited a critical vulnerability that had been sitting undetected in the codebase for months. The security scanner had generated over 300 alerts — but developers ignored them because the reports were vague, overwhelming, and offered no clear direction. By the time the breach was discovered, the damage was irreversible.

Problem:
Modern security scanners detect issues but fail to explain them, prioritize them, or fix them in a way developers can act on. The disconnect between security tools and developer workflows leaves codebases exposed — especially in fast-moving teams where no dedicated security engineer exists.

Objective:
Build a multi-agent AI security platform where specialized agents collaborate to scan a repository, detect real vulnerabilities, assess threat severity using live intelligence, and deliver clear, developer-friendly fix recommendations — all integrated directly into the development workflow.

## What it does

- **Scans** your codebase with Semgrep (OWASP Top 10 ruleset)
- **Classifies** every vulnerability with severity, business impact, and PoC payload
- **Maps** how vulnerabilities chain into multi-step attacks (D3 force graph)
- **Fixes** each issue with before/after code diffs (Monaco editor)
- **Scores** your repo 0–100 and generates an embeddable SVG badge
- **Chat** with an AI security copilot that knows your specific codebase

## Stack

| Layer | Tech |
|---|---|
| Backend | Python · FastAPI · CrewAI · Groq (LLaMA 3) · Semgrep |
| Frontend | React · Vite · Tailwind · shadcn/ui · D3.js · Monaco Editor · Framer Motion |

## Project structure
secureagent/
backend/
main.py          ← FastAPI app + all endpoints
agents/          ← 5 CrewAI agents
utils/           ← GitHub fetcher, Semgrep runner
reports/         ← in-memory session store
frontend/
src/
pages/         ← Landing.jsx, Dashboard.jsx
components/
dashboard/   ← score, vuln cards, code diff
visuals/     ← D3 attack graph, heatmap, agent feed
landing/     ← hero, chat drawer, PDF export
api.js         ← all backend calls (shared)

## API contract
POST /scan              → { session_id, score, vulnerabilities[], attack_path, heatmap }
GET  /report/{id}       → same shape
POST /chat/{id}         → { reply }
GET  /badge/{id}.svg    → SVG image

## Getting started

```bash
# Backend
cd backend
pip install fastapi uvicorn crewai groq requests semgrep python-dotenv
cp .env.example .env   # add your GROQ_API_KEY
uvicorn main:app --reload

# Frontend
cd frontend
npm install
npm run dev
```

Get a free Groq API key (no card needed): https://console.groq.com

## Team Palmary
# Members
Yatin Arora
Sai Samarth
Harshitha Sriram
Mangala Joshna

| Member | Role |
|---|---|
| M1 | Backend · AI pipeline · FastAPI · CrewAI |
| M2 | Dashboard · vuln cards · Monaco diff |
| M3 | D3 visualisations · attack graph · heatmap |
| M4 | Landing page · chat copilot · PDF export |
