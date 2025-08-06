import React, { useEffect, useState } from "react";
import { Newspaper } from "lucide-react";
import axios from "axios";

export default function NewsCard() {
  const [articles, setArticles] = useState([]);
  useEffect(() => {
    axios
      .get("/api/news")
      .then((res) => setArticles(res.data.articles.slice(0, 5))) // FIXED LINE
      .catch((err) => console.error("News fetch error:", err));
  }, []);

  return (
    <div className="backdrop-blur-lg bg-white/5 border border-white/10 hover:scale-[1.03] transition-transform duration-300 ease-out rounded-2xl shadow-2xl p-6">
      <div className="flex items-center mb-3">
        <Newspaper className="text-green-400 mr-2" />
        <h2 className="text-xl font-semibold">Today's News</h2>
      </div>
      <ul className="list-disc list-inside text-gray-200 space-y-1">
        {articles.map((article, idx) => (
          <li key={idx}>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-300 hover:underline"
            >
              {article.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
