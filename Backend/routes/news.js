const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/", async (req, res) => {
  const apiKey = process.env.GNEWS_API_KEY;

  if (!apiKey) {
    console.error("GNEWS_API_KEY is not set in environment variables.");
    return res.status(500).json({ error: "GNEWS_API_KEY not configured" });
  }

  try {
    const response = await axios.get("https://gnews.io/api/v4/top-headlines", {
      params: {
        apikey: apiKey,
        lang: "en",
        max: 5,
        country: "in",
      },
    });

    res.status(200).json({ articles: response.data.articles });
  } catch (error) {
    console.error("GNews API Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch news" });
  }
});

module.exports = router;
