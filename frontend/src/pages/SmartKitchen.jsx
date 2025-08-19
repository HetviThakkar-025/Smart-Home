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
      transition: {
        delay: i * 0.15,
        duration: 0.5,
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    }),
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-24 pb-16 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-to-r from-pink-500/10 to-red-500/10 rounded-full blur-3xl animate-float animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-full blur-3xl animate-float animation-delay-4000"></div>
      </div>

      {/* Kitchen Icons Background */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute top-20 left-10 text-8xl animate-bounce animation-delay-100">
          🍳
        </div>
        <div className="absolute bottom-20 right-10 text-8xl animate-bounce animation-delay-300">
          🥗
        </div>
        <div className="absolute top-1/2 left-1/3 text-7xl animate-bounce animation-delay-500">
          🥖
        </div>
        <div className="absolute top-1/4 right-1/4 text-6xl animate-bounce animation-delay-700">
          🍎
        </div>
        <div className="absolute bottom-1/3 left-1/5 text-7xl animate-bounce animation-delay-900">
          🥘
        </div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      <div className="relative z-10 px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-orange-500/30">
              🥘
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
              AI Smart Kitchen
            </h1>
          </div>
          <p className="text-xl text-white/70 font-light max-w-2xl mx-auto">
            Your personal chef, nutritionist, and meal planner — powered by AI
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-pink-400 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                boxShadow: "0px 8px 30px rgba(239, 68, 68, 0.3)",
              }}
              whileTap={{ scale: 0.98 }}
              className="rounded-3xl"
            >
              <div className="relative h-full bg-white/5 backdrop-blur-xl border border-white/10 hover:border-orange-400/30 rounded-3xl overflow-hidden transition-all duration-500">
                {/* Glow Effect */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${
                    i === 0
                      ? "from-orange-400/20 to-red-400/20"
                      : i === 1
                      ? "from-green-400/20 to-teal-400/20"
                      : "from-purple-400/20 to-pink-400/20"
                  } opacity-0 hover:opacity-100 rounded-3xl blur-xl transition-opacity duration-500`}
                ></div>
                {Component}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Custom animations */}
      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
          100% {
            transform: translateY(0) rotate(0deg);
          }
        }
        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animate-bounce {
          animation: bounce 3s ease-in-out infinite;
        }
        .animation-delay-100 {
          animation-delay: 0.1s;
        }
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
        .animation-delay-500 {
          animation-delay: 0.5s;
        }
        .animation-delay-700 {
          animation-delay: 0.7s;
        }
        .animation-delay-900 {
          animation-delay: 0.9s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
