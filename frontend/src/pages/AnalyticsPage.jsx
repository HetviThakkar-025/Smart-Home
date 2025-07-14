import React from "react";
import UsageHistoryChart from "../components/Analytics/UsageHistoryChart";
import TopDevicesChart from "../components/Analytics/TopDevicesChart";
import RoomBreakdownChart from "../components/Analytics/RoomBreakdownChart";
import PeakHoursChart from "../components/Analytics/PeakHoursChart";

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-7xl mx-auto grid gap-6">
        <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
          📊 Smart Home Analytics Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-2xl shadow p-4">
            <UsageHistoryChart />
          </div>
          <div className="bg-gray-800 rounded-2xl shadow p-4">
            <TopDevicesChart />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-2xl shadow p-4">
            <RoomBreakdownChart />
          </div>
          <div className="bg-gray-800 rounded-2xl shadow p-4">
            <PeakHoursChart />
          </div>
        </div>
      </div>
    </div>
  );
}
