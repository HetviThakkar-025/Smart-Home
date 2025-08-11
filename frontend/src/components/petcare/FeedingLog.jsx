// src/components/petcare/FeedingLog.jsx
import React from "react";
import dayjs from "dayjs";

export default function FeedingLog({ logs = [], onDelete = () => {} }) {
  if (!logs || logs.length === 0) {
    return <p className="text-sm text-gray-400">No feedings yet.</p>;
  }

  // show latest first
  const sorted = [...logs].sort(
    (a, b) => new Date(b.createdAt || b.time) - new Date(a.createdAt || a.time)
  );

  return (
    <div className="space-y-3 max-h-64 overflow-auto pr-2">
      {sorted.map((log) => {
        const time = dayjs(log.createdAt || log.time);
        return (
          <div
            key={log._id || log.id}
            className="flex items-start justify-between gap-3"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{log.food}</span>
                <span className="text-xs text-gray-400">
                  • {time.format("DD MMM, hh:mm A")}
                </span>
              </div>
              {log.notes && (
                <p className="text-xs text-gray-400 mt-1">{log.notes}</p>
              )}
            </div>

            <div className="flex flex-col items-end gap-2">
              <button
                onClick={() => {
                  if (confirm("Delete this log?")) onDelete(log._id || log.id);
                }}
                className="text-red-400 hover:text-red-500 text-xl leading-none"
                title="Delete"
              >
                ✖
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
