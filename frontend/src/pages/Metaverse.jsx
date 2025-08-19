import React, { useEffect, useState } from "react";
import Dashboard from "./Dashboard";
import toast, { Toaster } from 'react-hot-toast';

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
  sofa: "🛋️",
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
  sofa: "Sofa",
};

const ALERT_THRESHOLDS = {
  DAILY_COST: 500,
  POWER_CONSUMPTION: 3000,
};

function Metaverse() {
  const [showDashboard, setShowDashboard] = useState(false);
  const [gameLoaded, setGameLoaded] = useState(false);
  const [powerData, setPowerData] = useState({
    power: 0,
    energy: 0,
    cost: 0,
    peak: 0,
    devices: [],
    timestamp: "",
    date: new Date().toDateString()
  });
  const [costAlertShown, setCostAlertShown] = useState(false);
  const [powerAlertShown, setPowerAlertShown] = useState(false);
  const [historicalData, setHistoricalData] = useState([]);

  useEffect(() => {
    const iframe = document.createElement("iframe");
    iframe.src = "/src/game/index.html";
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "none";

    const container = document.getElementById("game-wrapper");
    container.innerHTML = "";
    container.appendChild(iframe);

    const handleMessage = (event) => {
      if (event.data?.type === "GAME_LOADED") {
        setGameLoaded(true);
      } else if (event.data?.type === "POWER_UPDATE") {
        const newData = event.data.payload;
        
        if (newData.date !== powerData.date) {
          setCostAlertShown(false);
          setPowerAlertShown(false);
        }
        
        setPowerData(newData);
        checkAlerts(newData);
        
        // Send data to parent (App component)
        window.parent.postMessage({
          type: "POWER_UPDATE_FROM_METAVERSE",
          payload: newData
        }, "*");
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  useEffect(() => {
    // Load historical data when component mounts
    const fetchHistoricalData = async () => {
      try {
        const response = await fetch('/api/power/history?days=7');
        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          setHistoricalData(data.data);
        }
      } catch (error) {
        console.error("Error fetching historical data:", error);
        // Generate mock data for development
        const mockData = Array.from({ length: 24 }, (_, i) => ({
          timestamp: new Date(Date.now() - (24 - i) * 3600000).toISOString(),
          power: Math.floor(Math.random() * 2000) + 500,
          energy: (Math.random() * 10).toFixed(2),
          cost: (Math.random() * 100).toFixed(2),
          peak: 2500
        }));
        setHistoricalData(mockData);
      }
    };
    
    fetchHistoricalData();
  }, []);

  const checkAlerts = (data) => {
    if (data.cost >= ALERT_THRESHOLDS.DAILY_COST && !costAlertShown) {
      toast.error(
        `High electricity bill! Daily cost reached ₹${data.cost.toFixed(2)}`,
        {
          duration: 6000,
          style: {
            background: '#f56565',
            color: '#fff',
          },
          icon: '💰',
        }
      );
      setCostAlertShown(true);
    } else if (data.cost < ALERT_THRESHOLDS.DAILY_COST * 0.9) {
      setCostAlertShown(false);
    }

    if (data.power >= ALERT_THRESHOLDS.POWER_CONSUMPTION && !powerAlertShown) {
      toast.error(
        `High power usage! ${data.power}W consumed`,
        {
          duration: 6000,
          style: {
            background: '#ed8936',
            color: '#fff',
          },
          icon: '⚠️',
        }
      );
      setPowerAlertShown(true);
    } else if (data.power < ALERT_THRESHOLDS.POWER_CONSUMPTION * 0.9) {
      setPowerAlertShown(false);
    }
  };

  const sendDeviceToPhaser = (device) => {
    document
      .querySelector("iframe")
      ?.contentWindow?.postMessage({ type: "ADD_DEVICE", device }, "*");
  };

  const toggleDashboard = () => {
    setShowDashboard(!showDashboard);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-16">
      <Toaster position="bottom-right" />
      
      {/* Device Sidebar */}
      <div className="w-64 bg-gradient-to-b from-gray-800 to-gray-900 text-white p-6 shadow-2xl border-r border-gray-700 overflow-y-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Devices
          </h2>
          <div className="w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
        </div>

        <div className="space-y-4">
          {Object.keys(deviceIcons).map((device) => (
            <button
              key={device}
              className={`group w-full p-4 rounded-xl shadow-lg transform transition-all duration-300 ease-in-out border bg-gradient-to-r from-gray-700 to-gray-600 border-gray-600 hover:from-blue-600 hover:to-purple-600 hover:border-blue-500`}
              onClick={() => sendDeviceToPhaser(device)}
            >
              <div className="relative flex items-center justify-center space-x-3">
                <span className="text-2xl group-hover:scale-110 transition-transform duration-300">
                  {deviceIcons[device]}
                </span>
                <span className="font-semibold text-lg group-hover:text-white transition-colors duration-300">
                  {deviceLabels[device] || device}
                </span>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-700">
          <button
            onClick={toggleDashboard}
            className={`w-full ${
              showDashboard
                ? "bg-gradient-to-r from-purple-600 to-blue-600"
                : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            } text-white font-semibold py-3 px-4 rounded-lg shadow-lg transition-all duration-300 flex items-center justify-center`}
          >
            {showDashboard ? "Hide Dashboard" : "Show Dashboard"}
          </button>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="flex-1 relative">
        <div
          id="game-wrapper"
          className="w-full h-full bg-gray-900 rounded-l-lg shadow-2xl border-l border-gray-700 relative overflow-hidden"
        >
          {!gameLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-400">
                  Loading Smart Home Simulation...
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Dashboard Panel */}
        {showDashboard && (
          <div className="fixed top-16 right-4 w-[1000px] h-[720px] bg-gradient-to-b from-gray-800 to-gray-900 shadow-2xl z-20 border-2 border-gray-600 rounded-[24px] flex flex-col overflow-hidden">
            <div className="sticky top-0 bg-gradient-to-r from-gray-800 to-gray-700 p-4 border-b border-gray-600 z-10 rounded-t-[24px]">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                    Power Dashboard
                  </h3>
                </div>
                <button
                  onClick={toggleDashboard}
                  className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors duration-200 shadow-lg"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <Dashboard 
                powerData={powerData} 
                deviceLabels={deviceLabels} 
                historicalData={historicalData} 
              />
            </div>
          </div>
        )}
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #2d3748;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4a5568;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #718096;
        }
      `}</style>
    </div>
  );
}

export default Metaverse;