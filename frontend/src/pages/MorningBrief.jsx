import React from "react";
import QuoteCard from "../components/morningBrief/QuoteCard";
import WeatherCard from "../components/morningBrief/WeatherCard";
import FocusCard from "../components/morningBrief/FocusCard";
import NewsCard from "../components/morningBrief/NewsCard";
import CleanupTipCard from "../components/morningBrief/CleanupTipCard";
import { motion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 40 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 14,
      delay: i * 0.2,
    },
  }),
};

export default function MorningBrief() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden pt-24 pb-16">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-float animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-float animation-delay-4000"></div>
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
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 flex items-center justify-center text-2xl shadow-lg shadow-yellow-500/20">
              🌅
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-yellow-300 via-orange-300 to-yellow-300 bg-clip-text text-transparent">
              Morning Brief
            </h1>
          </div>
          <p className="text-xl text-white/70 font-light">
            Your personalized start to the day
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-orange-400 mx-auto mt-4 rounded-full"></div>
        </motion.div>

        {/* Section 1: Quote + Weather + Focus in one row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-center items-stretch mb-16">
          {[<QuoteCard />, <WeatherCard />, <FocusCard />].map((Card, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="min-w-[250px] h-80 flex flex-col justify-between"
            >
              <div className="relative h-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden">
                {/* Glow Effect */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${
                    i === 0
                      ? "from-yellow-400/20 to-orange-400/20"
                      : i === 1
                      ? "from-blue-400/20 to-cyan-400/20"
                      : "from-purple-400/20 to-pink-400/20"
                  } opacity-0 hover:opacity-100 rounded-3xl blur-xl transition-opacity duration-500`}
                ></div>
                {Card}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Section 2: News */}
        <motion.div
          className="flex justify-center mb-16"
          custom={3}
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="w-full max-w-5xl">
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 opacity-0 hover:opacity-100 rounded-3xl blur-xl transition-opacity duration-500"></div>
              {<NewsCard />}
            </div>
          </div>
        </motion.div>

        {/* Section 3: Eco Tips */}
        <motion.div
          className="flex justify-center"
          custom={4}
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="w-full max-w-5xl">
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-teal-400/20 opacity-0 hover:opacity-100 rounded-3xl blur-xl transition-opacity duration-500"></div>
              {<CleanupTipCard />}
            </div>
          </div>
        </motion.div>
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
        .animate-float {
          animation: float 8s ease-in-out infinite;
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
