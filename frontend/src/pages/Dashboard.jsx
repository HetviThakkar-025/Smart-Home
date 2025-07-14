import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [powerData, setPowerData] = useState({
    power: 0,
    energy: 0,
    cost: 0,
    peak: 0,
    minuteCost: 0,
    lastUpdate: 'Never',
    devices: [],
    deviceCounts: {},
    activeDevices: {}
  });

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type === "POWER_UPDATE") {
        setPowerData(event.data.payload);
        
        // Optional: Send data to backend
        fetch('/api/power', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(event.data.payload),
        });
      }
    };

    window.addEventListener('message', handleMessage);
    
    // Load initial data if available
    const savedData = localStorage.getItem('powerData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setPowerData(prev => ({
          ...prev,
          energy: parsedData.energy || 0,
          cost: parsedData.cost || 0,
          peak: parsedData.peak || 0,
          deviceCounts: parsedData.devices?.counts || {},
          activeDevices: parsedData.devices?.active || {}
        }));
      } catch (e) {
        console.error("Error loading saved data:", e);
      }
    }

    // Fetch historical data
    const fetchHistoricalData = async () => {
      try {
        const response = await fetch('/api/power');
        const data = await response.json();
        console.log('Historical data:', data);
      } catch (error) {
        console.error('Error fetching historical data:', error);
      }
    };

    fetchHistoricalData();

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <div className="flex flex-col h-full p-4 bg-gray-50">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Energy Dashboard</h1>
      
      {/* Real-time Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-600 font-medium mb-2">Current Power</h3>
          <p className={`text-3xl font-bold ${
            powerData.power > 1000 ? 'text-red-500' : 
            powerData.power > 500 ? 'text-yellow-500' : 'text-green-500'
          }`}>
            {powerData.power} W
          </p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-600 font-medium mb-2">Minute Cost</h3>
          <p className="text-3xl font-bold text-purple-500">
            ${powerData.minuteCost.toFixed(4)}
          </p>
        </div>
      </div>

      {/* Daily Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-600 font-medium mb-2">Today's Energy</h3>
          <p className="text-2xl font-bold text-blue-500">
            {powerData.energy.toFixed(2)} Wh
          </p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-600 font-medium mb-2">Today's Cost</h3>
          <p className="text-2xl font-bold text-green-500">
            ${powerData.cost.toFixed(2)}
          </p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-600 font-medium mb-2">Peak Power</h3>
          <p className="text-2xl font-bold text-orange-500">
            {powerData.peak} W
          </p>
        </div>
      </div>

      {/* Device Status */}
      <div className="bg-white rounded-lg shadow p-4 mb-4 flex-1 overflow-y-auto">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Device Status</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Power</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {powerData.devices.map((device, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                    {device.name}
                  </td>
                  <td className={`px-4 py-2 whitespace-nowrap text-sm font-medium ${
                    device.state === 'ON' ? 'text-green-600' :
                    device.state === 'OFF' ? 'text-red-600' : 'text-yellow-600'
                  }`}>
                    {device.state}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                    {device.power} W
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Device Counts */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Device Inventory</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Object.entries(powerData.deviceCounts)
            .filter(([_, count]) => count > 0)
            .map(([device, count]) => (
              <div key={device} className="bg-gray-50 p-3 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {device.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    (powerData.activeDevices[device] || 0) > 0 ? 
                    'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {powerData.activeDevices[device] || 0}/{count} active
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="mt-4 text-right text-sm text-gray-500">
        Last updated: {powerData.lastUpdate}
      </div>
    </div>
  );
}