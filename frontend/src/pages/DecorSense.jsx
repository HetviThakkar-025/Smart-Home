// src/pages/assistant/DecorSense.jsx
import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import SuggestionCard from "../components/decorsense/SuggestionCard";

export default function DecorSense() {
  const [image, setImage] = useState(null); // preview URL
  const [imageFile, setImageFile] = useState(null); // actual file object
  const [mode, setMode] = useState("mood"); // default mode
  const [detectedItems, setDetectedItems] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const suggestionRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setImageFile(file);
    }
  };

  const handleAnalyze = async () => {
    if (!imageFile) {
      alert("Please upload an image first");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("roomImage", imageFile); // multer field name
      formData.append("mode", mode); // pass selected mode to backend
      console.log(formData);

      const res = await fetch("/api/decorsense/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setDetectedItems(data.detectedItems || []);
        setSuggestions(data.suggestions || []);

        // Auto-scroll to suggestions
        setTimeout(() => {
          suggestionRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 200);
      } else {
        alert("AI analysis failed");
      }
    } catch (err) {
      console.error("Analyze error:", err);
      alert("Server error");
    }
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Floating background icons */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-16 left-8 text-8xl">🛋️</div>
        <div className="absolute bottom-24 right-10 text-8xl">🪴</div>
        <div className="absolute top-1/2 left-1/4 text-7xl">🖼️</div>
        <div className="absolute bottom-40 left-1/3 text-6xl">🛏️</div>
      </div>

      {/* Header */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-5xl font-extrabold text-center mt-20 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 drop-shadow-lg"
      >
        🏠 DecorSense
      </motion.h1>
      <p className="text-center font-bold text-gray-400 mb-10 mt-5 text-lg">
        ✨ Upload your space, choose a mode, get AI-powered style suggestions 🌟
      </p>

      {/* Mode Selector */}
      <div className="flex justify-center gap-4 mb-8">
        {["mood", "budget", "eco"].map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-5 py-2 rounded-full font-medium capitalize border ${
              mode === m
                ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg border-transparent"
                : "bg-slate-800/60 border-gray-600 hover:bg-slate-700"
            } transition`}
          >
            {m} mode
          </button>
        ))}
      </div>

      {/* Upload Zone */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-xl relative"
      >
        <label className="w-full block cursor-pointer">
          <div className="border-2 border-dashed border-gray-500 rounded-xl p-6 hover:border-purple-400 transition text-center">
            {image ? (
              <img
                src={image}
                alt="Uploaded room"
                className="mx-auto rounded-lg max-h-80 object-cover"
              />
            ) : (
              <p className="text-gray-300">
                📷 Click to upload your room photo
              </p>
            )}
          </div>
          <input
            type="file"
            className="hidden"
            onChange={handleImageUpload}
            accept="image/*"
          />
        </label>
        <div className="flex justify-center mt-6">
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="px-8 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold shadow-lg hover:scale-105 transition"
          >
            {loading ? "Analyzing..." : "Analyze Room"}
          </button>
        </div>
      </motion.div>

      {/* Suggestions Section */}
      {suggestions.length > 0 && (
        <div ref={suggestionRef} className="max-w-3xl mx-auto mt-12">
          <SuggestionCard
            detectedItems={detectedItems}
            suggestions={suggestions}
          />
        </div>
      )}
    </div>
  );
}
