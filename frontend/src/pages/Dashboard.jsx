import React, { useEffect, useState, useRef } from "react";
import { Line, Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

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
  router: { icon: "📶", color: "bg-green-500", wattage: 10, alwaysOn: true }
};

const TARIFF_CONFIG = {
  residential: {
    slab1: { limit: 100, rate: 3.50 },
    slab2: { limit: 200, rate: 4.50 },
    slab3: { limit: 300, rate: 6.50 },
    slab4: { rate: 7.50 }
  },
  commercial: {
    flatRate: 8.00
  },
  fixedCharges: {
    residential: 100,
    commercial: 200
  }
};

function SummaryCard({ title, value, icon, color, trend, subtitle }) {
  return (
    <div className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors h-full">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-400">{title}</p>
          <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
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

export default function EnhancedDashboard({ powerData, deviceLabels, historicalData }) {
  const [loading, setLoading] = useState(!powerData);
  const [activeTab, setActiveTab] = useState("power");
  const [timeRange, setTimeRange] = useState("1h");
  const [energyBreakdown, setEnergyBreakdown] = useState(null);
  const [deviceBreakdown, setDeviceBreakdown] = useState(null);
  const [tariffType, setTariffType] = useState("residential");
  const [savedData, setSavedData] = useState(() => {
    const saved = localStorage.getItem('energyDashboardData');
    return saved ? JSON.parse(saved) : null;
  });
  const [notification, setNotification] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [showDeviceModal, setShowDeviceModal] = useState(false);
  const exportMenuRef = useRef(null);

  // Close export menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target)) {
        document.getElementById('exportMenu')?.classList.add('hidden');
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Validate and clean data
  const cleanData = (data) => {
    if (!data) return null;
    
    // Clean power data
    if (data.powerData) {
      return {
        ...data,
        power: Number(data.power) || 0,
        energy: Number(data.energy) || 0,
        cost: Number(data.cost) || 0,
        peak: Number(data.peak) || 0,
        devices: data.devices?.map(device => ({
          ...device,
          power: Number(device.power) || 0,
          state: device.state || 'OFF'
        })) || []
      };
    }
    
    // Clean historical data
    if (Array.isArray(data)) {
      return data.map(item => ({
        ...item,
        power: Number(item.power) || 0,
        energy: Number(item.energy) || 0,
        cost: Number(item.cost) || 0,
        peak: Number(item.peak) || 0,
        timestamp: item.timestamp || new Date().toISOString()
      }));
    }
    
    return data;
  };

  useEffect(() => {
    if (powerData) {
      setLoading(false);
      const cleanedPowerData = cleanData(powerData);
      const cleanedHistoricalData = cleanData(historicalData);
      
      calculateEnergyBreakdown(cleanedPowerData);
      calculateDeviceBreakdown(cleanedPowerData);
      
      const dataToSave = {
        ...cleanedPowerData,
        historicalData: cleanedHistoricalData,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('energyDashboardData', JSON.stringify(dataToSave));
      setSavedData(dataToSave);
    }
  }, [powerData, historicalData]);

  const calculateEnergyBreakdown = (data) => {
    if (!data?.devices) return;
    
    const breakdown = data.devices.reduce((acc, device) => {
      const type = device.type || 'other';
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

    if (tariffType === 'commercial') {
      return kWh * tariff.flatRate + (TARIFF_CONFIG.fixedCharges.commercial / 30);
    }
    
    let cost = 0;
    let remainingUnits = kWh;
    
    const slab1Units = Math.min(remainingUnits, tariff.slab1.limit);
    cost += slab1Units * tariff.slab1.rate;
    remainingUnits -= slab1Units;
    
    if (remainingUnits <= 0) return cost + (TARIFF_CONFIG.fixedCharges.residential / 30);
    
    const slab2Units = Math.min(remainingUnits, tariff.slab2.limit - tariff.slab1.limit);
    cost += slab2Units * tariff.slab2.rate;
    remainingUnits -= slab2Units;
    
    if (remainingUnits <= 0) return cost + (TARIFF_CONFIG.fixedCharges.residential / 30);
    
    const slab3Units = Math.min(remainingUnits, tariff.slab3.limit - tariff.slab2.limit);
    cost += slab3Units * tariff.slab3.rate;
    remainingUnits -= slab3Units;
    
    if (remainingUnits <= 0) return cost + (TARIFF_CONFIG.fixedCharges.residential / 30);
    
    cost += remainingUnits * tariff.slab4.rate;
    
    return cost + (TARIFF_CONFIG.fixedCharges.residential / 30);
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleDeviceClick = (device) => {
    setSelectedDevice(device);
    setShowDeviceModal(true);
  };

  const displayData = cleanData(powerData || savedData);
  const displayHistoricalData = cleanData(historicalData || (savedData?.historicalData || []));

  // Fixed time range filtering
  const filteredHistoricalData = displayHistoricalData.filter(item => {
    if (!item.timestamp) return false;
    
    const now = new Date();
    const itemTime = new Date(item.timestamp);
    const timeDiff = now - itemTime;

    if (timeRange === "1h") {
      return timeDiff <= 60 * 60 * 1000; // 1 hour
    } else if (timeRange === "24h") {
      return timeDiff <= 24 * 60 * 60 * 1000; // 24 hours
    } else if (timeRange === "7d") {
      return timeDiff <= 7 * 24 * 60 * 60 * 1000; // 7 days
    }
    return true;
  });

  // Improved export functions
  const exportToCSV = (range = 'current') => {
    let dataToExport = [];
    const now = new Date();
    
    if (range === 'current') {
      // Export currently filtered data (1h/24h/7d)
      dataToExport = filteredHistoricalData;
    } else if (range === 'today') {
      const todayStart = new Date(now);
      todayStart.setHours(0, 0, 0, 0);
      dataToExport = displayHistoricalData.filter(item => {
        const itemTime = new Date(item.timestamp);
        return itemTime >= todayStart;
      });
    } else if (range === 'week') {
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      dataToExport = displayHistoricalData.filter(item => {
        const itemTime = new Date(item.timestamp);
        return itemTime >= oneWeekAgo;
      });
    } else if (range === 'month') {
      const oneMonthAgo = new Date(now);
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      dataToExport = displayHistoricalData.filter(item => {
        const itemTime = new Date(item.timestamp);
        return itemTime >= oneMonthAgo;
      });
    }

    if (dataToExport.length === 0) {
      showNotification('No data available for the selected range', 'warning');
      return;
    }

    const headers = ['Timestamp', 'Power (W)', 'Energy (kWh)', 'Cost (₹)', 'Peak Power (W)'];
    const rows = dataToExport.map(item => [
      new Date(item.timestamp).toLocaleString(),
      item.power,
      item.energy.toFixed(3),
      item.cost.toFixed(2),
      item.peak
    ]);

    let csvContent = headers.join(',') + '\n';
    rows.forEach(row => {
      csvContent += row.join(',') + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `energy_data_${range}_${new Date().toISOString().split('T')[0]}.csv`);
    showNotification(`Exported ${range} data successfully`, 'success');
  };

  const exportToExcel = () => {
    if (displayHistoricalData.length === 0) {
      showNotification('No data available to export', 'warning');
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(displayHistoricalData.map(item => ({
      'Timestamp': new Date(item.timestamp).toLocaleString(),
      'Power (W)': item.power,
      'Energy (kWh)': item.energy.toFixed(3),
      'Cost (₹)': item.cost.toFixed(2),
      'Peak Power (W)': item.peak
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "EnergyData");
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    saveAs(data, `energy_data_${new Date().toISOString().split('T')[0]}.xlsx`);
    showNotification('Exported to Excel successfully', 'success');
  };

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

  // Chart data configurations
  const powerChartData = {
    labels: filteredHistoricalData.map((d) => formatTimestamp(d.timestamp)),
    datasets: [
      {
        label: "Power (W)",
        data: filteredHistoricalData.map((d) => d.power),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        borderWidth: 2,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const costChartData = {
    labels: filteredHistoricalData.map((d) => formatTimestamp(d.timestamp)),
    datasets: [
      {
        label: "Cost (₹)",
        data: filteredHistoricalData.map((d) => d.cost),
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        borderWidth: 2,
        tension: 0.4,
        fill: true,
      },
    ],
  };

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
          "#f59e0b",
          "#84cc16"
        ],
        borderWidth: 1,
      },
    ],
  };

  // Group data by day for weekly trends
  const dailyData = displayHistoricalData.reduce((acc, item) => {
    const date = item.timestamp.split('T')[0];
    if (!acc[date]) {
      acc[date] = {
        date,
        energy: 0,
        cost: 0,
        power: []
      };
    }
    acc[date].energy += item.energy;
    acc[date].cost += item.cost;
    acc[date].power.push(item.power);
    return acc;
  }, {});

  const dailySummaryData = {
    labels: Object.values(dailyData).map(item => formatDate(item.date)),
    datasets: [
      {
        label: "Daily Energy (kWh)",
        data: Object.values(dailyData).map(item => parseFloat(item.energy.toFixed(2))),
        backgroundColor: "rgba(59, 130, 246, 0.7)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1
      }
    ]
  };

  const powerPercentage = displayData.peak > 0 
    ? (displayData.power / displayData.peak * 100) 
    : 0;

  const monthlyCostEstimate = calculateCost((displayData.energy || 0) * 30);

  return (
    <div className="p-4 h-full overflow-y-auto">
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-md shadow-lg ${
          notification.type === 'success' ? 'bg-green-500' :
          notification.type === 'warning' ? 'bg-yellow-500' :
          'bg-blue-500'
        } text-white`}>
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
          <h1 className="text-2xl font-bold text-gray-100">Energy Dashboard</h1>
          <p className="text-gray-400">
            {new Date(displayData.timestamp).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
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
              className={`px-3 py-1 rounded-md ${timeRange === "1h" ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300'}`}
            >
              1h
            </button>
            <button
              onClick={() => setTimeRange("24h")}
              className={`px-3 py-1 rounded-md ${timeRange === "24h" ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300'}`}
            >
              24h
            </button>
            <button
              onClick={() => setTimeRange("7d")}
              className={`px-3 py-1 rounded-md ${timeRange === "7d" ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300'}`}
            >
              7d
            </button>
          </div>
          
          <div className="relative" ref={exportMenuRef}>
            <button
              className="px-3 py-1 rounded-md bg-green-600 text-white flex items-center gap-1"
              onClick={() => document.getElementById('exportMenu').classList.toggle('hidden')}
            >
              <span>Export</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            <div id="exportMenu" className="hidden absolute right-0 mt-1 w-48 bg-gray-800 rounded-md shadow-lg z-10 border border-gray-700">
              <div className="py-1">
                <button
                  onClick={() => exportToCSV('current')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
                >
                  Export Current View (CSV)
                </button>
                <button
                  onClick={() => exportToCSV('today')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
                >
                  Export Today (CSV)
                </button>
                <button
                  onClick={() => exportToCSV('week')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
                >
                  Export Week (CSV)
                </button>
                <button
                  onClick={() => exportToCSV('month')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
                >
                  Export Month (CSV)
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
          trend={
            displayHistoricalData.length > 1 &&
            displayData.power > displayHistoricalData[displayHistoricalData.length - 2].power
              ? "up"
              : "down"
          }
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
          subtitle={new Date(displayData.timestamp).toLocaleTimeString()}
        />
        <SummaryCard
          title="Monthly Estimate"
          value={`₹${monthlyCostEstimate.toFixed(2)}`}
          icon="💰"
          color="bg-yellow-500"
          subtitle={`${tariffType === 'residential' ? 'Residential' : 'Commercial'} rate`}
        />
      </div>

      <div className="flex border-b border-gray-700 mb-4 overflow-x-auto">
        <button
          className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === "power" ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}
          onClick={() => setActiveTab("power")}
        >
          Power Consumption
        </button>
        <button
          className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === "cost" ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}
          onClick={() => setActiveTab("cost")}
        >
          Cost Analysis
        </button>
        <button
          className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === "breakdown" ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}
          onClick={() => setActiveTab("breakdown")}
        >
          Energy Breakdown
        </button>
        <button
          className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === "devices" ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}
          onClick={() => setActiveTab("devices")}
        >
          Devices
        </button>
        <button
          className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === "trends" ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}
          onClick={() => setActiveTab("trends")}
        >
          Weekly Trends
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
                        label: (context) => `${context.dataset.label}: ${context.raw} W`
                      }
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: { color: "rgba(55, 65, 81, 0.5)" },
                      ticks: { color: "#9CA3AF" },
                      title: {
                        display: true,
                        text: 'Power (W)',
                        color: '#9CA3AF'
                      }
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
                        label: (context) => `${context.dataset.label}: ₹${context.raw.toFixed(2)}`
                      }
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: { color: "rgba(55, 65, 81, 0.5)" },
                      ticks: { color: "#9CA3AF" },
                      title: {
                        display: true,
                        text: 'Cost (₹)',
                        color: '#9CA3AF'
                      }
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
                <h3 className="text-lg font-medium text-gray-100 mb-2">Tariff Information</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Current Plan:</span>
                    <span className="text-white capitalize">{tariffType}</span>
                  </div>
                  {tariffType === 'residential' ? (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-400">First 100 units:</span>
                        <span className="text-white">₹{TARIFF_CONFIG.residential.slab1.rate}/unit</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">101-200 units:</span>
                        <span className="text-white">₹{TARIFF_CONFIG.residential.slab2.rate}/unit</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">201-300 units:</span>
                        <span className="text-white">₹{TARIFF_CONFIG.residential.slab3.rate}/unit</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Above 300 units:</span>
                        <span className="text-white">₹{TARIFF_CONFIG.residential.slab4.rate}/unit</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Flat Rate:</span>
                      <span className="text-white">₹{TARIFF_CONFIG.commercial.flatRate}/unit</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-400">Fixed Charges:</span>
                    <span className="text-white">₹{TARIFF_CONFIG.fixedCharges[tariffType]}/month</span>
                  </div>
                </div>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-100 mb-2">Cost Breakdown</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Energy Today:</span>
                    <span className="text-white">{displayData.energy.toFixed(2)} kWh</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Energy Cost:</span>
                    <span className="text-white">₹{(calculateCost(displayData.energy) - (TARIFF_CONFIG.fixedCharges[tariffType] / 30)).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Fixed Charges:</span>
                    <span className="text-white">₹{(TARIFF_CONFIG.fixedCharges[tariffType] / 30).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-600 pt-2">
                    <span className="text-gray-400 font-medium">Total Cost:</span>
                    <span className="font-bold text-white">₹{displayData.cost.toFixed(2)}</span>
                  </div>
                </div>
              </div>
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
                        labels: { 
                          color: "#D1D5DB",
                          font: {
                            size: 12
                          },
                          padding: 16
                        },
                      },
                      tooltip: {
                        callbacks: {
                          label: (context) => {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const percentage = context.dataset.data[context.dataIndex] / 
                              context.dataset.data.reduce((a, b) => a + b, 0) * 100;
                            return `${label}: ${value} W (${percentage.toFixed(1)}%)`;
                          }
                        }
                      }
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
                            width: `${(data.power / displayData.power) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>{data.count} device{data.count !== 1 ? "s" : ""}</span>
                        <span>{((data.power / displayData.power) * 100).toFixed(1)}% of total</span>
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
                      Cost/Hr
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {displayData.devices?.map((device, index) => {
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
                                {DEVICE_CONFIG[device.type]?.icon || '📱'}
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
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-white">
                          ₹{hourlyCost.toFixed(2)}
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
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "trends" && (
          <div>
            <h2 className="text-xl font-semibold text-gray-100 mb-4">
              Weekly Energy Trends
            </h2>
            <div className="h-64 mb-6">
              <Bar
                data={dailySummaryData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      callbacks: {
                        label: (context) => `${context.dataset.label}: ${context.raw} kWh`
                      }
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: { color: "rgba(55, 65, 81, 0.5)" },
                      ticks: { color: "#9CA3AF" },
                      title: {
                        display: true,
                        text: 'Energy (kWh)',
                        color: '#9CA3AF'
                      }
                    },
                    x: {
                      grid: { color: "rgba(55, 65, 81, 0.5)" },
                      ticks: { color: "#9CA3AF" },
                    },
                  },
                }}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-100 mb-3">Weekly Summary</h3>
                <div className="space-y-3">
                  {Object.values(dailyData).map((item, index) => {
                    const cost = calculateCost(item.energy);
                    return (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-gray-300">{formatDate(item.date)}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-gray-400 text-sm">{item.energy.toFixed(2)} kWh</span>
                          <span className="font-medium text-white">₹{cost.toFixed(2)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-100 mb-3">Savings Tips</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    Turn off lights and fans when not in use
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    Use energy-efficient appliances (look for BEE 5-star rating)
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    Set AC temperature to 24°C or higher
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    Use natural light during daytime
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    Unplug devices when not in use to avoid phantom load
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

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
          <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
            <div
              className="bg-blue-500 h-3 rounded-full"
              style={{ width: `${powerPercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between w-full text-xs text-gray-400">
            <span>0 W</span>
            <span>{displayData.peak} W (Peak)</span>
          </div>
        </div>
      </div>

      {showDeviceModal && selectedDevice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowDeviceModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
            
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <span className={`${DEVICE_CONFIG[selectedDevice.type]?.color || 'bg-gray-500'} w-8 h-8 rounded-full flex items-center justify-center`}>
                {DEVICE_CONFIG[selectedDevice.type]?.icon || '📱'}
              </span>
              {selectedDevice.name}
            </h2>
            
            <div className="space-y-4 mt-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Type:</span>
                <span className="text-white capitalize">{selectedDevice.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Power Consumption:</span>
                <span className="text-white">{selectedDevice.power} W</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Hourly Cost:</span>
                <span className="text-white">₹{calculateCost(selectedDevice.power / 1000).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Daily Cost (24hrs):</span>
                <span className="text-white">₹{(calculateCost(selectedDevice.power / 1000) * 24).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status:</span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  selectedDevice.state === "ON"
                    ? "bg-green-500 text-white"
                    : selectedDevice.state === "OFF"
                    ? "bg-gray-500 text-white"
                    : "bg-yellow-500 text-white"
                }`}>
                  {selectedDevice.state}
                </span>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-700">
              <h3 className="text-lg font-medium text-gray-100 mb-2">Energy Saving Tips</h3>
              <ul className="text-sm text-gray-300 space-y-2">
                {selectedDevice.type === 'light' && (
                  <>
                    <li>• Switch to LED bulbs which use 75% less energy</li>
                    <li>• Turn off lights when not in use</li>
                    <li>• Use natural light during daytime</li>
                  </>
                )}
                {selectedDevice.type === 'fan' && (
                  <>
                    <li>• Use ceiling fans instead of AC when possible</li>
                    <li>• Turn off fans when leaving the room</li>
                    <li>• Clean fan blades regularly for better efficiency</li>
                  </>
                )}
                {selectedDevice.type === 'ac' && (
                  <>
                    <li>• Set temperature to 24°C or higher</li>
                    <li>• Use timer function to avoid overnight usage</li>
                    <li>• Ensure proper insulation of the room</li>
                  </>
                )}
                {selectedDevice.type === 'fridge' && (
                  <>
                    <li>• Keep refrigerator well-stocked (but not overcrowded)</li>
                    <li>• Ensure proper door seals</li>
                    <li>• Set temperature between 3-5°C for fridge, -18°C for freezer</li>
                  </>
                )}
                {!['light', 'fan', 'ac', 'fridge'].includes(selectedDevice.type) && (
                  <li>Unplug when not in use to avoid standby power consumption</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}