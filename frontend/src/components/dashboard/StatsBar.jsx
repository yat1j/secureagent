// StatsBar.jsx — the 4 metric pills below the score
// Props: stats object from API { files, total, critical, high, medium, est_fix }

export default function StatsBar({ stats = {} }) {
  const { files = 0, total = 0, critical = 0, est_fix = "—" } = stats;

  return (
    <div className="flex flex-wrap gap-2 px-6 py-4 border-b border-gray-100">
      <Pill label={`${files} files scanned`} color="gray" />
      <Pill label={`${total} vulns found`} color="gray" />
      <Pill label={`${critical} critical`} color="red" />
      <Pill label={`Est. fix: ${est_fix}`} color="gray" />
    </div>
  );
}

function Pill({ label, color }) {
  const colors = {
    red: "bg-red-50 text-red-800 border border-red-200",
    gray: "bg-gray-50 text-gray-700 border border-gray-200",
  };
  return (
    <span className={`text-xs font-medium px-3 py-1 rounded-full ${colors[color]}`}>
      {label}
    </span>
  );
}
