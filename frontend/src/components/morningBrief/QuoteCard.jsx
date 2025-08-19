import React, { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

export default function QuoteCard() {
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");

  const fetchQuote = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/quotes");
      const data = await response.json();
      setQuote(data.quote);
      setAuthor(data.author);
    } catch (error) {
      console.error("Error fetching quote:", error);
      setQuote("Stay motivated and keep pushing forward!");
      setAuthor("Smart Assistant");
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col justify-between backdrop-blur-xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-white/10 hover:border-yellow-400/30 rounded-3xl p-6 overflow-hidden transition-all duration-500 group">
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 opacity-0 group-hover:opacity-100 rounded-3xl blur-xl transition-opacity duration-500"></div>

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center mb-4">
          <div className="p-2 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-lg shadow-lg shadow-yellow-500/20 mr-3">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-white">
            Motivational Quote
          </h2>
        </div>
        <p className="text-lg italic text-gray-200 line-clamp-4 group-hover:text-white transition-colors duration-300">
          "{quote}"
        </p>
      </div>

      {/* Author */}
      <div className="relative z-10 mt-4">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent mb-3"></div>
        <p className="text-sm text-gray-400 group-hover:text-yellow-200 transition-colors duration-300 text-right">
          — {author}
        </p>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-2 right-2 text-yellow-400/10 text-7xl font-serif select-none">
        "
      </div>
      <div className="absolute bottom-2 left-2 text-yellow-400/10 text-7xl font-serif select-none">
        "
      </div>
    </div>
  );
}
