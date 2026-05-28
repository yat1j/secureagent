import { Zap, ChevronRight } from "lucide-react";

export default function PriorityQueue({ vulnerabilities }) {
  const severityScore = { critical: 4, high: 3, medium: 2, low: 1 };

  const priorityItems = [...(vulnerabilities || [])]
    .sort((a, b) => (severityScore[b.severity] ?? 0) - (severityScore[a.severity] ?? 0))
    .slice(0, 3)
    .map((v, i) => ({
      rank: i + 1,
      title: v.title,
      file: v.file,
      fixMinutes: parseInt(v.fix_effort) || 30,
      severity: v.severity,
    }));

  const totalMinutes = priorityItems.reduce((s, i) => s + i.fixMinutes, 0);
  const totalTime =
    totalMinutes >= 60
      ? `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`
      : `${totalMinutes}m`;

  if (!priorityItems.length) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Zap className="text-purple-500 w-4 h-4" />
        <span className="text-sm font-semibold text-gray-900">Priority Fix Queue</span>
        <span className="text-xs text-gray-400 ml-1">
          Fix these first to eliminate 80% of your risk
        </span>
      </div>

      {/* Items */}
      <div className="flex items-center gap-3 flex-wrap">
        {priorityItems.map((item, idx) => (
          <div key={item.rank} className="flex items-center gap-3">
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 flex-1 min-w-0">
              {/* Rank circle */}
              <div className="w-6 h-6 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                {item.rank}
              </div>
              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                <p className="text-xs font-mono text-gray-400 truncate">{item.file}</p>
              </div>
              {/* Fix time badge */}
              <span className="text-xs bg-white border border-gray-200 text-gray-500 px-2 py-0.5 rounded-full flex-shrink-0 whitespace-nowrap">
                {item.fixMinutes}m
              </span>
            </div>
            {/* Arrow between items (not after last) */}
            {idx < priorityItems.length - 1 && (
              <ChevronRight className="text-gray-300 w-4 h-4 flex-shrink-0" />
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
        <span className="text-xs text-gray-400">Total estimated fix time</span>
        <span className="text-xs font-semibold text-gray-700">{totalTime}</span>
      </div>
    </div>
  );
}