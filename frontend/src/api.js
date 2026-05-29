// api.js — all backend calls go here
// When M1's backend is ready, set REAL_API = true and update BASE_URL

const REAL_API = false; // flip to true when M1 is ready
const BASE_URL = "http://localhost:8000";

import { mockScan as mockData } from "./mockData";

// POST /scan — send a GitHub URL or zip, get scan result back
export async function startScan(url) {
  if (!REAL_API) {
    // simulate a 2-second delay so the loading state looks real
    await new Promise((r) => setTimeout(r, 2000));
    return mockData;
  }
  const res = await fetch(`${BASE_URL}/scan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  return res.json();
}

// GET /report/:id — fetch a previously saved scan
export async function getReport(sessionId) {
  if (!REAL_API) {
    await new Promise((r) => setTimeout(r, 500));
    return mockData;
  }
  const res = await fetch(`${BASE_URL}/report/${sessionId}`);
  return res.json();
}

// POST /chat/:id — ask a question about the scan
export async function askChat(sessionId, question) {
  if (!REAL_API) {
    await new Promise((r) => setTimeout(r, 1000));
    return { reply: "This is a mocked AI response. Connect M1's backend to get real answers about your scan." };
  }
  const res = await fetch(`${BASE_URL}/chat/${sessionId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });
  return res.json();
}
