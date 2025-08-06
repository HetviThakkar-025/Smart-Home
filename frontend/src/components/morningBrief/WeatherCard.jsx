import React, { useEffect, useState } from "react";
import { CloudSun } from "lucide-react";

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
    <div className="w-full h-[250px] max-w-md flex flex-col justify-between backdrop-blur-lg bg-white/5 border border-white/10 hover:scale-[1.03] transition-transform duration-300 ease-out rounded-2xl shadow-2xl p-6 overflow-hidden">
      <div className="flex items-center mb-3">
        <CloudSun className="text-sky-400 mr-2" />
        <h2 className="text-xl font-semibold">Today's Weather</h2>
      </div>

      {error && <p className="text-red-400">{error}</p>}

      {weather ? (
        <>
          <p className="text-2xl font-bold text-white">{weather.temp}°C</p>
          <p className="text-md text-gray-300">
            {weather.condition} · Humidity: {weather.humidity}%
          </p>
          <p className="text-sm text-gray-400 mt-1">
            {weather.city}, {weather.country}
          </p>
        </>
      ) : (
        !error && <p className="text-gray-300">Loading...</p>
      )}
    </div>
  );
}
