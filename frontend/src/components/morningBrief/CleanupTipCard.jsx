import React from "react";
import {
  Leaf,
  Lightbulb,
  PlugZap,
  ThermometerSun,
  Droplet,
} from "lucide-react";

export default function CleanupTipCard() {
  return (
    <div className="bg-white/5 text-white p-6 rounded-2xl shadow-lg border border-white/10 space-y-6 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <Leaf className="text-green-400" size={26} />
        <h2 className="text-xl font-semibold">Eco-Friendly Tips</h2>
      </div>

      <div className="space-y-4 text-sm md:text-base text-gray-300">
        <div className="flex gap-2 items-start">
          <Lightbulb className="text-yellow-400 mt-1" size={20} />
          <span>
            Turn off devices and unplug chargers when not in use — even in
            standby mode, they consume energy.
          </span>
        </div>

        <div className="flex gap-2 items-start">
          <PlugZap className="text-blue-400 mt-1" size={20} />
          <span>
            Use smart plugs to schedule appliance shutdowns and reduce phantom
            loads.
          </span>
        </div>

        <div className="flex gap-2 items-start">
          <ThermometerSun className="text-red-400 mt-1" size={20} />
          <span>
            Raise your thermostat by 1–2°C in summer or lower it in winter to
            cut down on energy usage.
          </span>
        </div>

        <div className="flex gap-2 items-start">
          <Droplet className="text-cyan-300 mt-1" size={20} />
          <span>
            Fix leaking faucets – one drip per second can waste over 3,000
            gallons per year!
          </span>
        </div>
      </div>
    </div>
  );
}
