const express = require("express");
const router = express.Router();
const DailySnapshot = require("../models/DailySnapshot");

// GET /api/analytics/usage-history?userId=xxx
router.get("/usage-history", async (req, res) => {
  const { userId } = req.query;
  const last7days = await DailySnapshot.find({ userId })
    .sort({ date: -1 })
    .limit(7)
    .lean();
  res.json(last7days.reverse());
});

// GET /api/analytics/top-devices?userId=xxx
router.get("/top-devices", async (req, res) => {
  const { userId } = req.query;
  const data = await DailySnapshot.find({ userId }).sort({ date: -1 }).limit(7);
  const counts = {};
  data.forEach((day) => {
    day.topDevices.forEach((dev) => {
      counts[dev] = (counts[dev] || 0) + 1;
    });
  });
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  res.json(sorted.slice(0, 5));
});

// GET /api/analytics/room-breakdown?userId=xxx
router.get("/room-breakdown", async (req, res) => {
  const { userId } = req.query;
  const latest = await DailySnapshot.findOne({ userId })
    .sort({ date: -1 })
    .lean();
  res.json(latest?.roomBreakdown || {});
});

// GET /api/analytics/peak-hours?userId=xxx
router.get("/peak-hours", async (req, res) => {
  // Mock data for now, replace later with real hourly logs
  res.json([
    { hour: "00:00", power: 30 },
    { hour: "06:00", power: 60 },
    { hour: "12:00", power: 80 },
    { hour: "18:00", power: 200 }, // peak
    { hour: "21:00", power: 150 },
  ]);
});

module.exports = router;
