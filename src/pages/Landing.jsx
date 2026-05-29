import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ScanContext } from "../context/ScanContext";
import ChatDrawer from "../components/landing/ChatDrawer";

export default function Landing() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const { setScanResult } = useContext(ScanContext);
  const navigate = useNavigate();

  const handleScan = async (zipBase64 = null) => {
    if (!zipBase64 && !url.trim()) return;
    if (!zipBase64 && !url.startsWith("https://github.com")) {
      setError("Please enter a valid GitHub URL (https://github.com/...)");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const body = zipBase64 ? { zip: zipBase64 } : { url };
      const res = await fetch("http://localhost:8000/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Scan failed");
      setScanResult(data);
      localStorage.setItem("lastSession", data.session_id);
      navigate(`/dashboard/${data.session_id}`);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file || !file.name.endsWith(".zip")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.split(",")[1];
      handleScan(base64);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#080810", color: "#fff", fontFamily: "DM Sans, sans-serif" }}>

      {/* Navbar */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 48px", borderBottom: "1px solid #1a1a2e" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, background: "linear-gradient(135deg, #7c3aed, #06b6d4)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🛡</div>
          <span style={{ fontWeight: 600, fontSize: 18 }}>SecureAgent</span>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <a href="#how" style={{ color: "#9ca3af", textDecoration: "none", fontSize: 14 }}>How it works</a>
          <a href="https://github.com/yat1j/secureagent" target="_blank" rel="noreferrer"
            style={{ display: "flex", alignItems: "center", gap: 8, color: "#9ca3af", textDecoration: "none", fontSize: 14, border: "1px solid #1f2937", borderRadius: 8, padding: "8px 16px" }}>
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
            GitHub
          </a>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "100px 24px 60px", textAlign: "center" }}>
        <div style={{ display: "inline-block", background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: 20, padding: "6px 16px", fontSize: 13, color: "#a78bfa", marginBottom: 32 }}>
          AI-Powered Security Analysis
        </div>
        <h1 style={{ fontSize: "clamp(40px,7vw,72px)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-2px", marginBottom: 24 }}>
          Find out how a hacker<br />
          <span style={{ background: "linear-gradient(135deg, #7c3aed, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            would break your app.
          </span>
        </h1>
        <p style={{ fontSize: 18, color: "#9ca3af", marginBottom: 48, lineHeight: 1.6, maxWidth: 600, margin: "0 auto 48px" }}>
          Paste a GitHub repo URL and get a full vulnerability report with AI-powered fixes, attack chain visualisation, and a security score in under 60 seconds.
        </p>

        {/* Input + Drop Zone */}
        <div
          onDragOver={e => e.preventDefault()}
          onDrop={handleDrop}
          style={{ maxWidth: 700, margin: "0 auto" }}
        >
          <div style={{ display: "flex", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
            <input
              value={url}
              onChange={e => setUrl(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleScan()}
              placeholder="https://github.com/username/repo"
              style={{ flex: 1, minWidth: 280, background: "#0f0f1a", border: "1px solid #1f2937", borderRadius: 12, padding: "16px 20px", color: "#fff", fontSize: 16, outline: "none" }}
            />
            <button onClick={() => handleScan()} disabled={loading}
              style={{ background: loading ? "#374151" : "linear-gradient(135deg, #7c3aed, #06b6d4)", border: "none", borderRadius: 12, padding: "16px 32px", color: "#fff", fontSize: 16, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", whiteSpace: "nowrap" }}>
              {loading ? "Scanning..." : "Scan now →"}
            </button>
          </div>
          <p style={{ fontSize: 13, color: "#4b5563", marginBottom: 8 }}>or drag and drop a .zip file anywhere above</p>
        </div>

        {error && <p style={{ color: "#f87171", fontSize: 14, marginTop: 12 }}>{error}</p>}
        {loading && <p style={{ color: "#9ca3af", fontSize: 14, marginTop: 12 }}>⏳ Running AI agents... ~30 seconds</p>}

        {/* Badges */}
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginTop: 32 }}>
          {["SQL Injection", "XSS", "Hardcoded Secrets", "Broken Auth", "Path Traversal"].map(b => (
            <span key={b} style={{ background: "#0f0f1a", border: "1px solid #1f2937", borderRadius: 20, padding: "6px 14px", fontSize: 13, color: "#6b7280" }}>{b}</span>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div id="how" style={{ maxWidth: 900, margin: "0 auto", padding: "60px 24px", borderTop: "1px solid #0f0f1a" }}>
        <h2 style={{ textAlign: "center", fontSize: 28, fontWeight: 700, marginBottom: 48 }}>How it works</h2>
        <div style={{ display: "flex", gap: 32, justifyContent: "center", flexWrap: "wrap" }}>
          {[
            { n: "1", title: "Paste your repo", desc: "Drop in any public GitHub URL or upload a .zip file" },
            { n: "2", title: "AI agents scan", desc: "5 CrewAI agents analyse, classify, and chain vulnerabilities" },
            { n: "3", title: "Get your report", desc: "Score, fixes, attack graph, and PDF report in under 60 seconds" }
          ].map(s => (
            <div key={s.n} style={{ textAlign: "center", maxWidth: 240 }}>
              <div style={{ width: 48, height: 48, background: "linear-gradient(135deg, #7c3aed, #06b6d4)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700, margin: "0 auto 16px" }}>{s.n}</div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>{s.title}</h3>
              <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", justifyContent: "center", gap: 48, padding: "40px 24px", borderTop: "1px solid #0f0f1a", flexWrap: "wrap" }}>
        {[["< 60s", "Scan time"], ["5 AI Agents", "Working in parallel"], ["OWASP Top 10", "Ruleset covered"], ["Free", "No signup needed"]].map(([val, label]) => (
          <div key={label} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 24, fontWeight: 700 }}>{val}</div>
            <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Chat drawer */}
      <ChatDrawer isOpen={chatOpen} onClose={() => setChatOpen(false)} sessionId={sessionId || localStorage.getItem("lastSession")} />

      {/* Floating chat button — only shows if there's a session */}
      {localStorage.getItem("lastSession") && (
        <button onClick={() => setChatOpen(true)}
          style={{ position: "fixed", bottom: 32, right: 32, background: "linear-gradient(135deg, #7c3aed, #06b6d4)", border: "none", borderRadius: "50%", width: 56, height: 56, fontSize: 24, cursor: "pointer", boxShadow: "0 8px 32px rgba(124,58,237,0.4)", zIndex: 999 }}>
          💬
        </button>
      )}
    </div>
  );
}
