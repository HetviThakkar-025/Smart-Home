import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function MealScheduler() {
  const [preferences, setPreferences] = useState("");
  const [schedule, setSchedule] = useState(null);

  const generateSchedule = async () => {
    try {
      const res = await axios.post("/api/smart-kitchen/meal-schedule", {
        preferences,
      });
      setSchedule(res.data.schedule);
    } catch (err) {
      console.error("Error generating meal schedule:", err);
    }
  };

  return (
    <motion.div
      className="bg-[#131b2e] p-6 rounded-2xl shadow-lg border border-white/10 relative overflow-hidden min-h-[420px] flex flex-col"
      whileHover={{
        scale: 0.99,
        boxShadow: "0px 0px 20px rgba(250,204,21,0.5)",
      }}
      transition={{ duration: 0.25 }}
    >
      {/* Decorative emoji */}
      <div className="absolute top-3 right-4 text-6xl opacity-20">📅</div>

      <h2 className="text-xl font-semibold text-yellow-400 mb-4">
        📅 AI Meal Scheduling & Shopping Planner
      </h2>

      <input
        className="w-full p-3 rounded-lg bg-[#0f1424] text-white mb-3 outline-none focus:ring-2 focus:ring-yellow-500"
        placeholder="Enter preferences e.g. vegetarian, low-carb, high protein..."
        value={preferences}
        onChange={(e) => setPreferences(e.target.value)}
      />

      <motion.button
        onClick={generateSchedule}
        whileTap={{ scale: 0.97 }}
        className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 py-2 rounded-lg font-semibold shadow-lg hover:shadow-yellow-500/30 transition-all"
      >
        🛒 Generate Plan
      </motion.button>

      {schedule && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-[#0f1424] rounded-lg text-gray-300 flex-1"
        >
          <h3 className="text-lg font-semibold text-yellow-300 mb-2">
            Your AI Meal Plan:
          </h3>
          <pre className="whitespace-pre-wrap">{schedule}</pre>
        </motion.div>
      )}
    </motion.div>
  );
}
