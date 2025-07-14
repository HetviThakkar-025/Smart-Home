import React from "react";
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";

const data = [
  { name: "Living", value: 40 },
  { name: "Bedroom", value: 25 },
  { name: "Kitchen", value: 20 },
  { name: "Other", value: 15 },
];

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444"];

export default function RoomBreakdownChart() {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
        🛋️ Room-wise Breakdown
      </h2>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={80}
            label
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
