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
    <div className="min-h-screen bg-gradient-to-br from-[#1e293b] to-[#0f172a] text-white px-4 py-20 md:px-16 lg:px-24 space-y-18">
      {/* Header */}
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl font-bold flex justify-center items-center gap-3 mt-3">
          <span>🌅</span> Smart Morning Brief
        </h1>
      </motion.div>

      {/* Section 1: Quote + Weather + Focus in one row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-center items-stretch mt-4">
        {[<QuoteCard />, <WeatherCard />, <FocusCard />].map((Card, i) => (
          <motion.div
            key={i}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="min-w-[250px] h-72 flex flex-col justify-between"
          >
            {Card}
          </motion.div>
        ))}
      </div>

      {/* Section 2: News */}
      <motion.div
        className="flex justify-center mt-10"
        custom={3}
        variants={cardVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="w-full max-w-5xl">{<NewsCard />}</div>
      </motion.div>

      {/* Section 3: Eco Tips */}
      <motion.div
        className="flex justify-center mt-6"
        custom={4}
        variants={cardVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="w-full max-w-5xl">{<CleanupTipCard />}</div>
      </motion.div>
    </div>
  );
}
