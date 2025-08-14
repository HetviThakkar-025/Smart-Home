import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

export default function Dashboard() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(
          `/api/power/history?hours=1&limit=20&_t=${Date.now()}`
        );
        const data = await res.json();
        const dataArray = Array.isArray(data.data) ? data.data : [];
        setHistory(dataArray);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching power history:", err);
        setHistory([]);
        setLoading(false);
      }
    };

    fetchHistory();
    const interval = setInterval(fetchHistory, 5000); // refresh every 5s
    return () => clearInterval(interval);
  }, []);

  // Helper function to safely format timestamps
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    
    // Handle different timestamp formats
    let date;
    
    if (typeof timestamp === 'string') {
      // Try parsing as ISO string first
      date = new Date(timestamp);
      
      // If invalid, try parsing as a number
      if (isNaN(date.getTime())) {
        const numericTimestamp = parseInt(timestamp);
        if (!isNaN(numericTimestamp)) {
          // Check if it's in seconds (Unix timestamp) or milliseconds
          date = new Date(numericTimestamp < 1000000000000 ? numericTimestamp * 1000 : numericTimestamp);
        }
      }
    } else if (typeof timestamp === 'number') {
      // Check if it's in seconds (Unix timestamp) or milliseconds
      date = new Date(timestamp < 1000000000000 ? timestamp * 1000 : timestamp);
    } else {
      return 'Invalid';
    }
    
    // Final validation
    if (isNaN(date.getTime())) {
      return 'Invalid';
    }
    
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="text-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-purple-300 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-500 rounded-full animate-spin mx-auto" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
        </div>
        <div className="text-xl font-medium text-white mb-2">Loading dashboard...</div>
        <div className="text-purple-300">Connecting to smart home...</div>
      </div>
    </div>
  );

  if (history.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center p-8 max-w-md mx-auto bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20">
          <div className="text-6xl mb-6 animate-bounce">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-4">No Data Available</h2>
          <p className="text-purple-200">Power consumption data will appear here once available.</p>
          <div className="mt-6 w-full bg-purple-800/30 rounded-full h-1">
            <div className="bg-purple-400 h-1 rounded-full animate-pulse" style={{width: '40%'}}></div>
          </div>
        </div>
      </div>
    );
  }

  const latest = history[history.length - 1] || {
    power: 0,
    energy: 0,
    cost: 0,
    peak: 0,
    devices: []
  };

  // Enhanced Chart configuration with fixed date formatting
  const chartData = {
    labels: history.map((d, index) => {
      // Use the helper function to safely format timestamps
      const formattedTime = formatTimestamp(d.timestamp);
      
      // If timestamp is invalid, use index-based labeling as fallback
      if (formattedTime === 'Invalid' || formattedTime === 'N/A') {
        return `Point ${index + 1}`;
      }
      
      return formattedTime;
    }),
    datasets: [
      {
        label: "Power (W)",
        data: history.map((d) => d.power || 0),
        borderColor: "#06b6d4",
        backgroundColor: "rgba(6, 182, 212, 0.1)",
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#0891b2",
        pointBorderColor: "#fff",
        pointHoverRadius: 8,
        pointHoverBorderWidth: 3,
        pointRadius: 5,
        shadowColor: 'rgba(6, 182, 212, 0.4)',
        shadowBlur: 15,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.95)",
        titleFont: { size: 16, weight: 'bold' },
        bodyFont: { size: 14 },
        padding: 16,
        cornerRadius: 12,
        displayColors: false,
        borderColor: '#06b6d4',
        borderWidth: 2,
        callbacks: {
          label: (context) => `⚡ ${context.parsed.y} W`,
          title: (tooltipItems) => {
            const dataPoint = history[tooltipItems[0].dataIndex];
            const formattedTime = formatTimestamp(dataPoint?.timestamp);
            return formattedTime !== 'Invalid' && formattedTime !== 'N/A' 
              ? formattedTime 
              : `Data Point ${tooltipItems[0].dataIndex + 1}`;
          }
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#94a3b8",
          font: { weight: '500' },
          maxTicksLimit: 6, // Limit number of x-axis labels to prevent crowding
        },
        border: {
          color: 'transparent'
        },
      },
      y: {
        grid: {
          color: "rgba(148, 163, 184, 0.1)",
        },
        ticks: {
          color: "#94a3b8",
          font: { weight: '500' },
          callback: (value) => `${value} W`,
        },
        border: {
          color: 'transparent'
        },
      },
    },
  };

  // Calculate percentage of peak power with safety check
  const powerPercentage = latest.peak > 0 ? (latest.power / latest.peak * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-2 sm:p-4 md:p-6">
      {/* Floating background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -left-4 w-32 sm:w-48 md:w-72 h-32 sm:h-48 md:h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-20 -right-4 w-32 sm:w-48 md:w-72 h-32 sm:h-48 md:h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute -bottom-8 left-20 w-32 sm:w-48 md:w-72 h-32 sm:h-48 md:h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative z-10">
        <header className="mb-4 sm:mb-6 md:mb-8">
          <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 mb-2 sm:mb-3 md:mb-4">
            <div className="p-2 sm:p-2.5 md:p-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg sm:rounded-xl shadow-lg shadow-cyan-500/25">
              <span className="text-lg sm:text-xl md:text-2xl">⚡</span>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Energy Dashboard
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-slate-300">Real-time power consumption monitoring</p>
            </div>
          </div>
          <div className="h-0.5 sm:h-0.5 md:h-1 w-16 sm:w-20 md:w-24 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full"></div>
        </header>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
          <SummaryCard 
            title="Current Power" 
            value={`${latest.power || 0} W`} 
            icon="⚡" 
            gradient="from-emerald-500 to-teal-600"
            trend={history.length > 1 && latest.power > (history[history.length - 2]?.power || 0) ? "up" : "down"}
          />
          <SummaryCard 
            title="Energy Used" 
            value={`${(latest.energy || 0).toFixed(2)} kWh`} 
            icon="🔋"
            gradient="from-blue-500 to-cyan-600"
          />
          <SummaryCard 
            title="Today's Cost" 
            value={`$${(latest.cost || 0).toFixed(2)}`} 
            icon="💰"
            gradient="from-yellow-500 to-orange-600"
          />
          <SummaryCard 
            title="Peak Power" 
            value={`${latest.peak || 0} W`} 
            icon="📈"
            gradient="from-purple-500 to-pink-600"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {/* Power Chart */}
          <div className="xl:col-span-2 bg-white/10 backdrop-blur-lg p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl md:rounded-2xl shadow-2xl border border-white/20">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 sm:mb-4 md:mb-6 space-y-2 sm:space-y-0">
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1">Power Consumption</h2>
                <p className="text-xs sm:text-sm md:text-base text-slate-300">Live monitoring over time</p>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3 bg-white/10 rounded-full px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 backdrop-blur-sm">
                <span className="inline-block w-2 sm:w-2.5 md:w-3 h-2 sm:h-2.5 md:h-3 rounded-full bg-cyan-400 animate-pulse"></span>
                <span className="text-xs sm:text-sm text-slate-300 font-medium">Live Data</span>
              </div>
            </div>
            <div className="h-48 sm:h-64 md:h-80 relative">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>

          {/* Power Meter */}
          <div className="bg-white/10 backdrop-blur-lg p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl md:rounded-2xl shadow-2xl border border-white/20">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2">Power Meter</h2>
            <p className="text-xs sm:text-sm md:text-base text-slate-300 mb-3 sm:mb-4 md:mb-6">Current usage visualization</p>
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 mb-3 sm:mb-4 md:mb-6">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* Meter background */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="rgba(148, 163, 184, 0.2)"
                    strokeWidth="8"
                  />
                  {/* Active meter with gradient */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="url(#meterGradient)"
                    strokeWidth="8"
                    strokeDasharray={`${powerPercentage * 2.83}, 283`}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                  <defs>
                    <linearGradient id="meterGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#06b6d4" />
                      <stop offset="50%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-lg sm:text-2xl md:text-3xl font-bold text-white mb-1">{latest.power || 0} W</span>
                  <span className="text-xs sm:text-sm text-slate-300">
                    {powerPercentage.toFixed(0)}% of peak
                  </span>
                </div>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2 sm:h-2.5 md:h-3 overflow-hidden backdrop-blur-sm">
                <div 
                  className="bg-gradient-to-r from-cyan-400 to-purple-500 h-2 sm:h-2.5 md:h-3 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                  style={{ width: `${Math.min(powerPercentage, 100)}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>
              <div className="mt-2 sm:mt-3 md:mt-4 text-center">
                <div className="text-xs text-slate-400 mb-1">Efficiency Rating</div>
                <div className="flex justify-center space-x-0.5 sm:space-x-1">
                  {[1,2,3,4,5].map((star) => (
                    <span key={star} className={`text-sm sm:text-base md:text-lg ${powerPercentage < star * 20 ? 'text-slate-600' : 'text-yellow-400'}`}>
                      ⭐
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Devices Table */}
        <div className="mt-4 sm:mt-6 md:mt-8 bg-white/10 backdrop-blur-lg rounded-lg sm:rounded-xl md:rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="p-3 sm:p-4 md:p-6 border-b border-white/10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1">Connected Devices</h2>
                <p className="text-xs sm:text-sm md:text-base text-slate-300">Real-time device status</p>
              </div>
              <div className="flex items-center space-x-2 text-slate-300">
                <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs sm:text-sm">{latest.devices?.length || 0} devices online</span>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Device</th>
                  <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider hidden sm:table-cell">Type</th>
                  <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Power</th>
                  <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {(latest.devices || []).map((device, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition-colors duration-200">
                    <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg ${getDeviceColor(device.type)}`}>
                          <span className="text-sm sm:text-lg md:text-xl">
                            {getDeviceIcon(device.type)}
                          </span>
                        </div>
                        <div className="ml-2 sm:ml-3 md:ml-4">
                          <div className="text-xs sm:text-sm font-semibold text-white">{device.name || 'Unknown Device'}</div>
                          <div className="text-xs text-slate-400 sm:hidden">{device.type || 'Unknown'}</div>
                          <div className="text-xs text-slate-400 hidden sm:block">Smart Device</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 whitespace-nowrap hidden sm:table-cell">
                      <div className="text-xs sm:text-sm text-slate-300 capitalize font-medium">{device.type || 'Unknown'}</div>
                    </td>
                    <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 whitespace-nowrap">
                      <div className="text-xs sm:text-sm font-bold text-white">{device.power || 0} W</div>
                      <div className="text-xs text-slate-400">
                        {latest.power > 0 ? (((device.power || 0) / latest.power) * 100).toFixed(1) : 0}%
                      </div>
                    </td>
                    <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 whitespace-nowrap">
                      <span className={`px-2 sm:px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full shadow-sm ${
                        device.state === "ON" 
                          ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-green-500/25" 
                          : device.state === "OFF" 
                            ? "bg-gradient-to-r from-red-400 to-rose-500 text-white shadow-red-500/25" 
                            : "bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-yellow-500/25"
                      }`}>
                        <span className="hidden sm:inline">
                          {device.state === "ON" && "🟢 "}
                          {device.state === "OFF" && "🔴 "}
                          {device.state === "AUTO" && "🟡 "}
                        </span>
                        {device.state || 'Unknown'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ title, value, icon, gradient, trend }) {
  return (
    <div className="bg-white/10 backdrop-blur-lg p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl md:rounded-2xl shadow-2xl border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-3xl">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-medium text-slate-300 mb-1 truncate">{title}</p>
          <h3 className="text-sm sm:text-lg md:text-2xl font-bold text-white truncate">{value}</h3>
        </div>
        <div className={`p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl bg-gradient-to-r ${gradient} shadow-lg flex-shrink-0 ml-2`}>
          <span className="text-lg sm:text-xl md:text-2xl filter drop-shadow-sm">{icon}</span>
        </div>
      </div>
      {trend && (
        <div className={`mt-2 sm:mt-3 flex items-center text-xs sm:text-sm font-medium ${
          trend === "up" ? "text-green-400" : "text-red-400"
        }`}>
          <div className="flex items-center">
            {trend === "up" ? (
              <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 112 0v11.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
            <span className="hidden sm:inline">{trend === "up" ? "Increasing" : "Decreasing"}</span>
            <span className="sm:hidden">{trend === "up" ? "↑" : "↓"}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function getDeviceIcon(type) {
  switch(type) {
    case 'light':
      return '💡';
    case 'fan':
      return '🌀';
    case 'appliance':
      return '🔌';
    case 'furniture':
      return '🪑';
    default:
      return '📱';
  }
}

function getDeviceColor(type) {
  switch(type) {
    case 'light':
      return 'bg-gradient-to-r from-yellow-400 to-orange-500';
    case 'fan':
      return 'bg-gradient-to-r from-blue-400 to-cyan-500';
    case 'appliance':
      return 'bg-gradient-to-r from-purple-400 to-pink-500';
    case 'furniture':
      return 'bg-gradient-to-r from-green-400 to-emerald-500';
    default:
      return 'bg-gradient-to-r from-gray-400 to-slate-500';
  }
}