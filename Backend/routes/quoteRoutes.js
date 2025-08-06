// routes/quotes.js

const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/", async (req, res) => {
  try {
    const response = await axios.get("https://zenquotes.io/api/random");
    const quoteData = response.data[0]; // response is an array

    res.json({
      quote: quoteData.q,
      author: quoteData.a,
    });
  } catch (err) {
    console.error("Quote fetch error:", err.message);
    res.status(500).json({ error: "Failed to fetch quote" });
  }
});

module.exports = router;
