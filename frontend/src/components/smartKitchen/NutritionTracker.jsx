import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function NutritionTracker() {
  const [meal, setMeal] = useState("");
  const [nutrition, setNutrition] = useState(null);

  const trackNutrition = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "/api/smart-kitchen/nutrition",
        { meal },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNutrition(res.data.nutrition);
    } catch (err) {
      console.error(
        "Error tracking nutrition:",
        err.response?.data || err.message
      );
    }
  };

  return (
    <motion.div
      className="bg-[#131b2e] p-6 rounded-2xl shadow-lg border border-white/10 relative overflow-hidden min-h-[420px] flex flex-col"
      whileHover={{
        scale: 0.99,
        boxShadow: "0px 0px 20px rgba(34,197,94,0.5)",
      }}
      transition={{ duration: 0.25 }}
    >
      {/* Decorative emoji */}
      <div className="absolute top-3 right-4 text-6xl opacity-20">🥗</div>

      <h2 className="text-xl font-semibold text-green-400 mb-4">
        🥗 Nutritional & Dietary Goal Tracking
      </h2>

      <input
        className="w-full p-3 rounded-lg bg-[#0f1424] text-white mb-3 outline-none focus:ring-2 focus:ring-green-500"
        placeholder="Enter meal details e.g. garden salad..."
        value={meal}
        onChange={(e) => setMeal(e.target.value)}
      />

      <motion.button
        onClick={trackNutrition}
        whileTap={{ scale: 0.97 }}
        className="w-full bg-gradient-to-r from-green-500 to-teal-500 py-2 rounded-lg font-semibold shadow-lg hover:shadow-green-500/30 transition-all"
      >
        🥦 Analyze Nutrition
      </motion.button>

      {nutrition && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-[#0f1424] rounded-lg text-gray-300 flex-1"
        >
          <h3 className="text-lg font-semibold text-green-300 mb-2">
            Nutrition Breakdown:
          </h3>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>
              <strong>Calories:</strong> {nutrition.calories} kcal
            </li>
            <li>
              <strong>Protein:</strong> {nutrition.protein_g} g
            </li>
            <li>
              <strong>Carbs:</strong> {nutrition.carbs_g} g
            </li>
            <li>
              <strong>Fat:</strong> {nutrition.fat_g} g
            </li>
            <li>
              <strong>Fiber:</strong> {nutrition.fiber_g} g
            </li>
          </ul>
        </motion.div>
      )}
    </motion.div>
  );
}
