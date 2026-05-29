import { useState, useRef, useEffect, useContext } from "react";
import { ScanContext } from "../../context/ScanContext";

export default function ChatDrawer({ isOpen, onClose, sessionId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  const suggested = [
    "Which file is most dangerous?",
    "Explain this XSS simply",
    "How do I fix the SQL injection?"
  ];

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
        body: JSON.stringify({ question: q })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "ai", content: data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "ai", content: "Error reaching backend." }]);
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed", top: 0, right: 0, width: 340, height: "100vh",
      background: "#0d0d1a", borderLeft: "1px solid #1f2937",
      display: "flex", flexDirection: "column", zIndex: 1000,
      boxShadow: "-8px 0 32px rgba(0,0,0,0.4)"
    }}>
      {/* Header */}
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #1f2937", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: 15, color: "#fff" }}>Security Copilot</div>
          <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>Ask anything about this scan</div>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#6b7280", cursor: "pointer", fontSize: 20 }}>×</button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
        {messages.length === 0 && (
          <div>
            <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 12 }}>Suggested questions:</p>
            {suggested.map(s => (
              <button key={s} onClick={() => send(s)} style={{
                display: "block", width: "100%", textAlign: "left", background: "#0f0f1a",
                border: "1px solid #1f2937", borderRadius: 8, padding: "10px 14px",
                color: "#9ca3af", fontSize: 13, cursor: "pointer", marginBottom: 8
              }}>{s}</button>
            ))}
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} style={{
            alignSelf: m.role === "user" ? "flex-end" : "flex-start",
            maxWidth: "85%", background: m.role === "user" ? "#7c3aed" : "#1a1a2e",
            borderRadius: m.role === "user" ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
            padding: "10px 14px", fontSize: 13, color: "#fff", lineHeight: 1.6
          }}>{m.content}</div>
        ))}
        {loading && (
          <div style={{ alignSelf: "flex-start", background: "#1a1a2e", borderRadius: "12px 12px 12px 2px", padding: "10px 14px" }}>
            <span style={{ color: "#6b7280", fontSize: 13 }}>Thinking...</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding: "12px 16px", borderTop: "1px solid #1f2937", display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()}
          placeholder="Ask about a vulnerability..."
          style={{ flex: 1, background: "#0f0f1a", border: "1px solid #1f2937", borderRadius: 8, padding: "10px 14px", color: "#fff", fontSize: 13, outline: "none" }}
        />
        <button onClick={() => send()} style={{ background: "#7c3aed", border: "none", borderRadius: 8, padding: "10px 16px", color: "#fff", cursor: "pointer", fontSize: 13 }}>Send</button>
      </div>
    </div>
  );
}
