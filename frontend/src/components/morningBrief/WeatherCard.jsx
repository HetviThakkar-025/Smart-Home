import React, { useEffect, useState } from "react";
import { CloudSun, Droplets, Thermometer, MapPin } from "lucide-react";

export default function WeatherCard() {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/weather")
      .then((res) => res.json())
      .then((data) => setWeather(data))
      .catch((err) => {
        console.error("Error fetching weather:", err);
        setError("Failed to fetch weather.");
      });
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col justify-between backdrop-blur-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-white/10 hover:border-blue-400/30 rounded-3xl p-6 overflow-hidden transition-all duration-500 group">
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 opacity-0 group-hover:opacity-100 rounded-3xl blur-xl transition-opacity duration-500"></div>

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center mb-4">
          <div className="p-2 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg shadow-lg shadow-blue-500/20 mr-3">
            <CloudSun className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-white">Today's Weather</h2>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {weather ? (
          <div className="space-y-4">
            <div className="flex items-center">
              <Thermometer className="w-5 h-5 text-blue-300 mr-2" />
              <p className="text-3xl font-bold text-white">
                {weather.temp}°C
                <span className="text-lg text-blue-200 ml-2">
                  {weather.condition}
                </span>
              </p>
            </div>

            <div className="flex items-center">
              <Droplets className="w-5 h-5 text-blue-300 mr-2" />
              <p className="text-md text-gray-300 group-hover:text-white transition-colors">
                Humidity: {weather.humidity}%
              </p>
            </div>

            <div className="flex items-center">
              <MapPin className="w-5 h-5 text-blue-300 mr-2" />
              <p className="text-sm text-gray-400 group-hover:text-blue-200 transition-colors">
                {weather.city}, {weather.country}
              </p>
            </div>
          </div>
        ) : (
          !error && (
            <div className="flex items-center justify-center h-20">
              <div className="animate-pulse text-gray-400">
                Loading weather...
              </div>
            </div>
          )
        )}
      </div>

      {/* Weather icon decoration */}
      {weather && (
        <div className="absolute bottom-4 right-4 text-blue-400/20 text-6xl select-none">
          {weather.condition.includes("Rain")
            ? "🌧️"
            : weather.condition.includes("Cloud")
            ? "☁️"
            : weather.condition.includes("Sun")
            ? "☀️"
            : "🌤️"}
        </div>
      )}
    </div>
  );
}
