# SecureAgent 🔐

> AI-powered security analysis for your codebase. Paste a GitHub repo, get a full vulnerability report in seconds.

## What it does

SecureAgent scans your code using a multi-agent AI pipeline and gives you:

- **Security score** out of 100 with animated risk assessment
- **Vulnerability detection** mapped to OWASP Top 10 categories
- **Priority fix queue** — the top 3 issues to fix first
- **Code diff** — broken code vs fixed code, side by side
- **Proof of concept payloads** for each vulnerability
- **Attack path graph** — how vulnerabilities chain together
- **File heatmap** — which files carry the most risk
- **AI chat** — ask questions about your scan results

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, Vite, Tailwind CSS |
| Visualizations | D3.js |
| Code Diff | Monaco Editor |
| Backend | Python, FastAPI |
| AI Agents | CrewAI |
| Code Scanning | Semgrep |
| Source Fetching | GitHub API |

## Team

| Member | Role |
|--------|------|
| M1 | Backend & AI agents (CrewAI pipeline) |
| M2 | Dashboard frontend |
| M3 | Visualizations (Attack graph, File heatmap) |
| M4 | Landing page & AI chat drawer |

## Running locally

```bash
# Frontend
cd frontend
npm install
npm run dev

# Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

Open `http://localhost:5173` and paste a GitHub repo URL to scan.

## Architecture

```
GitHub Repo URL
      ↓
 GitHub Fetcher (fetch files)
      ↓
 Semgrep Scanner (static analysis)
      ↓
 CrewAI Pipeline:
   ├── Scanner Agent     (find vulnerabilities)
   ├── Classifier Agent  (OWASP mapping + severity)
   ├── Report Agent      (business impact + fix)
   ├── Attack Chain Agent (chain vulnerabilities)
   └── Chat Agent        (answer questions)
      ↓
 Dashboard (score, vulns, graph, heatmap)
```
