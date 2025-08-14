import React from "react";
import { motion } from "framer-motion";
import RecipeGenerator from "../components/smartKitchen/RecipeGenerator";
import NutritionTracker from "../components/smartKitchen/NutritionTracker";
import MealScheduler from "../components/smartKitchen/MealScheduler";

export default function SmartKitchen() {
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, duration: 0.5 },
    }),
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-12 px-6 overflow-hidden">
      {/* Floating background kitchen icons */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="absolute top-20 left-10 text-8xl">🍳</div>
        <div className="absolute bottom-20 right-10 text-8xl">🥗</div>
        <div className="absolute top-1/2 left-1/3 text-7xl">🥖</div>
      </div>

      <h1 className="text-4xl mt-7 md:text-5xl font-extrabold text-center mb-3 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 drop-shadow-lg">
        🍳 AI Smart Kitchen
      </h1>
      <p className="text-center font-bold text-gray-400 max-w-2xl mx-auto mb-12">
        👩‍🍳 Your personal chef, nutritionist, and meal planner — powered by AI 👨‍🍳
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        {[
          <RecipeGenerator key="recipe" />,
          <NutritionTracker key="nutrition" />,
          <MealScheduler key="meal" />,
        ].map((Component, i) => (
          <motion.div
            key={i}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 8px 20px rgba(255,165,0,0.4)",
            }}
            whileTap={{ scale: 0.98 }}
            className="rounded-2xl"
          >
            {Component}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
