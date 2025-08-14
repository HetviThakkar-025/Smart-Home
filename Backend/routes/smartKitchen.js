const express = require("express");
const axios = require("axios");
const router = express.Router();
const authenticate = require("../middleware/authenticate");

// All Smart Kitchen routes require auth
router.use(authenticate);

// 1️⃣ AI Recipe Generator
router.post("/recipe-generator", async (req, res) => {
  try {
    const { ingredients } = req.body;

    const response = await axios.post(
      "http://localhost:8001/recipe-generator", // Python FastAPI endpoint
      { ingredients }
    );

    console.log(response.data.recipe);
    res.json({ recipe: response.data.recipe });
  } catch (error) {
    console.error("Error generating recipe:", error.message);
    res.status(500).json({ error: "Failed to generate recipe" });
  }
});

// 2️⃣ Nutrition Tracker
router.post("/nutrition", async (req, res) => {
  try {
    const { meal } = req.body;

    const response = await axios.post(
      "http://localhost:8001/nutrition", // Python FastAPI endpoint
      { meal }
    );

    console.log(response.data);
    res.json({ nutrition: response.data });
  } catch (error) {
    console.error("Error tracking nutrition:", error.message);
    res.status(500).json({ error: "Failed to track nutrition" });
  }
});

// 3️⃣ Meal Scheduler
router.post("/meal-scheduler", async (req, res) => {
  try {
    const { preferences = "vegetarian" } = req.body;

    const response = await axios.post(
      "http://localhost:8001/meal-schedule", // Python FastAPI endpoint
      { preferences, meals_per_day: 3 }
    );

    console.log("Meal schedule response:", response.data);
    res.json({
      schedule: response.data.schedule,
      shopping_list: response.data.shopping_list,
    });
  } catch (error) {
    console.error(
      "Error creating meal schedule:",
      error.message,
      error.response?.data
    );
    res.status(500).json({ error: "Failed to create meal schedule" });
  }
});

module.exports = router;
