import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import SuggestionCard from "../components/decorsense/SuggestionCard";
import { Loader2, Upload, Sparkles } from "lucide-react";

export default function DecorSense() {
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [mode, setMode] = useState("mood");
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
      formData.append("roomImage", imageFile);
      formData.append("mode", mode);

      const res = await fetch("/api/decorsense/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setDetectedItems(data.detectedItems || []);
        setSuggestions(data.suggestions || []);

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
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-24 pb-16 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-float animation-delay-2000"></div>
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

      {/* Floating Icons */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-16 left-8 text-8xl animate-bounce animation-delay-100">
          🛋️
        </div>
        <div className="absolute bottom-24 right-10 text-8xl animate-bounce animation-delay-300">
          🪴
        </div>
        <div className="absolute top-1/2 left-1/4 text-7xl animate-bounce animation-delay-500">
          🖼️
        </div>
        <div className="absolute bottom-40 left-1/3 text-6xl animate-bounce animation-delay-700">
          🛏️
        </div>
      </div>

      <div className="relative z-10 px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-purple-500/30">
              🏠
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              DecorSense
            </h1>
          </div>
          <p className="text-xl text-white/70 font-light mb-6">
            Upload your space, choose a mode, get AI-powered style suggestions
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-blue-400 mx-auto rounded-full"></div>
        </motion.div>

        {/* Mode Selector */}
        <div className="flex justify-center gap-4 mb-8">
          {["mood", "budget", "eco"].map((m) => (
            <motion.button
              key={m}
              onClick={() => setMode(m)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-3 rounded-full font-medium capitalize border transition-all ${
                mode === m
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/30 border-transparent"
                  : "bg-white/5 backdrop-blur-sm border-white/10 text-gray-300 hover:text-white hover:bg-white/10"
              }`}
            >
              {m} mode
            </motion.button>
          ))}
        </div>

        {/* Upload Zone */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-xl relative group"
        >
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 to-blue-400/10 opacity-0 group-hover:opacity-100 rounded-3xl blur-xl transition-opacity duration-500"></div>

          <label className="w-full block cursor-pointer relative z-10">
            <div className="border-2 border-dashed border-white/20 rounded-2xl p-8 hover:border-purple-400/50 transition-all duration-300 text-center group">
              {image ? (
                <div className="relative">
                  <img
                    src={image}
                    alt="Uploaded room"
                    className="mx-auto rounded-lg max-h-80 object-cover border border-white/10 shadow-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              ) : (
                <div className="py-12">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-300 text-lg">
                    Click to upload your room photo
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    Supports JPG, PNG, WEBP
                  </p>
                </div>
              )}
            </div>
            <input
              type="file"
              className="hidden"
              onChange={handleImageUpload}
              accept="image/*"
            />
          </label>

          <div className="flex justify-center mt-6 relative z-30">
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                handleAnalyze();
              }}
              disabled={loading || !imageFile}
              whileHover={{ scale: loading || !imageFile ? 1 : 1.05 }}
              whileTap={{ scale: loading || !imageFile ? 1 : 0.95 }}
              className={`px-8 py-3 rounded-lg font-semibold shadow-lg transition-all flex items-center gap-2 relative z-30 ${
                loading || !imageFile
                  ? "bg-gray-700/30 cursor-not-allowed opacity-70"
                  : "bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-purple-500/30 cursor-pointer"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Analyze Room
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Suggestions Section */}
        {suggestions.length > 0 && (
          <div ref={suggestionRef} className="max-w-4xl mx-auto mt-16">
            <SuggestionCard
              detectedItems={detectedItems}
              suggestions={suggestions}
            />
          </div>
        )}
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
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}
