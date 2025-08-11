// backend/routes/petcare.js
const express = require("express");
const axios = require("axios");
const router = express.Router();
const FeedingLog = require("../models/FeedingLog");
const authenticate = require("../middleware/authenticate");

router.use(authenticate);

// GET logs for logged-in user
router.get("/", async (req, res) => {
  try {
    const logs = await FeedingLog.find({ userId: req.user.id }).sort({
      _id: -1,
    });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch logs" });
  }
});

// ADD log
router.post("/", async (req, res) => {
  try {
    const { time, food, notes } = req.body;
    const newLog = new FeedingLog({
      userId: req.user.id, // coming from auth middleware
      time,
      food,
      notes,
    });
    await newLog.save();
    res.status(201).json({ message: "Feeding log added", log: newLog });
  } catch (err) {
    res.status(500).json({ error: "Failed to save log" });
  }
});

// DELETE log
router.delete("/:id", async (req, res) => {
  try {
    await FeedingLog.deleteOne({ _id: req.params.id, userId: req.user.id });
    res.json({ message: "Log deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete log" });
  }
});

module.exports = router;

// -----------------------------
// Pet Comfort Prediction
// -----------------------------
// router.post("/predict-comfort", async (req, res) => {
//   try {
//     const { temperature, humidity, feeding_interval, activity_level } =
//       req.body;

//     const response = await axios.post(
//       "http://localhost:8001/predict_pet_comfort",
//       {
//         temperature,
//         humidity,
//         feeding_interval,
//         activity_level,
//       }
//     );

//     res.json({
//       comfort_level: response.data.comfort_level,
//     });
//   } catch (error) {
//     console.error("Error predicting pet comfort:", error.message);
//     res.status(500).json({ error: "Failed to predict comfort" });
//   }
// });

router.post("/predict-comfort", authenticate, async (req, res) => {
  try {
    const { temperature, humidity, feeding_interval, activity_level } =
      req.body;

    const response = await axios.post(
      "http://localhost:8001/predict_pet_comfort", // Python FastAPI
      { temperature, humidity, feeding_interval, activity_level }
    );

    res.json({ comfort_level: response.data.comfort_level });
  } catch (error) {
    console.error("Error predicting pet comfort:", error.message);
    res.status(500).json({ error: "Failed to predict comfort" });
  }
});

module.exports = router;
