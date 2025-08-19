import React, { useEffect, useState, useRef } from "react";
import { Line, Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const DEVICE_CONFIG = {
  light: { icon: "💡", color: "bg-yellow-500", wattage: 40 },
  fan: { icon: "🌀", color: "bg-blue-500", wattage: 75 },
  tv: { icon: "📺", color: "bg-purple-500", wattage: 120 },
  fridge: { icon: "❄️", color: "bg-cyan-500", wattage: 150, alwaysOn: true },
  ac: { icon: "🌬️", color: "bg-teal-500", wattage: 1500 },
  microwave: { icon: "🍲", color: "bg-orange-500", wattage: 1000 },
  washingmachine: { icon: "🧺", color: "bg-indigo-500", wattage: 500 },
  computer: { icon: "💻", color: "bg-gray-500", wattage: 200 },
  router: { icon: "📶", color: "bg-green-500", wattage: 10, alwaysOn: true },
};

const TARIFF_CONFIG = {
  residential: {
    slab1: { limit: 100, rate: 3.5 },
    slab2: { limit: 200, rate: 4.5 },
    slab3: { limit: 300, rate: 6.5 },
    slab4: { rate: 7.5 },
  },
  commercial: {
    flatRate: 8.0,
  },
  fixedCharges: {
    residential: 100,
    commercial: 200,
  },
};

function SummaryCard({ title, value, icon, color, trend, subtitle }) {
  return (
    <div className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors h-full">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-400">{title}</p>
          <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
          {subtitle && (
            <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
          )}
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

export default function EnhancedDashboard({
  powerData,
  deviceLabels,
  historicalData,
}) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("power");
  const [timeRange, setTimeRange] = useState("1h");
  const [energyBreakdown, setEnergyBreakdown] = useState(null);
  const [deviceBreakdown, setDeviceBreakdown] = useState(null);
  const [tariffType, setTariffType] = useState("residential");
  const [notification, setNotification] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [showDeviceModal, setShowDeviceModal] = useState(false);
  const exportMenuRef = useRef(null);

  // Store hourly data points
  const [hourlyData, setHourlyData] = useState([]);
  // Store daily data
  const [dailyData, setDailyData] = useState({});

  // Close export menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        exportMenuRef.current &&
        !exportMenuRef.current.contains(event.target)
      ) {
        document.getElementById("exportMenu")?.classList.add("hidden");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (powerData) {
      setLoading(false);
      const now = new Date();
      const currentHour = new Date(now);
      currentHour.setMinutes(0, 0, 0); // Round down to current hour

      // Update hourly data (only once per hour)
      setHourlyData((prevData) => {
        // If no data yet or last data point is from a previous hour
        if (
          prevData.length === 0 ||
          new Date(prevData[prevData.length - 1].timestamp).getHours() < currentHour.getHours() ||
          new Date(prevData[prevData.length - 1].timestamp).getDate() < currentHour.getDate()
        ) {
          const newDataPoint = {
            timestamp: currentHour.toISOString(),
            power: powerData.power || 0,
            energy: powerData.energy || 0,
            cost: calculateCost(powerData.energy || 0),
            peak: powerData.peak || 0,
          };
          return [...prevData, newDataPoint];
        } else {
          // Update the last data point with current values
          const updatedData = [...prevData];
          updatedData[updatedData.length - 1] = {
            ...updatedData[updatedData.length - 1],
            power: powerData.power || 0,
            energy: powerData.energy || 0,
            cost: calculateCost(powerData.energy || 0),
            peak: powerData.peak || 0,
          };
          return updatedData;
        }
      });

      // Update daily data
      setDailyData((prevDailyData) => {
        const dayKey = now.toISOString().split("T")[0];
        const newDailyData = { ...prevDailyData };
        
        // Initialize or update the day's data
        if (!newDailyData[dayKey]) {
          newDailyData[dayKey] = {
            date: dayKey,
            energy: powerData.energy || 0,
            cost: calculateCost(powerData.energy || 0),
          };
        } else {
          // Update only if we have a higher energy reading
          if (powerData.energy > newDailyData[dayKey].energy) {
            newDailyData[dayKey] = {
              date: dayKey,
              energy: powerData.energy,
              cost: calculateCost(powerData.energy),
            };
          }
        }

        // Limit to 7 days of data
        const sortedKeys = Object.keys(newDailyData).sort().reverse();
        if (sortedKeys.length > 7) {
          sortedKeys.slice(7).forEach((key) => {
            delete newDailyData[key];
          });
        }

        return newDailyData;
      });

      calculateEnergyBreakdown(powerData);
      calculateDeviceBreakdown(powerData);
    }
  }, [powerData]);

  const calculateEnergyBreakdown = (data) => {
    if (!data?.devices) return;

    const breakdown = data.devices.reduce((acc, device) => {
      const type = device.type || "other";
      if (!acc[type]) acc[type] = { power: 0, count: 0 };
      acc[type].power += device.power || 0;
      acc[type].count += 1;
      return acc;
    }, {});

    setEnergyBreakdown(breakdown);
  };

  const calculateDeviceBreakdown = (data) => {
    if (!data?.devices) return;

    const breakdown = data.devices.reduce((acc, device) => {
      const name = device.name || device.type;
      if (!acc[name]) acc[name] = { power: 0, state: device.state };
      acc[name].power += device.power || 0;
      return acc;
    }, {});

    setDeviceBreakdown(breakdown);
  };

  const calculateCost = (kWh) => {
    const tariff = TARIFF_CONFIG[tariffType];
    if (!tariff) return 0;

    if (tariffType === "commercial") {
      return kWh * tariff.flatRate + TARIFF_CONFIG.fixedCharges.commercial / 30;
    }

    let cost = 0;
    let remainingUnits = kWh;

    const slab1Units = Math.min(remainingUnits, tariff.slab1.limit);
    cost += slab1Units * tariff.slab1.rate;
    remainingUnits -= slab1Units;

    if (remainingUnits <= 0)
      return cost + TARIFF_CONFIG.fixedCharges.residential / 30;

    const slab2Units = Math.min(
      remainingUnits,
      tariff.slab2.limit - tariff.slab1.limit
    );
    cost += slab2Units * tariff.slab2.rate;
    remainingUnits -= slab2Units;

    if (remainingUnits <= 0)
      return cost + TARIFF_CONFIG.fixedCharges.residential / 30;

    const slab3Units = Math.min(
      remainingUnits,
      tariff.slab3.limit - tariff.slab2.limit
    );
    cost += slab3Units * tariff.slab3.rate;
    remainingUnits -= slab3Units;

    if (remainingUnits <= 0)
      return cost + TARIFF_CONFIG.fixedCharges.residential / 30;

    cost += remainingUnits * tariff.slab4.rate;

    return cost + TARIFF_CONFIG.fixedCharges.residential / 30;
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleDeviceClick = (device) => {
    setSelectedDevice(device);
    setShowDeviceModal(true);
  };

  const displayData = powerData || {
    power: 0,
    energy: 0,
    cost: 0,
    peak: 0,
    devices: [],
  };

  // Generate sample data if no data is available for charts
  const generateSampleData = (count) => {
    const now = new Date();
    const data = [];
    for (let i = count - 1; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
      data.push({
        timestamp: timestamp.toISOString(),
        power: Math.floor(Math.random() * 1000) + 500,
        energy: Math.random() * 10,
        cost: Math.random() * 50,
        peak: Math.floor(Math.random() * 1200) + 600,
      });
    }
    return data;
  };

  const filteredHourlyData = hourlyData.length > 0 ? hourlyData.filter((d) => {
    const dataTime = new Date(d.timestamp);
    const now = new Date();
    if (timeRange === "1h") {
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      return dataTime > oneHourAgo;
    } else if (timeRange === "24h") {
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      return dataTime > oneDayAgo;
    } else if (timeRange === "7d") {
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return dataTime > sevenDaysAgo;
    }
    return true;
  }) : generateSampleData(timeRange === "1h" ? 12 : timeRange === "24h" ? 24 : 7);

  const exportToCSV = () => {
    if (hourlyData.length === 0) {
      showNotification("No data available to export", "warning");
      return;
    }

    const headers = [
      "Timestamp",
      "Power (W)",
      "Energy (kWh)",
      "Cost (₹)",
      "Peak Power (W)",
    ];
    const rows = hourlyData.map((item) => [
      new Date(item.timestamp).toLocaleString(),
      item.power,
      item.energy.toFixed(3),
      item.cost.toFixed(2),
      item.peak,
    ]);

    let csvContent = headers.join(",") + "\n";
    rows.forEach((row) => {
      csvContent += row.join(",") + "\n";
    });

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    saveAs(blob, `energy_data_${new Date().toISOString().split("T")[0]}.csv`);
    showNotification("Exported to CSV successfully", "success");
  };

  const exportToExcel = () => {
    if (hourlyData.length === 0) {
      showNotification("No data available to export", "warning");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(
      hourlyData.map((item) => ({
        Timestamp: new Date(item.timestamp).toLocaleString(),
        "Power (W)": item.power,
        "Energy (kWh)": item.energy.toFixed(3),
        "Cost (₹)": item.cost.toFixed(2),
        "Peak Power (W)": item.peak,
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "EnergyData");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(data, `energy_data_${new Date().toISOString().split("T")[0]}.xlsx`);
    showNotification("Exported to Excel successfully", "success");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading energy data...</p>
        </div>
      </div>
    );
  }

  // Chart data configurations
  const powerChartData = {
    labels: filteredHourlyData.map((d) => formatTimestamp(d.timestamp)),
    datasets: [
      {
        label: "Power (W)",
        data: filteredHourlyData.map((d) => d.power),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        borderWidth: 2,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const costChartData = {
    labels: filteredHourlyData.map((d) => formatTimestamp(d.timestamp)),
    datasets: [
      {
        label: "Cost (₹)",
        data: filteredHourlyData.map((d) => d.cost),
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        borderWidth: 2,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const breakdownChartData = {
    labels: energyBreakdown ? Object.keys(energyBreakdown) : ["light", "fan", "tv", "fridge"],
    datasets: [
      {
        data: energyBreakdown
          ? Object.values(energyBreakdown).map((v) => v.power)
          : [300, 200, 150, 250],
        backgroundColor: [
          "#6366f1",
          "#8b5cf6",
          "#ec4899",
          "#f97316",
          "#10b981",
          "#0ea5e9",
          "#f59e0b",
          "#84cc16",
        ],
        borderWidth: 1,
      },
    ],
  };

  const dailySummaryData = {
    labels: Object.values(dailyData).length > 0 
      ? Object.values(dailyData).map((item) => formatDate(item.date))
      : Array.from({length: 7}, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - i);
          return formatDate(date.toISOString());
        }).reverse(),
    datasets: [
      {
        label: "Daily Energy (kWh)",
        data: Object.values(dailyData).length > 0 
          ? Object.values(dailyData).map((item) => parseFloat(item.energy.toFixed(2)))
          : Array.from({length: 7}, () => Math.random() * 10 + 5),
        backgroundColor: "rgba(59, 130, 246, 0.7)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
      },
    ],
  };

  const powerPercentage =
    displayData.peak > 0 ? (displayData.power / displayData.peak) * 100 : 0;

  const monthlyCostEstimate = calculateCost((displayData.energy || 0) * 30);

  return (
    <div className="p-4 h-full overflow-y-auto">
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-md shadow-lg ${
            notification.type === "success"
              ? "bg-green-500"
              : notification.type === "warning"
              ? "bg-yellow-500"
              : "bg-blue-500"
          } text-white`}
        >
          {notification.message}
          <button
            onClick={() => setNotification(null)}
            className="ml-2 font-bold"
          >
            ×
          </button>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">
            Energy Dashboard
          </h1>
          <p className="text-gray-400">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={tariffType}
            onChange={(e) => setTariffType(e.target.value)}
            className="px-3 py-1 rounded-md bg-gray-700 text-gray-300"
          >
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
          </select>

          <div className="flex gap-1">
            <button
              onClick={() => setTimeRange("1h")}
              className={`px-3 py-1 rounded-md ${
                timeRange === "1h"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-700 text-gray-300"
              }`}
            >
              1h
            </button>
            <button
              onClick={() => setTimeRange("24h")}
              className={`px-3 py-1 rounded-md ${
                timeRange === "24h"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-700 text-gray-300"
              }`}
            >
              24h
            </button>
            <button
              onClick={() => setTimeRange("7d")}
              className={`px-3 py-1 rounded-md ${
                timeRange === "7d"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-700 text-gray-300"
              }`}
            >
              7d
            </button>
          </div>

          <div className="relative" ref={exportMenuRef}>
            <button
              className="px-3 py-1 rounded-md bg-green-600 text-white flex items-center gap-1"
              onClick={() =>
                document.getElementById("exportMenu").classList.toggle("hidden")
              }
            >
              <span>Export</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </button>
            <div
              id="exportMenu"
              className="hidden absolute right-0 mt-1 w-48 bg-gray-800 rounded-md shadow-lg z-10 border border-gray-700"
            >
              <div className="py-1">
                <button
                  onClick={exportToCSV}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
                >
                  Export Current View (CSV)
                </button>
                <div className="border-t border-gray-700"></div>
                <button
                  onClick={exportToExcel}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
                >
                  Export All (Excel)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <SummaryCard
          title="Current Power"
          value={`${displayData.power} W`}
          icon="⚡"
          color="bg-blue-500"
          subtitle={`${powerPercentage.toFixed(0)}% of peak`}
        />
        <SummaryCard
          title="Energy Today"
          value={`${displayData.energy.toFixed(2)} kWh`}
          icon="🔋"
          color="bg-green-500"
          subtitle={`₹${displayData.cost.toFixed(2)}`}
        />
        <SummaryCard
          title="Peak Power"
          value={`${displayData.peak} W`}
          icon="📈"
          color="bg-purple-500"
          subtitle={new Date().toLocaleTimeString()}
        />
        <SummaryCard
          title="Monthly Estimate"
          value={`₹${monthlyCostEstimate.toFixed(2)}`}
          icon="💰"
          color="bg-yellow-500"
          subtitle={`${
            tariffType === "residential" ? "Residential" : "Commercial"
          } rate`}
        />
      </div>

      <div className="flex border-b border-gray-700 mb-4 overflow-x-auto">
        <button
          className={`px-4 py-2 font-medium whitespace-nowrap ${
            activeTab === "power"
              ? "text-blue-400 border-b-2 border-blue-400"
              : "text-gray-400"
          }`}
          onClick={() => setActiveTab("power")}
        >
          Power Consumption
        </button>
        <button
          className={`px-4 py-2 font-medium whitespace-nowrap ${
            activeTab === "cost"
              ? "text-blue-400 border-b-2 border-blue-400"
              : "text-gray-400"
          }`}
          onClick={() => setActiveTab("cost")}
        >
          Cost Analysis
        </button>
        <button
          className={`px-4 py-2 font-medium whitespace-nowrap ${
            activeTab === "breakdown"
              ? "text-blue-400 border-b-2 border-blue-400"
              : "text-gray-400"
          }`}
          onClick={() => setActiveTab("breakdown")}
        >
          Energy Breakdown
        </button>
        <button
          className={`px-4 py-2 font-medium whitespace-nowrap ${
            activeTab === "devices"
              ? "text-blue-400 border-b-2 border-blue-400"
              : "text-gray-400"
          }`}
          onClick={() => setActiveTab("devices")}
        >
          Devices
        </button>
        <button
          className={`px-4 py-2 font-medium whitespace-nowrap ${
            activeTab === "trends"
              ? "text-blue-400 border-b-2 border-blue-400"
              : "text-gray-400"
          }`}
          onClick={() => setActiveTab("trends")}
        >
          Daily Trends
        </button>
      </div>

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
                      callbacks: {
                        label: (context) =>
                          `${context.dataset.label}: ${context.raw} W`,
                      },
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: { color: "rgba(55, 65, 81, 0.5)" },
                      ticks: { color: "#9CA3AF" },
                      title: {
                        display: true,
                        text: "Power (W)",
                        color: "#9CA3AF",
                      },
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

        {activeTab === "cost" && (
          <div>
            <h2 className="text-xl font-semibold text-gray-100 mb-4">
              Cost Analysis
            </h2>
            <div className="h-64">
              <Line
                data={costChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      mode: "index",
                      intersect: false,
                      backgroundColor: "rgba(31, 41, 55, 0.9)",
                      callbacks: {
                        label: (context) =>
                          `${context.dataset.label}: ₹${context.raw.toFixed(
                            2
                          )}`,
                      },
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: { color: "rgba(55, 65, 81, 0.5)" },
                      ticks: { color: "#9CA3AF" },
                      title: {
                        display: true,
                        text: "Cost (₹)",
                        color: "#9CA3AF",
                      },
                    },
                    x: {
                      grid: { color: "rgba(55, 65, 81, 0.5)" },
                      ticks: { color: "#9CA3AF" },
                    },
                  },
                }}
              />
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-100 mb-2">
                  Tariff Information
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Current Plan:</span>
                    <span className="text-white capitalize">{tariffType}</span>
                  </div>
                  {tariffType === "residential" ? (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-400">First 100 units:</span>
                        <span className="text-white">
                          ₹{TARIFF_CONFIG.residential.slab1.rate}/unit
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">101-200 units:</span>
                        <span className="text-white">
                          ₹{TARIFF_CONFIG.residential.slab2.rate}/unit
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">201-300 units:</span>
                        <span className="text-white">
                          ₹{TARIFF_CONFIG.residential.slab3.rate}/unit
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">
                          Above 300 units:
                        </span>
                        <span className="text-white">
                          ₹{TARIFF_CONFIG.residential.slab4.rate}/unit
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Flat Rate:</span>
                      <span className="text-white">
                        ₹{TARIFF_CONFIG.commercial.flatRate}/unit
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-400">Fixed Charges:</span>
                    <span className="text-white">
                      ₹{TARIFF_CONFIG.fixedCharges[tariffType]}/month
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-100 mb-2">
                  Cost Breakdown
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Energy Today:</span>
                    <span className="text-white">
                      {displayData.energy.toFixed(2)} kWh
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Energy Cost:</span>
                    <span className="text-white">
                      ₹
                      {(
                        calculateCost(displayData.energy) -
                        TARIFF_CONFIG.fixedCharges[tariffType] / 30
                      ).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Fixed Charges:</span>
                    <span className="text-white">
                      ₹
                      {(TARIFF_CONFIG.fixedCharges[tariffType] / 30).toFixed(
                        2
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-gray-600 pt-2">
                    <span className="text-gray-400 font-medium">
                      Total Cost:
                    </span>
                    <span className="font-bold text-white">
                      ₹{displayData.cost.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "breakdown" && (
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
                        labels: {
                          color: "#D1D5DB",
                          font: {
                            size: 12,
                          },
                          padding: 16,
                        },
                      },
                      tooltip: {
                        callbacks: {
                          label: (context) => {
                            const label = context.label || "";
                            const value = context.raw || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = total > 0 ? (value / total) * 100 : 0;
                            return `${label}: ${value} W (${percentage.toFixed(
                              1
                            )}%)`;
                          },
                        },
                      },
                    },
                  }}
                />
              </div>
              <div className="lg:w-1/2">
                <div className="space-y-4">
                  {energyBreakdown ? Object.entries(energyBreakdown).map(([type, data]) => (
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
                            width: `${(data.power / displayData.power) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>
                          {data.count} device{data.count !== 1 ? "s" : ""}
                        </span>
                        <span>
                          {((data.power / displayData.power) * 100).toFixed(1)}%
                          of total
                        </span>
                      </div>
                    </div>
                  )) : (
                    <>
                      <div className="bg-gray-700 rounded-lg p-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium text-gray-100 capitalize">Light</span>
                          <span className="font-bold text-white">300 W</span>
                        </div>
                        <div className="w-full bg-gray-600 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: "30%" }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                          <span>4 devices</span>
                          <span>30% of total</span>
                        </div>
                      </div>
                      <div className="bg-gray-700 rounded-lg p-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium text-gray-100 capitalize">Fan</span>
                          <span className="font-bold text-white">200 W</span>
                        </div>
                        <div className="w-full bg-gray-600 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: "20%" }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                          <span>2 devices</span>
                          <span>20% of total</span>
                        </div>
                      </div>
                    </>
                  )}
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
            {displayData.devices && displayData.devices.length > 0 ? (
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
                        Cost/Hr
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {displayData.devices.map((device, index) => {
                      const hourlyCost = calculateCost(device.power / 1000);
                      return (
                        <tr
                          key={index}
                          className="hover:bg-gray-700 cursor-pointer"
                          onClick={() => handleDeviceClick(device)}
                        >
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-gray-700 rounded-full flex items-center justify-center">
                                <span className="text-lg">
                                  {DEVICE_CONFIG[device.type]?.icon || "📱"}
                                </span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-100">
                                  {device.name || "N/A"}
                                </div>
                                <div className="text-sm text-gray-400">
                                  {device.id}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400 capitalize">
                            {device.type}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-white">
                            {device.power} W
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-white">
                            ₹{hourlyCost.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                device.state === "on"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {device.state}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                No devices connected
              </div>
            )}
          </div>
        )}

        {activeTab === "trends" && (
          <div>
            <h2 className="text-xl font-semibold text-gray-100 mb-4">
              Daily Energy & Cost Trends (Last 7 Days)
            </h2>
            <div className="h-64">
              <Bar
                data={dailySummaryData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                    tooltip: {
                      mode: "index",
                      intersect: false,
                      backgroundColor: "rgba(31, 41, 55, 0.9)",
                      callbacks: {
                        label: (context) =>
                          `${context.dataset.label}: ${context.raw} kWh`,
                      },
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: { color: "rgba(55, 65, 81, 0.5)" },
                      ticks: { color: "#9CA3AF" },
                      title: {
                        display: true,
                        text: "Energy (kWh)",
                        color: "#9CA3AF",
                      },
                    },
                    x: {
                      grid: { display: false },
                      ticks: { color: "#9CA3AF" },
                    },
                  },
                }}
              />
            </div>
            <div className="mt-4 text-sm text-gray-400 text-center">
              The graph above shows the total daily energy consumption for the
              last 7 days.
            </div>
          </div>
        )}
      </div>

      {showDeviceModal && selectedDevice && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4 md:mx-0">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-100">
                Device Details
              </h3>
              <button
                onClick={() => setShowDeviceModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl bg-gray-700">
                  {DEVICE_CONFIG[selectedDevice.type]?.icon || "📱"}
                </div>
                <div>
                  <h4 className="text-lg font-medium text-white">
                    {selectedDevice.name || "N/A"}
                  </h4>
                  <p className="text-sm text-gray-400">
                    ID: {selectedDevice.id}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
                <div className="flex flex-col">
                  <span className="font-medium">Type</span>
                  <span className="text-white capitalize">
                    {selectedDevice.type}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-medium">Power</span>
                  <span className="text-white">
                    {selectedDevice.power} W
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-medium">Status</span>
                  <span className="text-white capitalize">
                    {selectedDevice.state}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-medium">Cost/Hr</span>
                  <span className="text-white">
                    ₹{calculateCost(selectedDevice.power / 1000).toFixed(2)}
                  </span>
                </div>
              </div>
              {selectedDevice.description && (
                <div className="flex flex-col">
                  <span className="font-medium text-gray-400">
                    Description
                  </span>
                  <p className="text-white">{selectedDevice.description}</p>
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowDeviceModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}