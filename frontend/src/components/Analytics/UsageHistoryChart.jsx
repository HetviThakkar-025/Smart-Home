import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const mockData = [
  { date: "Jul 12", totalEnergy: 1.2 },
  { date: "Jul 13", totalEnergy: 1.5 },
  { date: "Jul 14", totalEnergy: 1.0 },
  { date: "Jul 15", totalEnergy: 2.2 },
  { date: "Jul 16", totalEnergy: 1.8 },
  { date: "Jul 17", totalEnergy: 2.5 },
  { date: "Jul 18", totalEnergy: 2.0 },
];

export default function UsageHistoryChart() {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
        📅 Last 7 Days Usage
      </h2>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={mockData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
          <XAxis dataKey="date" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="totalEnergy"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
