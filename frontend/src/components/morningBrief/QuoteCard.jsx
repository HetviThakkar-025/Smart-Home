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
    <div className="w-full h-[250px] max-w-md flex flex-col justify-between backdrop-blur-lg bg-white/5 border border-white/10 hover:scale-[1.03] transition-transform duration-300 ease-out rounded-2xl shadow-2xl p-6 overflow-hidden">
      <div>
        <div className="flex items-center mb-3">
          <Sparkles className="text-yellow-400 mr-2" />
          <h2 className="text-xl font-semibold">Motivational Quote</h2>
        </div>
        <p className="text-lg italic text-gray-200 line-clamp-4">"{quote}"</p>
      </div>
      <p className="mt-4 text-sm text-gray-400 text-right">— {author}</p>
    </div>
  );
}
