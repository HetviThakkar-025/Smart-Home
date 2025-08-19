import React, { useEffect, useState } from "react";
import { Newspaper, ExternalLink } from "lucide-react";
import axios from "axios";

export default function NewsCard() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/news")
      .then((res) => {
        setArticles(res.data.articles.slice(0, 5));
        setLoading(false);
      })
      .catch((err) => {
        console.error("News fetch error:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="relative backdrop-blur-xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-white/10 hover:border-purple-400/30 rounded-3xl p-6 transition-all duration-500 group overflow-hidden">
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 rounded-3xl blur-xl transition-opacity duration-500"></div>

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center mb-4">
          <div className="p-2 bg-gradient-to-br from-purple-400 to-blue-400 rounded-lg shadow-lg shadow-purple-500/20 mr-3">
            <Newspaper className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-white">Today's News</h2>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center">
                <div className="w-2 h-2 bg-purple-400/30 rounded-full mr-3"></div>
                <div
                  className="h-4 bg-white/10 rounded-full animate-pulse"
                  style={{ width: `${Math.random() * 200 + 100}px` }}
                ></div>
              </div>
            ))}
          </div>
        ) : articles.length > 0 ? (
          <ul className="space-y-3">
            {articles.map((article, idx) => (
              <li key={idx} className="flex items-start">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/90 hover:text-white group-hover:text-white/90 transition-colors duration-300 flex-1"
                >
                  <div className="flex items-start justify-between">
                    <span className="hover:underline">{article.title}</span>
                    <ExternalLink className="w-4 h-4 ml-2 text-purple-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0" />
                  </div>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-6 text-gray-400">
            <p>No news articles available</p>
            <p className="text-sm mt-1">Try refreshing later</p>
          </div>
        )}
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-4 right-4 text-purple-400/10 text-6xl select-none">
        {"✍️"}
      </div>
    </div>
  );
}
