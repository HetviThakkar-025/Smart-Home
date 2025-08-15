import React, { useEffect, useState } from "react";
import { Line, Pie } from "react-chartjs-2";
import "chart.js/auto";

export default function Dashboard({ powerData, deviceLabels, historicalData }) {
  const [loading, setLoading] = useState(!powerData);
  const [activeTab, setActiveTab] = useState("power");
  const [timeRange, setTimeRange] = useState("1h");
  const [energyBreakdown, setEnergyBreakdown] = useState(null);
  const [savedData, setSavedData] = useState(() => {
    // Load from localStorage if available
    const saved = localStorage.getItem('energyDashboardData');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (powerData) {
      setLoading(false);
      calculateEnergyBreakdown();
      
      // Save to localStorage
      const dataToSave = {
        ...powerData,
        historicalData,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('energyDashboardData', JSON.stringify(dataToSave));
      setSavedData(dataToSave);
    }
  }, [powerData]);

  const calculateEnergyBreakdown = () => {
    if (!powerData?.devices) return;
    
    const breakdown = powerData.devices.reduce((acc, device) => {
      const type = device.type || 'other';
      if (!acc[type]) {
        acc[type] = { power: 0, count: 0 };
      }
      acc[type].power += device.power || 0;
      acc[type].count += 1;
      return acc;
    }, {});

    setEnergyBreakdown(breakdown);
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Export data to CSV
  const exportToCSV = (range = 'today') => {
    let dataToExport = [];
    let filename = '';
    const dataSource = historicalData || savedData?.historicalData || [];
    
    if (range === 'today') {
      dataToExport = dataSource.filter(item => {
        const itemDate = new Date(item.timestamp);
        const today = new Date();
        return itemDate.getDate() === today.getDate() && 
               itemDate.getMonth() === today.getMonth() && 
               itemDate.getFullYear() === today.getFullYear();
      });
      filename = `energy_data_today_${new Date().toISOString().split('T')[0]}.csv`;
    } else if (range === 'week') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      dataToExport = dataSource.filter(item => new Date(item.timestamp) >= oneWeekAgo);
      filename = `energy_data_week_${new Date().toISOString().split('T')[0]}.csv`;
    }

    if (dataToExport.length === 0) {
      alert('No data available for the selected range');
      return;
    }

    // Create CSV content
    const headers = ['Timestamp', 'Power (W)', 'Energy (kWh)', 'Cost (₹)'];
    const rows = dataToExport.map(item => [
      new Date(item.timestamp).toLocaleString(),
      item.power || 0,
      item.energy ? item.energy.toFixed(2) : '0.00',
      item.cost ? item.cost.toFixed(2) : '0.00'
    ]);

    let csvContent = headers.join(',') + '\n';
    rows.forEach(row => {
      csvContent += row.join(',') + '\n';
    });

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Use saved data if fresh data isn't available
  const displayData = powerData || savedData;
  const displayHistoricalData = historicalData || (savedData?.historicalData || []);

  if (loading && !savedData) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading energy data...</p>
        </div>
      </div>
    );
  }

  if (!displayData) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-gray-400">No energy data available</p>
        </div>
      </div>
    );
  }

  // Chart data for power consumption over time
  const powerChartData = {
    labels: displayHistoricalData.map((d) => formatTimestamp(d.timestamp)),
    datasets: [
      {
        label: "Power (W)",
        data: displayHistoricalData.map((d) => d.power),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        borderWidth: 2,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // Chart data for energy breakdown by device type
  const breakdownChartData = {
    labels: energyBreakdown ? Object.keys(energyBreakdown) : [],
    datasets: [
      {
        data: energyBreakdown ? Object.values(energyBreakdown).map((v) => v.power) : [],
        backgroundColor: [
          "#6366f1",
          "#8b5cf6",
          "#ec4899",
          "#f97316",
          "#10b981",
          "#0ea5e9",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Calculate percentage of peak power
  const powerPercentage = displayData.peak > 0 
    ? (displayData.power / displayData.peak * 100) 
    : 0;

  return (
    <div className="p-4 h-full overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Energy Dashboard</h1>
          <p className="text-gray-400">
            {new Date(displayData.timestamp).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setTimeRange("1h")}
            className={`px-3 py-1 rounded-md ${timeRange === "1h" ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
          >
            1H
          </button>
          <button
            onClick={() => setTimeRange("24h")}
            className={`px-3 py-1 rounded-md ${timeRange === "24h" ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
          >
            24H
          </button>
          <button
            onClick={() => setTimeRange("7d")}
            className={`px-3 py-1 rounded-md ${timeRange === "7d" ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
          >
            7D
          </button>
          <div className="relative group">
            <button
              className="px-3 py-1 rounded-md bg-green-600 text-white"
              onClick={() => document.getElementById('exportMenu').classList.toggle('hidden')}
            >
              Export
            </button>
            <div id="exportMenu" className="hidden absolute right-0 mt-1 w-48 bg-gray-800 rounded-md shadow-lg z-10">
              <div className="py-1">
                <button
                  onClick={() => exportToCSV('today')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
                >
                  Export Today's Data
                </button>
                <button
                  onClick={() => exportToCSV('week')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
                >
                  Export Weekly Data
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <SummaryCard
          title="Current Power"
          value={`${displayData.power} W`}
          icon="⚡"
          color="bg-blue-500"
          trend={
            displayHistoricalData.length > 1 &&
            displayData.power > displayHistoricalData[displayHistoricalData.length - 2].power
              ? "up"
              : "down"
          }
        />
        <SummaryCard
          title="Energy Today"
          value={`${displayData.energy?.toFixed(2) || '0.00'} kWh`}
          icon="🔋"
          color="bg-green-500"
        />
        <SummaryCard
          title="Today's Cost"
          value={`₹${displayData.cost?.toFixed(2) || '0.00'}`}
          icon="💰"
          color="bg-yellow-500"
        />
        <SummaryCard
          title="Peak Power"
          value={`${displayData.peak} W`}
          icon="📈"
          color="bg-purple-500"
        />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700 mb-4">
        <button
          className={`px-4 py-2 font-medium ${activeTab === "power" ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}
          onClick={() => setActiveTab("power")}
        >
          Power Consumption
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === "breakdown" ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}
          onClick={() => setActiveTab("breakdown")}
        >
          Energy Breakdown
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === "devices" ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}
          onClick={() => setActiveTab("devices")}
        >
          Devices
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        {activeTab === "power" && (
          <div>
            <h2 className="text-xl font-semibold text-gray-100 mb-4">
              Power Consumption Over Time
            </h2>
            <div className="h-64">
              <Line
                data={powerChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      mode: "index",
                      intersect: false,
                      backgroundColor: "rgba(31, 41, 55, 0.9)",
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: { color: "rgba(55, 65, 81, 0.5)" },
                      ticks: { color: "#9CA3AF" },
                    },
                    x: {
                      grid: { color: "rgba(55, 65, 81, 0.5)" },
                      ticks: { color: "#9CA3AF" },
                    },
                  },
                }}
              />
            </div>
          </div>
        )}

        {activeTab === "breakdown" && energyBreakdown && (
          <div>
            <h2 className="text-xl font-semibold text-gray-100 mb-4">
              Energy Usage Breakdown
            </h2>
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="lg:w-1/2 h-64">
                <Pie
                  data={breakdownChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "right",
                        labels: { color: "#D1D5DB" },
                      },
                    },
                  }}
                />
              </div>
              <div className="lg:w-1/2">
                <div className="space-y-4">
                  {Object.entries(energyBreakdown).map(([type, data]) => (
                    <div key={type} className="bg-gray-700 rounded-lg p-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-gray-100 capitalize">
                          {type}
                        </span>
                        <span className="font-bold text-white">
                          {data.power} W
                        </span>
                      </div>
                      <div className="w-full bg-gray-600 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{
                            width: `${
                              (data.power / displayData.power) * 100
                            }%`,
                          }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {data.count} device{data.count !== 1 ? "s" : ""}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "devices" && (
          <div>
            <h2 className="text-xl font-semibold text-gray-100 mb-4">
              Connected Devices ({displayData.devices?.length || 0})
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Device
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Power
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {displayData.devices?.map((device, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-700 rounded-full flex items-center justify-center">
                            <span className="text-lg">
                              {getDeviceIcon(device.type)}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-white">
                              {device.name}
                            </div>
                            <div className="text-sm text-gray-400">
                              {deviceLabels?.[device.key] || device.type}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs rounded-full bg-gray-700 text-gray-300 capitalize">
                          {device.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-white">
                        {device.power} W
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            device.state === "ON"
                              ? "bg-green-500 text-white"
                              : device.state === "OFF"
                              ? "bg-gray-500 text-white"
                              : "bg-yellow-500 text-white"
                          }`}
                        >
                          {device.state}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Power Meter */}
      <div className="bg-gray-800 rounded-lg p-4">
        <h2 className="text-xl font-semibold text-gray-100 mb-4">
          Current Power Usage
        </h2>
        <div className="flex flex-col items-center">
          <div className="relative w-48 h-48 mb-6">
            <svg
              className="w-full h-full transform -rotate-90"
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="rgba(55, 65, 81, 0.5)"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="8"
                strokeDasharray={`${powerPercentage * 2.83}, 283`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-white">
                {displayData.power} W
              </span>
              <span className="text-gray-400">
                {powerPercentage.toFixed(0)}% of peak
              </span>
            </div>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div
              className="bg-blue-500 h-3 rounded-full"
              style={{ width: `${powerPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ title, value, icon, color, trend }) {
  return (
    <div className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-400">{title}</p>
          <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
        </div>
        <div
          className={`${color} w-12 h-12 rounded-full flex items-center justify-center text-xl`}
        >
          {icon}
        </div>
      </div>
      {trend && (
        <div
          className={`mt-3 text-sm flex items-center ${
            trend === "up" ? "text-red-400" : "text-green-400"
          }`}
        >
          {trend === "up" ? (
            <svg
              className="w-4 h-4 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              className="w-4 h-4 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M12 13a1 1 0 100 2h5a1 1 0 001-1v-5a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586l-4.293-4.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z"
                clipRule="evenodd"
              />
            </svg>
          )}
          {trend === "up" ? "Increasing" : "Decreasing"}
        </div>
      )}
    </div>
  );
}

function getDeviceIcon(type) {
  switch (type) {
    case "light":
      return "💡";
    case "fan":
      return "🌀";
    case "appliance":
      return "🔌";
    case "furniture":
      return "🪑";
    default:
      return "📱";
  }
}