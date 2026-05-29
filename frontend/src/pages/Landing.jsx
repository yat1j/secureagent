import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

// ─── Spotlight ───────────────────────────────────────────────────────────────
function Spotlight() {
  return (
    <div style={{
      position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
      width: "100%", height: "100%", pointerEvents: "none", zIndex: 0,
      background: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(124,58,237,0.3), transparent)",
    }} />
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  return (
    <nav style={{ borderBottom: "1px solid #1f2937", background: "#080810", position: "relative", zIndex: 10 }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 24 }}>🛡️</span>
          <span style={{ fontSize: 20, fontWeight: 700, color: "#fff" }}>SecureAgent</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <a href="#how-it-works" style={{ fontSize: 14, color: "#9ca3af", textDecoration: "none" }}>How it works</a>
          <a href="https://github.com/yat1j/secureagent" target="_blank" rel="noreferrer"
            style={{ padding: 8, borderRadius: 8, color: "#9ca3af", display: "flex" }}>
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
            </svg>
          </a>
        </div>
      </div>
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero({ onScan, loading, error }) {
  const [url, setUrl] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (!file || !file.name.endsWith(".zip")) return;
    const reader = new FileReader();
    reader.onload = () => onScan(null, reader.result.split(",")[1]);
    reader.readAsDataURL(file);
  };

  return (
    <section style={{ position: "relative", background: "#080810", padding: "100px 24px 80px", overflow: "hidden" }}>
      <Spotlight />
      <div style={{ maxWidth: 800, margin: "0 auto", position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 28 }}>

        {/* Badge */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div style={{ display: "inline-block", borderRadius: 999, background: "rgba(124,58,237,0.2)", padding: "8px 16px", border: "1px solid rgba(124,58,237,0.3)" }}>
            <span style={{ fontSize: 14, fontWeight: 500, color: "#c4b5fd" }}>✨ AI-Powered Security Analysis</span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ margin: 0, fontSize: "clamp(40px, 6vw, 68px)", fontWeight: 800, color: "#fff", lineHeight: 1.1, letterSpacing: "-1px" }}
        >
          Find out how a hacker would{" "}
          <span style={{ background: "linear-gradient(135deg, #a78bfa, #67e8f9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            break your app
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{ fontSize: 18, color: "#9ca3af", maxWidth: 560, margin: 0, lineHeight: 1.7 }}
        >
          Paste a GitHub repo URL and get a full vulnerability report with AI-powered fixes in under 60 seconds.
        </motion.p>

        {/* Input + Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          style={{ width: "100%", maxWidth: 680 }}
          onDragOver={e => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
        >
          <div style={{ display: "flex", gap: 12 }}>
            <input
              value={url}
              onChange={e => setUrl(e.target.value)}
              onKeyDown={e => e.key === "Enter" && onScan(url)}
              type="text"
              placeholder="https://github.com/username/repo"
              style={{ flex: 1, background: "#0f0f1a", border: `1px solid ${dragActive ? "#7c3aed" : "#1f2937"}`, borderRadius: 12, padding: "16px 20px", color: "#fff", fontSize: 16, outline: "none" }}
            />
            <button
              onClick={() => onScan(url)}
              disabled={loading}
              style={{ background: loading ? "#374151" : "linear-gradient(135deg, #7c3aed, #6d28d9)", border: "none", borderRadius: 12, padding: "16px 28px", color: "#fff", fontSize: 16, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", whiteSpace: "nowrap" }}
            >
              {loading ? "Scanning..." : "Scan now →"}
            </button>
          </div>
          <p style={{ fontSize: 13, color: "#6b7280", marginTop: 10 }}>or drag and drop a .zip file</p>
          {error && <p style={{ fontSize: 14, color: "#f87171", marginTop: 8 }}>{error}</p>}
          {loading && <p style={{ fontSize: 14, color: "#9ca3af", marginTop: 8 }}>⏳ Running AI agents... ~30 seconds</p>}
        </motion.div>

        {/* Pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10 }}
        >
          {["SQL Injection", "XSS", "Hardcoded Secrets", "Broken Auth", "Path Traversal"].map(v => (
            <div key={v} style={{ padding: "8px 16px", borderRadius: 999, background: "#0f0f1a", border: "1px solid #1f2937", fontSize: 14, color: "#9ca3af" }}>{v}</div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── StatsBar ─────────────────────────────────────────────────────────────────
function StatsBar() {
  const stats = [
    { value: "< 60s", label: "Scan time" },
    { value: "5 AI Agents", label: "Working in parallel" },
    { value: "OWASP Top 10", label: "Ruleset covered" },
    { value: "Free", label: "No signup needed" },
  ];
  return (
    <section style={{ background: "#080810", padding: "56px 24px", borderTop: "1px solid #1f2937", borderBottom: "1px solid #1f2937" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 32 }}>
        {stats.map((s, i) => (
          <motion.div key={s.label}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            viewport={{ once: true }}
          >
            <div style={{ fontSize: 26, fontWeight: 700, background: "linear-gradient(135deg, #a78bfa, #67e8f9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 6 }}>{s.value}</div>
            <div style={{ fontSize: 14, color: "#9ca3af" }}>{s.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── HowItWorks ───────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    { number: "01", title: "Paste your repo", description: "Drop in any public GitHub URL or upload a .zip file" },
    { number: "02", title: "AI agents scan", description: "5 CrewAI agents analyse, classify, and chain vulnerabilities" },
    { number: "03", title: "Get your report", description: "Score, fixes, attack graph, and PDF report in under 60 seconds" },
  ];
  return (
    <section id="how-it-works" style={{ background: "#080810", padding: "100px 24px" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }} viewport={{ once: true }}
          style={{ textAlign: "center", marginBottom: 72 }}
        >
          <h2 style={{ fontSize: 40, fontWeight: 700, color: "#fff", marginBottom: 16 }}>How it works</h2>
          <p style={{ fontSize: 18, color: "#9ca3af" }}>Three simple steps to secure your application</p>
        </motion.div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 48 }}>
          {steps.map((step, i) => (
            <motion.div key={step.number}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.15 }} viewport={{ once: true }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}
            >
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg, rgba(124,58,237,0.4), rgba(109,40,217,0.2))", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24, border: "1px solid rgba(124,58,237,0.4)" }}>
                <span style={{ fontSize: 20, fontWeight: 700, background: "linear-gradient(135deg, #a78bfa, #c4b5fd)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{step.number}</span>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 12 }}>{step.title}</h3>
              <p style={{ fontSize: 14, color: "#9ca3af", lineHeight: 1.7 }}>{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── ChatDrawer ───────────────────────────────────────────────────────────────
function ChatDrawer({ sessionId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (text) => {
    const q = text || input.trim();
    if (!q) return;
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: q }]);
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/chat/${sessionId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "ai", content: data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "ai", content: "Error reaching backend." }]);
    }
    setLoading(false);
  };

  const suggested = ["Which file is most dangerous?", "Explain this XSS simply", "How do I fix the SQL injection?"];

  return (
    <>
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, duration: 0.4 }}
        onClick={() => setIsOpen(true)}
        style={{ position: "fixed", bottom: 32, right: 32, width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg, #7c3aed, #6d28d9)", border: "none", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 8px 32px rgba(124,58,237,0.4)", zIndex: 40 }}>
        <MessageCircle size={24} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 40 }} />
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              style={{ position: "fixed", right: 0, top: 0, height: "100vh", width: 320, background: "#0f0f1a", borderLeft: "1px solid #1f2937", zIndex: 50, display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid #1f2937" }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>Security Copilot</div>
                  <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>Ask anything about this scan</div>
                </div>
                <button onClick={() => setIsOpen(false)} style={{ padding: 8, borderRadius: 8, background: "none", border: "none", color: "#9ca3af", cursor: "pointer" }}>
                  <X size={20} />
                </button>
              </div>
              <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
                {messages.length === 0 && (
                  <div>
                    <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 12 }}>Suggested questions:</p>
                    {suggested.map(s => (
                      <button key={s} onClick={() => send(s)} style={{ display: "block", width: "100%", textAlign: "left", background: "#1f2937", border: "1px solid #374151", borderRadius: 8, padding: "10px 14px", color: "#9ca3af", fontSize: 13, cursor: "pointer", marginBottom: 8 }}>{s}</button>
                    ))}
                  </div>
                )}
                {messages.map((m, i) => (
                  <div key={i} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "85%", background: m.role === "user" ? "#7c3aed" : "#1f2937", borderRadius: m.role === "user" ? "12px 12px 2px 12px" : "12px 12px 12px 2px", padding: "10px 14px", fontSize: 13, color: "#fff", lineHeight: 1.6 }}>
                    {m.content}
                  </div>
                ))}
                {loading && (
                  <div style={{ alignSelf: "flex-start", background: "#1f2937", borderRadius: "12px 12px 12px 2px", padding: "10px 14px" }}>
                    <span style={{ color: "#6b7280", fontSize: 13 }}>Thinking...</span>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>
              <div style={{ padding: "12px 16px", borderTop: "1px solid #1f2937", display: "flex", gap: 8 }}>
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && send()}
                  placeholder="Ask about a vulnerability..."
                  style={{ flex: 1, background: "#1f2937", border: "1px solid #374151", borderRadius: 8, padding: "10px 14px", color: "#fff", fontSize: 13, outline: "none" }}
                />
                <button onClick={() => send()} style={{ background: "#7c3aed", border: "none", borderRadius: 8, padding: "10px 16px", color: "#fff", cursor: "pointer", fontSize: 13 }}>→</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Landing ──────────────────────────────────────────────────────────────────
export default function Landing() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleScan = async (url, zipBase64 = null) => {
    if (!zipBase64 && !url?.trim()) return;
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
      localStorage.setItem("lastSession", data.session_id);
      navigate(`/dashboard/${data.session_id}`);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#080810", color: "#fff", fontFamily: "'Inter', sans-serif", width: "100%", overflowX: "hidden" }}>
      <Navbar />
      <Hero onScan={handleScan} loading={loading} error={error} />
      <StatsBar />
      <HowItWorks />
      <footer style={{ background: "#080810", borderTop: "1px solid #1f2937", padding: "32px 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 14, color: "#9ca3af" }}>
          <p>© 2024 SecureAgent. All rights reserved.</p>
          <div style={{ display: "flex", gap: 24 }}>
            <a href="#" style={{ color: "#9ca3af", textDecoration: "none" }}>Privacy</a>
            <a href="#" style={{ color: "#9ca3af", textDecoration: "none" }}>Terms</a>
          </div>
        </div>
      </footer>
      <ChatDrawer sessionId={localStorage.getItem("lastSession")} />
    </div>
  );
}
