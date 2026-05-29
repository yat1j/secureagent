import { useState } from "react";
import { DiffEditor } from "@monaco-editor/react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, AlertTriangle, AlertCircle, Minus, Copy, Check, ChevronDown, ChevronUp } from "lucide-react";

const SEVERITY_CONFIG = {
  critical: { border: "border-l-red-500",   bg: "bg-red-50",   text: "text-red-700",   badge: "bg-red-100 text-red-700",   icon: Flame },
  high:     { border: "border-l-orange-500", bg: "bg-orange-50", text: "text-orange-700", badge: "bg-orange-100 text-orange-700", icon: AlertTriangle },
  medium:   { border: "border-l-amber-400",  bg: "bg-amber-50",  text: "text-amber-700",  badge: "bg-amber-100 text-amber-700",  icon: AlertCircle },
  low:      { border: "border-l-gray-400",   bg: "bg-gray-50",   text: "text-gray-600",   badge: "bg-gray-100 text-gray-600",    icon: Minus },
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
    <div className={`border border-gray-200 border-l-4 ${cfg.border} rounded-r-xl bg-white shadow-sm mb-3 overflow-hidden`}>
      {/* COLLAPSED HEADER */}
      <div
        className="flex items-start justify-between px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <Icon className={`w-4 h-4 mt-1 flex-shrink-0 ${cfg.text}`} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="font-semibold text-gray-900 text-sm">{vuln.title}</span>
              <span className="font-mono text-xs text-gray-400">{vuln.file}:{vuln.line}</span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cfg.badge}`}>{vuln.severity}</span>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">{vuln.owasp}</span>
            </div>
            <p className="text-sm text-gray-700 font-medium">{vuln.business_impact}</p>
            <p className="text-xs text-gray-400 mt-0.5">Est. fix {vuln.fix_effort}</p>
          </div>
        </div>
        <div className={`ml-3 mt-1 flex-shrink-0 text-gray-400`}>
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
            <div className="px-5 pb-5 border-t border-gray-100">
              {/* Explanation */}
              <p className="text-sm text-gray-600 mt-4 mb-4 leading-relaxed">{vuln.explanation}</p>

              {/* Monaco Diff */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Code fix (before → after)</span>
                <button
                  onClick={copyFix}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                >
                  {copied ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                  {copied ? "Copied ✓" : "Copy fix"}
                </button>
              </div>

              <div className="rounded-lg overflow-hidden border border-gray-200" style={{ height: "200px" }}>
                <DiffEditor
                  original={vuln.broken_code}
                  modified={vuln.fixed_code}
                  language="php"
                  theme="vs"
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
                  className="flex items-center gap-2 text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <ChevronDown className={`w-3 h-3 transition-transform ${pocOpen ? "rotate-180" : ""}`} />
                  Proof of concept
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs">Safe — does not cause damage</span>
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
                      <div className="mt-2 bg-gray-950 rounded-lg px-4 py-3">
                        <p className="text-xs text-gray-400 mb-1">Paste this into the vulnerable input to confirm the issue exists.</p>
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