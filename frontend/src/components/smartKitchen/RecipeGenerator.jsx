import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function RecipeGenerator() {
  const [ingredients, setIngredients] = useState("");
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateRecipe = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "/api/smart-kitchen/recipe-generator",
        { ingredients },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRecipe(res.data.recipe);
    } catch (err) {
      console.error(
        "Error generating recipe:",
        err.response?.data || err.message
      );
      setError(err.response?.data?.message || "Failed to generate recipe");
    } finally {
      setLoading(false);
    }
  };

  const isStringRecipe = typeof recipe === "string";

  return (
    <motion.div
      className="relative h-full bg-gradient-to-br from-orange-700/20 to-red-800/20 backdrop-blur-xl border border-white/10 hover:border-orange-600/30 rounded-3xl p-6 overflow-hidden transition-all duration-500 group"
      whileHover={{
        boxShadow: "0px 8px 30px rgba(239, 68, 68, 0.2)",
      }}
    >
      {/* Glow Effect - Darker */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-600/15 to-red-700/15 opacity-0 group-hover:opacity-100 rounded-3xl blur-xl transition-opacity duration-500"></div>

      {/* Decorative Elements */}
      <div className="absolute top-3 right-4 text-6xl opacity-5 group-hover:opacity-10 transition-opacity duration-500">
        🍳
      </div>
      <div className="absolute bottom-3 left-4 text-6xl opacity-5 group-hover:opacity-10 transition-opacity duration-500">
        🧑‍🍳
      </div>

      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center mb-4">
          <div className="p-2 bg-gradient-to-r from-orange-600 to-red-700 rounded-lg shadow-lg shadow-orange-700/20 mr-3">
            <span className="text-white text-xl">🍳</span>
          </div>
          <h2 className="text-xl font-semibold text-white">
            AI Recipe Generator
          </h2>
        </div>

        {/* Input - Darker */}
        <input
          className="w-full p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10 text-white mb-4 outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent transition-all"
          placeholder="Enter ingredients (comma separated)"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          disabled={loading}
        />

        {/* Generate Button - Darker */}
        <motion.button
          onClick={generateRecipe}
          whileTap={{ scale: 0.97 }}
          disabled={loading || !ingredients.trim()}
          className={`w-full py-3 rounded-lg font-semibold shadow-lg transition-all flex items-center justify-center ${
            loading || !ingredients.trim()
              ? "bg-gray-700/30 cursor-not-allowed"
              : "bg-gradient-to-r from-orange-600 to-red-700 hover:shadow-orange-700/20"
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <span className="mr-2">🍲</span>
              Generate Recipe
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

        {/* Recipe Display - Darker */}
        {recipe && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-white/10 backdrop-blur-sm border border-white/10 rounded-lg text-gray-300 flex-1 overflow-y-auto"
          >
            {isStringRecipe ? (
              <p className="text-red-400 font-semibold">{recipe}</p>
            ) : (
              <>
                <h3 className="text-lg font-semibold text-orange-400 mb-2">
                  {recipe.title}
                </h3>
                <p className="text-sm text-gray-400 mb-3">
                  <span className="bg-orange-600/20 text-orange-300 px-2 py-1 rounded-full text-xs">
                    {recipe.category}
                  </span>
                </p>
                {recipe.image && (
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="rounded-lg my-2 w-full max-h-48 object-cover border border-white/10"
                  />
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <h4 className="text-md font-semibold text-orange-500 mb-2 flex items-center">
                      <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                      Ingredients:
                    </h4>
                    <ul className="space-y-1 text-sm">
                      {recipe.ingredients?.map((ing, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-orange-500 mr-2">•</span>
                          <span>{ing}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-md font-semibold text-orange-500 mb-2 flex items-center">
                      <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                      Instructions:
                    </h4>
                    <div className="text-sm whitespace-pre-line bg-white/10 p-3 rounded-lg border border-white/10">
                      {recipe.instructions
                        ? recipe.instructions
                            .replace(/<\/?ol>/g, "")
                            .replace(/<\/?li>/g, "\n")
                            .trim()
                        : "No instructions provided."}
                    </div>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
