import React, { useState, useEffect } from 'react';

function Dashboard() {
  const [powerData, setPowerData] = useState(() => {
    // Try to load from localStorage first
    const cachedData = localStorage.getItem('dashboardData');
    if (cachedData) {
      return JSON.parse(cachedData);
    }
    
    // Default empty state
    return {
      power: 0,
      energy: 0,
      cost: 0,
      peak: 0,
      lastUpdate: 'Loading...',
      isInitialData: false
    };
  });

  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type === "POWER_UPDATE") {
        setIsConnected(true);
        
        const newData = {
          power: event.data.payload.power,
          energy: parseFloat(event.data.payload.energy.toFixed(2)),
          cost: parseFloat(event.data.payload.cost.toFixed(2)),
          peak: event.data.payload.peak,
          lastUpdate: event.data.payload.lastUpdate || new Date().toLocaleTimeString(),
          isInitialData: event.data.payload.isInitialData || false
        };

        setPowerData(newData);
        localStorage.setItem('dashboardData', JSON.stringify(newData));
      }
    };

    window.addEventListener('message', handleMessage);

    // Check for new day
    const checkNewDay = () => {
      const today = new Date().toDateString();
      const lastUpdateDate = localStorage.getItem('lastDashboardUpdateDate');
      
      if (lastUpdateDate !== today) {
        localStorage.setItem('lastDashboardUpdateDate', today);
        localStorage.removeItem('dashboardData');
        setPowerData({
          power: 0,
          energy: 0,
          cost: 0,
          peak: 0,
          lastUpdate: 'New day started',
          isInitialData: true
        });
        
        if (window.gameScene) {
          window.gameScene.dailyEnergy = 0;
          window.gameScene.dailyCost = 0;
          window.gameScene.peakPower = 0;
          window.gameScene.sendToDashboard();
        }
      }
    };

    checkNewDay();

    // Request initial data if game is loaded
    if (window.gameScene) {
      window.gameScene.sendInitialData();
    } else {
      // If game isn't loaded yet, set up a listener
      const gameLoadListener = () => {
        if (window.gameScene) {
          window.gameScene.sendInitialData();
          window.removeEventListener('gameLoaded', gameLoadListener);
        }
      };
      window.addEventListener('gameLoaded', gameLoadListener);
    }

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const getPowerColor = (watts) => {
    if (watts > 1000) return 'text-red-500';
    if (watts > 500) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getEnergyColor = (wh) => {
    if (wh > 5000) return 'text-red-400';
    if (wh > 2000) return 'text-yellow-400';
    return 'text-green-400';
  };

  const resetDashboard = () => {
    if (window.gameScene) {
      window.gameScene.dailyEnergy = 0;
      window.gameScene.dailyCost = 0;
      window.gameScene.peakPower = 0;
      window.gameScene.sendToDashboard();
    }
    setPowerData({
      power: 0,
      energy: 0,
      cost: 0,
      peak: 0,
      lastUpdate: 'Manually reset',
      isInitialData: true
    });
    localStorage.removeItem('dashboardData');
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">🏠 Smart Home Dashboard</h1>
          <button 
            onClick={resetDashboard}
            className="text-xs bg-red-600 hover:bg-red-700 px-2 py-1 rounded"
            title="Reset daily stats"
          >
            Reset
          </button>
        </div>

        {!isConnected && !powerData.isInitialData ? (
          <div className="text-center py-4 text-yellow-400">
            Connecting to devices...
          </div>
        ) : (
          <>
            <div className={`text-4xl font-bold mb-2 ${getPowerColor(powerData.power)}`}>
              {powerData.power} <span className="text-xl">W</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 my-4">
              <div className={`bg-gray-700 p-3 rounded-lg ${getEnergyColor(powerData.energy)}`}>
                <div className="text-gray-400 text-sm">Today's Usage</div>
                <div className="text-xl">{powerData.energy.toFixed(2)} Wh</div>
              </div>
              <div className="bg-gray-700 p-3 rounded-lg">
                <div className="text-gray-400 text-sm">Cost</div>
                <div className="text-xl">${powerData.cost.toFixed(2)}</div>
              </div>
            </div>
            
            <div className="bg-gray-700 p-3 rounded-lg mb-4">
              <div className="text-gray-400 text-sm">Peak Power Today</div>
              <div className="text-xl">{powerData.peak} W</div>
            </div>
            
            <div className="text-xs text-gray-400">
              Updated: {powerData.lastUpdate}
              {!isConnected && powerData.isInitialData && (
                <span className="text-yellow-400 ml-2">(Using cached data)</span>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;