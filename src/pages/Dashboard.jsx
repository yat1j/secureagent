import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MessageCircle, Share2, Check, Download, ArrowRight, Link2 } from "lucide-react";
import { getReport } from "../api";
import ScoreHero from "../components/dashboard/ScoreHero";
import StatsBar from "../components/dashboard/StatsBar";
import VulnCard from "../components/dashboard/VulnCard";
import ExecutiveSummary from "../components/dashboard/ExecutiveSummary";
import PriorityQueue from "../components/dashboard/PriorityQueue";

export default function Dashboard() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [shareLabel, setShareLabel] = useState("Share");
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const report = await getReport(sessionId);
      setData(report);
      setLoading(false);
    }
    load();
  }, [sessionId]);

  function handleShare() {
    navigator.clipboard.writeText(window.location.href);
    setShareLabel("Copied ✓");
    setShowToast(true);
    setTimeout(() => {
      setShareLabel("Share");
      setShowToast(false);
    }, 2000);
  }

  // Loading state — skeleton cards
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans">
        <nav className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between">
          <span className="text-lg font-semibold text-gray-900">SecureAgent</span>
        </nav>
        <div className="flex" style={{ minHeight: "calc(100vh - 53px)" }}>
          <aside className="w-60 flex-shrink-0 bg-white border-r border-gray-100 p-5">
            <div className="h-32 bg-gray-100 rounded-2xl animate-pulse mb-4" />
            <div className="h-4 bg-gray-100 rounded animate-pulse mb-2" />
            <div className="h-4 bg-gray-100 rounded animate-pulse mb-2 w-3/4" />
          </aside>
          <main className="flex-1 p-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse mb-3" />
            ))}
          </main>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <p className="text-sm text-gray-500">Report not found.</p>
      </div>
    );
  }

  // Sort vulns: critical → high → medium → low
  const ORDER = { critical: 0, high: 1, medium: 2, low: 3 };
  const sorted = [...(data.vulnerabilities || [])].sort(
    (a, b) => (ORDER[a.severity] ?? 4) - (ORDER[b.severity] ?? 4)
  );

  // Counts per severity
  const counts = {
    all: sorted.length,
    critical: sorted.filter((v) => v.severity === "critical").length,
    high: sorted.filter((v) => v.severity === "high").length,
    medium: sorted.filter((v) => v.severity === "medium").length,
    low: sorted.filter((v) => v.severity === "low").length,
  };

  // Apply filter
  const filtered =
    filterSeverity === "all"
      ? sorted
      : sorted.filter((v) => v.severity === filterSeverity);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* ── TOP NAVBAR ── */}
      <nav className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-gray-900">SecureAgent</span>
          <button
            onClick={handleShare}
            className="flex items-center gap-1 cursor-pointer hover:text-purple-600 transition-colors font-mono text-xs text-gray-400 ml-1"
          >
            #{data.session_id}
            <Link2 size={12} className="ml-1" />
          </button>
        </div>

        {/* Header buttons */}
        <div className="flex items-center gap-2">
          {/* Export PDF */}
          <button
            onClick={() => console.log("PDF export — M4 wires this")}
            title="Export security report"
            className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 border border-gray-200 hover:border-gray-400 px-3 py-1.5 rounded-lg transition-all"
          >
            <Download size={13} />
            Export PDF
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 border border-gray-200 hover:border-gray-400 px-3 py-1.5 rounded-lg transition-all"
          >
            {shareLabel === "Copied ✓" ? (
              <Check size={13} className="text-emerald-500" />
            ) : (
              <Share2 size={13} />
            )}
            {shareLabel}
          </button>

          {/* New Scan */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 bg-gray-900 hover:bg-gray-700 text-white text-xs font-medium px-4 py-1.5 rounded-lg transition-colors"
          >
            New Scan
            <ArrowRight size={13} />
          </button>
        </div>
      </nav>

      {/* ── MAIN GRID ── */}
      <div className="flex" style={{ minHeight: "calc(100vh - 53px)" }}>

        {/* ── SIDEBAR ── */}
        <aside
          className="w-60 flex-shrink-0 bg-white border-r border-gray-100 overflow-y-auto hide-scrollbar"
          style={{ minHeight: "calc(100vh - 53px)" }}
        >
          <ScoreHero
            score={data.score}
            repo={data.vulnerabilities?.[0]?.file ? "uploaded repo" : "—"}
          />
          <StatsBar stats={data.stats} />

          {/* FILE HEATMAP SLOT — M3 plugs in here */}
          <div className="px-5 py-4">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">
              File Heatmap
            </p>
            <div
              id="heatmap-slot"
              className="h-56 bg-gray-50 rounded-xl border border-dashed border-gray-200 flex items-center justify-center"
            >
              <span className="text-xs text-gray-400">M3 plugs in here</span>
            </div>
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main className="flex-1 p-8 overflow-y-auto vuln-list">

          {/* Executive Summary */}
          <ExecutiveSummary summary={data.summary} score={data.score} />

          {/* Priority Fix Queue */}
          <PriorityQueue vulnerabilities={data.vulnerabilities} />

          {/* ATTACK GRAPH SLOT — M3 plugs in here */}
          <div className="mb-6">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">
              Attack Path
            </p>
            <div
              id="attack-graph-slot"
              className="h-64 bg-gray-50 rounded-2xl border border-dashed border-gray-200 flex items-center justify-center"
            >
              <span className="text-xs text-gray-400">M3 — Attack graph plugs in here</span>
            </div>
          </div>

          {/* Severity filters with counts */}
          <div className="flex items-center justify-between mb-4 mt-6">
            <div className="flex gap-2 flex-wrap">
              {["all", "critical", "high", "medium", "low"].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterSeverity(s)}
                  className={`text-xs font-medium px-4 py-1.5 rounded-full border transition-all cursor-pointer capitalize ${
                    filterSeverity === s
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-white text-gray-500 border-gray-200 hover:border-gray-400 hover:text-gray-700"
                  }`}
                >
                  {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}{" "}
                  <span className={filterSeverity === s ? "text-gray-200" : "text-gray-400"}>
                    ({counts[s]})
                  </span>
                </button>
              ))}
            </div>
            <span className="text-xs text-gray-400">Sorted by severity</span>
          </div>

          {/* Showing X of Y */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-sm font-medium text-gray-700">Vulnerabilities</span>
              <span className="text-xs text-gray-400 ml-2">
                showing {filtered.length} of {sorted.length}
              </span>
            </div>
          </div>

          {/* Vuln cards or empty state */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-center">
              <svg className="w-10 h-10 text-emerald-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm font-medium text-gray-400">
                No {filterSeverity} vulnerabilities found
              </p>
              <p className="text-xs text-gray-300 mt-1">This severity level is clear.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((vuln) => (
                <VulnCard key={vuln.id} vuln={vuln} />
              ))}
            </div>
          )}

          {/* CHAT SLOT — M4 plugs in here */}
          <div id="chat-slot" />
        </main>
      </div>

      {/* ── FLOATING "ASK AI" BUTTON ── */}
      <button
        className="fixed bottom-6 right-6 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-3 rounded-full shadow-lg transition-colors"
        onClick={() => {
          // M4: replace with setChatOpen(true)
          console.log("Chat button clicked — M4 wires this up");
        }}
      >
        <MessageCircle size={16} />
        Ask AI
      </button>

      {/* Share toast */}
      {showToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-4 py-2 rounded-full shadow-lg z-50">
          Link copied to clipboard
        </div>
      )}
    </div>
  );
}