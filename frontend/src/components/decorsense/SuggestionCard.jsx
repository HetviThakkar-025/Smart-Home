import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Home, Lightbulb } from "lucide-react";

export default function SuggestionCard({ detectedItems, suggestions }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden rounded-3xl group"
    >
      {/* Gradient Border */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl p-[2px] shadow-2xl"></div>

      {/* Inner card */}
      <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-2xl rounded-3xl p-8 h-full border border-white/10">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 rounded-3xl blur-xl transition-opacity duration-500"></div>

        <div className="relative z-10">
          {/* Title */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg shadow-lg shadow-purple-500/20">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              AI Room Suggestions
            </h2>
          </div>

          {/* Detected Items */}
          {detectedItems?.length > 0 && (
            <div className="mb-6 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Home className="w-5 h-5 text-purple-400" />
                <span className="font-semibold text-purple-300">
                  Detected in your space:
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {detectedItems.map((item, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-sm border border-purple-500/30 backdrop-blur-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Suggestions List */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-5 h-5 text-yellow-400" />
              <h3 className="font-semibold text-white">Suggestions:</h3>
            </div>

            <ul className="space-y-3">
              {suggestions?.map((s, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-3 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300 group-hover-item"
                >
                  <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-200 group-hover-item:text-white transition-colors">
                    {typeof s === "string" ? s : s.detail}
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-4 right-4 text-purple-400/10 group-hover:text-purple-400/20 transition-colors">
          <Sparkles className="w-12 h-12" />
        </div>
      </div>
    </motion.div>
  );
}
