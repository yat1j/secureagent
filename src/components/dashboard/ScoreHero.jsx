import { useEffect, useState } from "react";

export default function ScoreHero({ score, repo }) {
  const [displayScore, setDisplayScore] = useState(0);

  // Animate score from 0 to actual value over 1.5 seconds
  useEffect(() => {
    let current = 0;
    const target = score;
    const step = target / (1500 / 16); // 1.5s at 60fps
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        clearInterval(timer);
        setDisplayScore(target);
      } else {
        setDisplayScore(Math.floor(current));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [score]);

  const scoreColor =
    score < 50 ? "text-red-500" : score < 80 ? "text-amber-500" : "text-emerald-500";

  const riskLabel =
    score < 50 ? "Critical Risk" : score < 80 ? "Moderate Risk" : "Secure";

  const riskColor =
    score < 50 ? "text-red-400" : score < 80 ? "text-amber-400" : "text-emerald-400";

  const riskBg =
    score < 50
      ? "bg-red-50 text-red-600 border-red-100"
      : score < 80
      ? "bg-amber-50 text-amber-600 border-amber-100"
      : "bg-emerald-50 text-emerald-600 border-emerald-100";

  return (
    <div className="py-8 px-5">
      {/* Repo label */}
      <p className="text-xs text-gray-400 mb-4 font-medium uppercase tracking-widest">
        {repo || "uploaded repo"}
      </p>

      {/* Score */}
      <div className="flex items-end gap-1 mb-2">
        <span className={`text-7xl font-semibold leading-none tabular-nums ${scoreColor}`}>
          {displayScore}
        </span>
        <span className="text-xl font-light text-gray-300 ml-1.5 pb-1">/ 100</span>
      </div>

      {/* Risk label */}
      <span className={`inline-block text-xs font-medium tracking-widest uppercase mt-2 border px-3 py-1 rounded-full ${riskBg}`}>
        {riskLabel}
      </span>

      <hr className="border-gray-100 mt-5" />
    </div>
  );
}