import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function MealScheduler() {
  const [preferences, setPreferences] = useState("");
  const [schedule, setSchedule] = useState(null);
  const [shoppingList, setShoppingList] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateSchedule = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "/api/smart-kitchen/meal-scheduler",
        { preferences },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSchedule(res.data.schedule);
      setShoppingList(res.data.shopping_list);
    } catch (err) {
      console.error(
        "Error generating meal schedule:",
        err.response?.data || err.message
      );
      setError(err.response?.data?.message || "Failed to generate meal plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="relative h-full bg-gradient-to-br from-yellow-700/20 to-orange-800/20 backdrop-blur-xl border border-white/10 hover:border-yellow-600/30 rounded-3xl p-6 overflow-hidden transition-all duration-500 group"
      whileHover={{
        boxShadow: "0px 8px 30px rgba(234, 179, 8, 0.2)",
      }}
    >
      {/* Glow Effect - Darker */}
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/15 to-orange-700/15 opacity-0 group-hover:opacity-100 rounded-3xl blur-xl transition-opacity duration-500"></div>

      {/* Decorative Elements */}
      <div className="absolute top-3 right-4 text-6xl opacity-5 group-hover:opacity-10 transition-opacity duration-500">
        📅
      </div>
      <div className="absolute bottom-3 left-4 text-6xl opacity-5 group-hover:opacity-10 transition-opacity duration-500">
        🛒
      </div>

      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center mb-4">
          <div className="p-2 bg-gradient-to-r from-yellow-600 to-orange-700 rounded-lg shadow-lg shadow-yellow-700/20 mr-3">
            <span className="text-white text-xl">📅</span>
          </div>
          <h2 className="text-xl font-semibold text-white">Meal Planner</h2>
        </div>

        {/* Input - Darker */}
        <input
          className="w-full p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10 text-white mb-4 outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent transition-all"
          placeholder="Enter preferences (e.g. vegetarian, low-carb, high protein)"
          value={preferences}
          onChange={(e) => setPreferences(e.target.value)}
          disabled={loading}
        />

        {/* Generate Button - Darker */}
        <motion.button
          onClick={generateSchedule}
          whileTap={{ scale: 0.97 }}
          disabled={loading || !preferences.trim()}
          className={`w-full py-3 rounded-lg font-semibold shadow-lg transition-all flex items-center justify-center ${
            loading || !preferences.trim()
              ? "bg-gray-700/30 cursor-not-allowed"
              : "bg-gradient-to-r from-yellow-600 to-orange-700 hover:shadow-yellow-700/20"
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Planning...
            </>
          ) : (
            <>
              <span className="mr-2">🛒</span>
              Generate Plan
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

        {/* Schedule Display - Darker */}
        {schedule && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-white/10 backdrop-blur-sm border border-white/10 rounded-lg text-gray-300 flex-1 overflow-auto"
          >
            <h3 className="text-lg font-semibold text-yellow-400 mb-3">
              Weekly Meal Plan
            </h3>

            <div className="space-y-4">
              {Object.entries(schedule).map(([day, meals]) => (
                <div
                  key={day}
                  className="bg-yellow-700/20 p-3 rounded-lg border border-yellow-700/30"
                >
                  <h4 className="font-semibold text-yellow-300 mb-2">{day}:</h4>
                  <div className="space-y-2">
                    {meals.map((m, idx) => (
                      <div key={idx} className="text-sm">
                        <p className="font-medium text-white">{m.meal}</p>
                        <p className="text-yellow-200/70 text-xs mt-1">
                          Ingredients: {m.ingredients.join(", ")}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {shoppingList && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-yellow-400 mb-3">
                  Shopping List
                </h3>
                <div className="bg-yellow-700/20 p-3 rounded-lg border border-yellow-700/30">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {Object.entries(shoppingList).map(([item, count]) => (
                      <div key={item} className="flex items-center">
                        <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                        <span className="text-white">{item}</span>
                        {count > 1 && (
                          <span className="ml-2 text-yellow-300 text-xs bg-yellow-600/30 px-2 py-1 rounded-full">
                            x{count}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
