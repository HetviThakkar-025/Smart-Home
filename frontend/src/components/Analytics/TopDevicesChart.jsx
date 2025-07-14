import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const mockData = [
  { name: "AC", count: 12 },
  { name: "Light", count: 9 },
  { name: "Fan", count: 7 },
  { name: "TV", count: 4 },
];

export default function TopDevicesChart() {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
        🔝 Top Devices by Usage
      </h2>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={mockData}
          style={{ backgroundColor: "transparent" }}
          barCategoryGap="20%" // optional: adjust spacing
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
          <XAxis dataKey="name" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1f2937", // dark gray background
              border: "none",
              borderRadius: "8px",
              color: "#f9fafb", // text color
            }}
          />

          <Bar
            dataKey="count"
            fill="#10b981"
            radius={[8, 8, 0, 0]}
            background={false}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
