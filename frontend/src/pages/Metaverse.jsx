import React, { useEffect, useState } from "react";
import Dashboard from "./Dashboard";

const deviceIcons = {
  light: "💡",
  fan: "🌀",
  tv: "📺",
  oven: "🔥",
  fridge: "❄️",
  mirror: "🪞",
  chimney: "🏭",
  washingmachine: "🧺",
  table: "🪑",
  carpet: "🧶",
  bed: "🛏️",
  sofa: "🛋️"
};

const deviceLabels = {
  light: "Tube Light",
  fan: "Fan",
  tv: "TV",
  oven: "Oven",
  fridge: "Fridge",
  mirror: "Mirror Light",
  chimney: "Chimney",
  washingmachine: "Washing Machine",
  table: "Table",
  carpet: "Carpet",
  bed: "Bed",
  sofa: "Sofa"
};

function Metaverse() {
  const [showDashboard, setShowDashboard] = useState(false);
  const [gameLoaded, setGameLoaded] = useState(false);
  const [activeDevices, setActiveDevices] = useState({});

  useEffect(() => {
    const iframe = document.createElement("iframe");
    iframe.src = "/src/game/index.html";
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "none";
    iframe.style.display = "block";

    const container = document.getElementById("game-wrapper");
    container.innerHTML = "";
    container.appendChild(iframe);

    const handleMessage = (event) => {
      if (event.data?.type === "GAME_LOADED") {
        setGameLoaded(true);
      } else if (event.data?.type === "POWER_UPDATE") {
        setActiveDevices(event.data.payload.activeDevices || {});
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const sendDeviceToPhaser = (device) => {
    const iframe = document.querySelector("iframe");
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage({ type: "ADD_DEVICE", device }, "*");
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-16">
      {/* Sidebar Menu */}
      <div className="w-64 bg-gradient-to-b from-gray-800 to-gray-900 text-white p-6 shadow-2xl border-r border-gray-700 overflow-y-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Devices
          </h2>
          <div className="w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
        </div>
        
        {/* Active Devices Summary */}
        <div className="mb-6 p-4 bg-gray-700 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Active Devices</h3>
          {Object.keys(activeDevices).filter(key => activeDevices[key] > 0).length > 0 ? (
            <ul className="space-y-1">
              {Object.entries(activeDevices)
                .filter(([_, count]) => count > 0)
                .map(([device, count]) => (
                  <li key={device} className="flex justify-between items-center">
                    <span className="text-sm">{deviceLabels[device] || device}</span>
                    <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {count}
                    </span>
                  </li>
                ))}
            </ul>
          ) : (
            <p className="text-gray-400 text-sm">No active devices</p>
          )}
        </div>

        {/* Device Buttons */}
        <div className="space-y-4">
          {Object.keys(deviceIcons).map((device) => (
            <button
              key={device}
              className="group w-full bg-gradient-to-r from-gray-700 to-gray-600 hover:from-blue-600 hover:to-purple-600 p-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out border border-gray-600 hover:border-blue-500 relative overflow-hidden"
              onClick={() => sendDeviceToPhaser(device)}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/20 group-hover:to-purple-500/20 rounded-xl transition-all duration-300"></div>
              <div className="relative flex items-center justify-center space-x-3">
                <span className="text-2xl group-hover:scale-110 transition-transform duration-300">
                  {deviceIcons[device]}
                </span>
                <span className="font-semibold text-lg group-hover:text-white transition-colors duration-300">
                  Add {deviceLabels[device] || device}
                </span>
              </div>
              <div className="absolute inset-0 rounded-xl shadow-inner"></div>
            </button>
          ))}
        </div>

        {/* Dashboard Toggle */}
        <div className="mt-8 pt-6 border-t border-gray-700">
          <button
            onClick={() => setShowDashboard(!showDashboard)}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-2 px-4 rounded-lg shadow-lg transition-all duration-300"
          >
            {showDashboard ? 'Hide Dashboard' : 'Show Dashboard'}
          </button>
        </div>
      </div>

      {/* Game Container */}
      <div className="flex-1 relative">
        <div 
          id="game-wrapper" 
          className="w-full h-full bg-gray-900 rounded-l-lg shadow-2xl border-l border-gray-700 relative overflow-hidden"
        >
          {!gameLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-400">Loading Metaverse...</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Dashboard Panel */}
        {showDashboard && (
          <div className="absolute top-0 right-0 w-full md:w-1/3 lg:w-1/4 h-full bg-gray-50 shadow-xl z-10 overflow-y-auto p-4 border-l border-gray-200">
            <Dashboard />
          </div>
        )}
      </div>
    </div>
  );
}

export default Metaverse;