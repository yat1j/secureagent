import { AlertTriangle, CheckCircle, AlertCircle } from "lucide-react";

export default function ExecutiveSummary({ summary, score }) {
  const isGood = score >= 80;
  const isMid = score >= 50 && score < 80;

  const containerClass = isGood
    ? "bg-emerald-950/50 border border-emerald-800 rounded-2xl p-5 mb-6"
    : isMid
    ? "bg-amber-950/50 border border-amber-800 rounded-2xl p-5 mb-6"
    : "bg-red-950/50 border border-red-900 rounded-2xl p-5 mb-6";

  const labelClass = isGood
    ? "text-emerald-600"
    : isMid
    ? "text-amber-600"
    : "text-red-600";

  const Icon = isGood ? CheckCircle : isMid ? AlertCircle : AlertTriangle;
  const iconClass = isGood ? "text-emerald-400" : isMid ? "text-amber-400" : "text-red-400";

  return (
    <div className={containerClass}>
      <div className="flex items-center gap-2 mb-3">
        <Icon className={`w-4 h-4 ${iconClass}`} />
        <span className={`text-xs font-semibold tracking-widest uppercase ${labelClass}`}>
          Executive Summary
        </span>
      </div>
      <p className="text-sm text-gray-300 leading-relaxed">{summary}</p>
    </div>
  );
}