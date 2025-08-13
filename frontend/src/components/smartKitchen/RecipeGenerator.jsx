import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function RecipeGenerator() {
  const [ingredients, setIngredients] = useState("");
  const [recipe, setRecipe] = useState(null);

  const generateRecipe = async () => {
    try {
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
    }
  };

  const isStringRecipe = typeof recipe === "string";

  return (
    <motion.div
      className="bg-[#131b2e] p-6 rounded-2xl shadow-lg border border-white/10 relative overflow-hidden min-h-[420px] flex flex-col"
      whileHover={{
        scale: 0.99,
        boxShadow: "0px 0px 20px rgba(255,165,0,0.5)",
      }}
      transition={{ duration: 0.25 }}
    >
      <div className="absolute top-3 right-4 text-6xl opacity-20">🍳</div>

      <h2 className="text-xl font-semibold text-orange-400 mb-4">
        🍳 AI Recipe Generator
      </h2>

      <input
        className="w-full p-3 rounded-lg bg-[#0f1424] text-white mb-3 outline-none focus:ring-2 focus:ring-orange-500"
        placeholder="Enter ingredients (comma separated)"
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
      />

      <motion.button
        onClick={generateRecipe}
        whileTap={{ scale: 0.97 }}
        className="w-full bg-gradient-to-r from-orange-500 to-red-500 py-2 rounded-lg font-semibold shadow-lg hover:shadow-orange-500/30 transition-all"
      >
        🍲 Generate Recipe
      </motion.button>

      {recipe && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-[#0f1424] rounded-lg text-gray-300 flex-1"
        >
          {isStringRecipe ? (
            <p className="text-red-400 font-semibold">{recipe}</p>
          ) : (
            <>
              <h3 className="text-lg font-semibold text-orange-300 mb-2">
                {recipe.title}
              </h3>
              <p className="text-sm text-gray-400 mb-1">
                <strong>Category:</strong> {recipe.category}
              </p>
              {recipe.image && (
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="rounded-lg my-2 w-full max-h-64 object-cover"
                />
              )}
              <h4 className="text-md font-semibold text-orange-400 mt-2">
                Ingredients:
              </h4>
              <ul className="list-disc pl-5 text-sm">
                {recipe.ingredients?.map((ing, idx) => (
                  <li key={idx}>{ing}</li>
                ))}
              </ul>
              <h4 className="text-md font-semibold text-orange-400 mt-2">
                Instructions:
              </h4>
              <p className="text-sm whitespace-pre-line">
                {recipe.instructions
                  ? recipe.instructions
                      .replace(/<\/?ol>/g, "") // remove <ol> tags
                      .replace(/<\/?li>/g, "\n") // replace <li> with new line
                      .trim()
                  : "No instructions provided."}
              </p>
            </>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
