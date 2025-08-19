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
    <div className="relative bg-gradient-to-br from-green-500/10 to-teal-500/10 border border-white/10 hover:border-green-400/30 rounded-3xl p-6 backdrop-blur-xl transition-all duration-500 group overflow-hidden">
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-teal-400/20 opacity-0 group-hover:opacity-100 rounded-3xl blur-xl transition-opacity duration-500"></div>

      {/* Content */}
      <div className="relative z-10 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-green-400 to-teal-400 rounded-lg shadow-lg shadow-green-500/20">
            <Leaf className="text-white" size={20} />
          </div>
          <h2 className="text-xl font-semibold text-white">
            Eco-Friendly Tips
          </h2>
        </div>

        <div className="space-y-4 text-sm md:text-base">
          <div className="flex gap-3 items-start group">
            <div className="p-1.5 bg-yellow-400/20 rounded-lg mt-0.5 group-hover:bg-yellow-400/30 transition-colors">
              <Lightbulb className="text-yellow-400" size={18} />
            </div>
            <span className="text-gray-300 group-hover:text-white transition-colors">
              Turn off devices and unplug chargers when not in use — even in
              standby mode, they consume energy.
            </span>
          </div>

          <div className="flex gap-3 items-start group">
            <div className="p-1.5 bg-blue-400/20 rounded-lg mt-0.5 group-hover:bg-blue-400/30 transition-colors">
              <PlugZap className="text-blue-400" size={18} />
            </div>
            <span className="text-gray-300 group-hover:text-white transition-colors">
              Use smart plugs to schedule appliance shutdowns and reduce phantom
              loads.
            </span>
          </div>

          <div className="flex gap-3 items-start group">
            <div className="p-1.5 bg-red-400/20 rounded-lg mt-0.5 group-hover:bg-red-400/30 transition-colors">
              <ThermometerSun className="text-red-400" size={18} />
            </div>
            <span className="text-gray-300 group-hover:text-white transition-colors">
              Raise your thermostat by 1–2°C in summer or lower it in winter to
              cut down on energy usage.
            </span>
          </div>

          <div className="flex gap-3 items-start group">
            <div className="p-1.5 bg-cyan-400/20 rounded-lg mt-0.5 group-hover:bg-cyan-400/30 transition-colors">
              <Droplet className="text-cyan-300" size={18} />
            </div>
            <span className="text-gray-300 group-hover:text-white transition-colors">
              Fix leaking faucets – one drip per second can waste over 3,000
              gallons per year!
            </span>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
        <Leaf className="w-16 h-16 text-green-400" />
      </div>
    </div>
  );
}
