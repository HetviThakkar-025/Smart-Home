import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const mockData = [
  { hour: "00:00", power: 20 },
  { hour: "06:00", power: 40 },
  { hour: "12:00", power: 80 },
  { hour: "18:00", power: 200 },
  { hour: "21:00", power: 120 },
];

export default function PeakHoursChart() {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
        ⏰ Peak Hours
      </h2>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={mockData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
          <XAxis dataKey="hour" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="power"
            stroke="#f97316"
            fill="#fdba74"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
