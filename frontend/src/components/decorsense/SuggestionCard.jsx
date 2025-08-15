import React from "react";
import { motion } from "framer-motion";

export default function SuggestionCard({ detectedItems, suggestions }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden rounded-2xl p-[2px] shadow-xl bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500"
    >
      {/* Inner card */}
      <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 h-full">
        {/* Glow effect */}
        <div className="absolute -inset-1 blur-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 opacity-30 animate-pulse"></div>

        <div className="relative z-10">
          {/* Title */}
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 drop-shadow-md mb-4 flex items-center gap-2">
            ✨ AI Room Suggestions
          </h2>

          {/* Detected Items */}
          {detectedItems?.length > 0 && (
            <p className="text-gray-300 mb-5">
              <span className="font-semibold text-purple-300">
                🛋️ Detected Items:
              </span>{" "}
              {detectedItems.join(", ")}
            </p>
          )}

          {/* Suggestions List */}
          <ul className="list-disc list-inside space-y-3 text-gray-200">
            {suggestions?.map((s, i) => (
              <li
                key={i}
                className="pl-2 leading-relaxed hover:text-purple-300 transition-colors"
              >
                {typeof s === "string" ? s : s.detail}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
