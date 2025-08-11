// src/components/petcare/ComfortMeter.jsx
import React from "react";

export default function ComfortMeter({ comfort, lastHours }) {
  // comfort: { score: number, recommended: bool } or null
  const score = comfort?.score ?? null;
  const recommended = comfort?.recommended ?? false;

  const display = (s) => (s === null ? "—" : `${s}%`);

  // map score to width
  const width = score === null ? 10 : Math.max(6, Math.min(100, score));

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="text-sm text-gray-300">Comfort Score</div>
          <div className="text-2xl font-semibold">{display(score)}</div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-300">Since last feeding</div>
          <div className="text-lg font-medium">
            {lastHours ? `${lastHours} hrs` : "—"}
          </div>
        </div>
      </div>

      <div className="w-full bg-white/6 rounded-full h-4 overflow-hidden">
        <div
          className={`h-4 rounded-full transition-all duration-700`}
          style={{
            width: `${width}%`,
            background: `linear-gradient(90deg, ${
              width > 60 ? "#34D399" : width > 30 ? "#F59E0B" : "#F87171"
            }, #06B6D4)`,
          }}
        />
      </div>

      <div className="mt-3 text-sm">
        {score === null ? (
          <div className="text-gray-400">Prediction not available</div>
        ) : score >= 75 ? (
          <div className="text-green-300">Your pet looks comfortable ✅</div>
        ) : score >= 45 ? (
          <div className="text-yellow-300">
            Slightly uncomfortable — monitor feeding
          </div>
        ) : (
          <div className="text-red-300">
            Low comfort — consider feeding or adjusting environment
          </div>
        )}

        {recommended && (
          <div className="mt-1 text-sm text-red-200">
            Recommendation: Feed now
          </div>
        )}
      </div>
    </div>
  );
}
