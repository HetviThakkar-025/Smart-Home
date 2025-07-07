// pages/Meta1bhk.jsx
import React, { useEffect } from "react";

function Meta1bhk() {
  useEffect(() => {
    const iframe = document.createElement("iframe");
    iframe.src = "/src/game/room2.html"; // Make sure this file exists and loads your 1BHK Phaser map
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "none";
    iframe.style.display = "block";

    const container = document.getElementById("game-wrapper");
    container.innerHTML = "";
    container.appendChild(iframe);
  }, []);

  const sendDeviceToPhaser = (device) => {
    const iframe = document.querySelector("iframe");
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage({ type: "ADD_DEVICE", device }, "*");
    }
  };

  const deviceIcons = {
    tv: "📺",
    light: "💡",
    table: "🪑",
    fan: "🌀",
    carpet: "🧶",
    mirror: "🪞",
    chimney: "🔥",
    fridge: "🧊",
    bed: "🛏️",
    oven: "🔥",
    sofa: "🛋️",
    washingmachiene: "🧼"
  };

  return (
    <div className="flex h-screen mt-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-gray-800 to-gray-900 text-white p-6 shadow-2xl border-r border-gray-700">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Devices
          </h2>
          <div className="w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
        </div>

        {/* Buttons */}
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
                  Add {device.toUpperCase()}
                </span>
              </div>
              <div className="absolute inset-0 rounded-xl shadow-inner"></div>
            </button>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-700">
          <p className="text-sm text-gray-400 text-center">
            Click to add devices to the 1BHK layout
          </p>
        </div>
      </div>

      {/* Game Container */}
      <div className="flex-1 relative">
        <div
          id="game-wrapper"
          className="w-full h-full bg-gray-900 rounded-l-lg shadow-2xl border-l border-gray-700 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading 1BHK Metaverse...</p>
            </div>
          </div>
        </div>

        {/* Decorative Corners */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-bl-full"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-purple-500/10 to-transparent rounded-tl-full"></div>
      </div>
    </div>
  );
}

export default Meta1bhk;
