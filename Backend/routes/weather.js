const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/", async (req, res) => {
  const city = "Ahmedabad"; // You can make this dynamic later
  const apiKey = process.env.OPENWEATHER_API_KEY;

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );

    const data = response.data;

    res.json({
      temp: data.main.temp,
      humidity: data.main.humidity,
      condition: data.weather[0].main,
      city: data.name,
      country: data.sys.country,
    });
  } catch (error) {
    console.error("Weather fetch error:", error.message);
    res.status(500).json({ error: "Failed to fetch weather" });
  }
});

module.exports = router;
