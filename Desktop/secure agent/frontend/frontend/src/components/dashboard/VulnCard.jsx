import { useState } from "react";
import { DiffEditor } from "@monaco-editor/react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, AlertTriangle, AlertCircle, Minus, Copy, Check, ChevronDown, ChevronUp } from "lucide-react";

const SEVERITY_CONFIG = {
  critical: { border: "border-l-red-500",    text: "text-red-400",    badge: "bg-red-900/50 text-red-400 border border-red-800",    icon: Flame },
  high:     { border: "border-l-orange-500",  text: "text-orange-400", badge: "bg-orange-900/50 text-orange-400 border border-orange-800", icon: AlertTriangle },
  medium:   { border: "border-l-amber-400",   text: "text-amber-400",  badge: "bg-amber-900/50 text-amber-400 border border-amber-800",  icon: AlertCircle },
  low:      { border: "border-l-gray-500",    text: "text-gray-500",   badge: "bg-gray-800 text-gray-400 border border-gray-700",        icon: Minus },
};

export default function VulnCard({ vuln }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pocOpen, setPocOpen] = useState(false);

  const cfg = SEVERITY_CONFIG[vuln.severity] || SEVERITY_CONFIG.low;
  const Icon = cfg.icon;

  function copyFix() {
    navigator.clipboard.writeText(vuln.fixed_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className={`border border-gray-700 border-l-4 ${cfg.border} rounded-r-xl bg-gray-900 mb-3 overflow-hidden`}>
      {/* COLLAPSED HEADER */}
      <div
        className="flex items-start justify-between px-5 py-4 cursor-pointer hover:bg-gray-800 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <Icon className={`w-4 h-4 mt-1 flex-shrink-0 ${cfg.text}`} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="font-semibold text-gray-100 text-sm">{vuln.title}</span>
              <span className="font-mono text-xs text-gray-500">{vuln.file}:{vuln.line}</span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cfg.badge}`}>{vuln.severity}</span>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-purple-900/50 text-purple-400 border border-purple-800">{vuln.owasp}</span>
            </div>
            <p className="text-sm text-gray-300 font-medium">{vuln.business_impact}</p>
            <p className="text-xs text-gray-600 mt-0.5">Est. fix {vuln.fix_effort}</p>
          </div>
        </div>
        <div className="ml-3 mt-1 flex-shrink-0 text-gray-600">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </div>

      {/* EXPANDED BODY */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 border-t border-gray-700">
              {/* Explanation */}
              <p className="text-sm text-gray-400 mt-4 mb-4 leading-relaxed">{vuln.explanation}</p>

              {/* Monaco Diff */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Code fix (before → after)</span>
                <button
                  onClick={copyFix}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 transition-colors"
                >
                  {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                  {copied ? "Copied ✓" : "Copy fix"}
                </button>
              </div>

              <div className="rounded-lg overflow-hidden border border-gray-700" style={{ height: "200px" }}>
                <DiffEditor
                  original={vuln.broken_code}
                  modified={vuln.fixed_code}
                  language="php"
                  theme="vs-dark"
                  options={{
                    readOnly: true,
                    renderSideBySide: true,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    fontSize: 12,
                    lineNumbers: "on",
                  }}
                />
              </div>

              {/* PoC Payload */}
              <div className="mt-4">
                <button
                  onClick={() => setPocOpen(!pocOpen)}
                  className="flex items-center gap-2 text-xs font-medium text-gray-500 hover:text-gray-300 transition-colors"
                >
                  <ChevronDown className={`w-3 h-3 transition-transform ${pocOpen ? "rotate-180" : ""}`} />
                  Proof of concept
                  <span className="px-2 py-0.5 rounded-full bg-amber-900/50 text-amber-400 border border-amber-800 text-xs">Safe — does not cause damage</span>
                </button>
                <AnimatePresence>
                  {pocOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-2 bg-gray-950 rounded-lg px-4 py-3 border border-gray-800">
                        <p className="text-xs text-gray-500 mb-1">Paste this into the vulnerable input to confirm the issue exists.</p>
                        <code className="text-green-400 font-mono text-sm">{vuln.poc_payload}</code>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}