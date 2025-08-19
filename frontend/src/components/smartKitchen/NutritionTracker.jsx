import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function NutritionTracker() {
  const [meal, setMeal] = useState("");
  const [nutrition, setNutrition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const trackNutrition = async () => {
    try {
      setLoading(true);
      setError(null);
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

      setNutrition(res.data.nutrition.nutrition);
    } catch (err) {
      console.error(
        "Error tracking nutrition:",
        err.response?.data || err.message
      );
      setError(err.response?.data?.message || "Failed to analyze nutrition");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="relative h-full bg-gradient-to-br from-green-700/20 to-teal-800/20 backdrop-blur-xl border border-white/10 hover:border-green-600/30 rounded-3xl p-6 overflow-hidden transition-all duration-500 group"
      whileHover={{
        boxShadow: "0px 8px 30px rgba(34, 197, 94, 0.2)",
      }}
    >
      {/* Glow Effect - Darker */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-600/15 to-teal-700/15 opacity-0 group-hover:opacity-100 rounded-3xl blur-xl transition-opacity duration-500"></div>

      {/* Decorative Elements */}
      <div className="absolute top-3 right-4 text-6xl opacity-5 group-hover:opacity-10 transition-opacity duration-500">
        🥗
      </div>
      <div className="absolute bottom-3 left-4 text-6xl opacity-5 group-hover:opacity-10 transition-opacity duration-500">
        🥦
      </div>

      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center mb-4">
          <div className="p-2 bg-gradient-to-r from-green-600 to-teal-700 rounded-lg shadow-lg shadow-green-700/20 mr-3">
            <span className="text-white text-xl">🥗</span>
          </div>
          <h2 className="text-xl font-semibold text-white">
            Nutrition Tracker
          </h2>
        </div>

        {/* Input - Darker */}
        <input
          className="w-full p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10 text-white mb-4 outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all"
          placeholder="Enter meal details (e.g. garden salad)"
          value={meal}
          onChange={(e) => setMeal(e.target.value)}
          disabled={loading}
        />

        {/* Analyze Button - Darker */}
        <motion.button
          onClick={trackNutrition}
          whileTap={{ scale: 0.97 }}
          disabled={loading || !meal.trim()}
          className={`w-full py-3 rounded-lg font-semibold shadow-lg transition-all flex items-center justify-center ${
            loading || !meal.trim()
              ? "bg-gray-700/30 cursor-not-allowed"
              : "bg-gradient-to-r from-green-600 to-teal-700 hover:shadow-green-700/20"
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <span className="mr-2">🥦</span>
              Analyze Nutrition
            </>
          )}
        </motion.button>

        {/* Error Message - Darker */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 bg-red-700/20 border border-red-700/30 rounded-lg text-red-300 text-sm"
          >
            {error}
          </motion.div>
        )}

        {/* Nutrition Display - Darker */}
        {nutrition && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-white/10 backdrop-blur-sm border border-white/10 rounded-lg text-gray-300 flex-1 overflow-y-auto"
          >
            <h3 className="text-lg font-semibold text-green-400 mb-3">
              Nutrition Breakdown
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-800/70  p-3 rounded-lg border border-green-700/30">
                <p className="text-sm text-green-300 mb-1">Calories</p>
                <p className="text-xl font-bold text-white">
                  {nutrition.calories} kcal
                </p>
              </div>

              <div className="bg-green-800/70  p-3 rounded-lg border border-green-700/30">
                <p className="text-sm text-green-300 mb-1">Protein</p>
                <p className="text-xl font-bold text-white">
                  {nutrition.protein_g} g
                </p>
              </div>

              <div className="bg-green-800/70 p-3 rounded-lg border border-green-700/30">
                <p className="text-sm text-green-300 mb-1">Carbohydrates</p>
                <p className="text-xl font-bold text-white">
                  {nutrition.carbs_g} g
                </p>
              </div>

              <div className="bg-green-800/70  p-3 rounded-lg border border-green-700/30">
                <p className="text-sm text-green-300 mb-1">Fat</p>
                <p className="text-xl font-bold text-white">
                  {nutrition.fat_g} g
                </p>
              </div>
            </div>

            <div className="mt-4 bg-green-800/70  p-3 rounded-lg border border-green-700/30">
              <p className="text-sm text-green-300 mb-1">Fiber</p>
              <p className="text-xl font-bold text-white">
                {nutrition.fiber_g} g
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
