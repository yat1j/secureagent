// StatsBar.jsx — vertical stat rows, fits cleanly in the 240px sidebar

export default function StatsBar({ stats = {} }) {
  const { files = 0, total = 0, critical = 0, high = 0, medium = 0, est_fix = "—" } = stats;

  return (
    <div className="px-5 pb-5">
      <div className="bg-gray-50 rounded-2xl p-4 flex flex-col gap-3">

        <StatRow label="Files scanned" value={files} valueClass="text-gray-800" />
        <StatRow label="Total vulns" value={total} valueClass="text-gray-800" />

        <div className="border-t border-gray-200 my-1" />

        <StatRow label="Critical" value={critical} valueClass="text-red-500 font-bold" />
        <StatRow label="High" value={high} valueClass="text-orange-500 font-semibold" />
        <StatRow label="Medium" value={medium} valueClass="text-amber-500 font-semibold" />

        <div className="border-t border-gray-200 my-1" />

        <StatRow label="Est. fix time" value={est_fix} valueClass="text-indigo-600 font-semibold" />
      </div>
    </div>
  );
}

function StatRow({ label, value, valueClass }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-gray-400">{label}</span>
      <span className={`text-sm tabular-nums ${valueClass}`}>{value}</span>
    </div>
  );
}