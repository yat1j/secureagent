# SecureAgent 🛡️

> Find out how a hacker would break your app — before they do.

Paste a GitHub repo URL. Get a full vulnerability report with AI-powered fixes, attack chain visualisation, and a security score in under 60 seconds.

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
