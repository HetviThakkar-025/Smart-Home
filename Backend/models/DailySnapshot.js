const mongoose = require("mongoose");

const DailySnapshotSchema = new mongoose.Schema({
  userId: String,
  date: String, // e.g. '2025-07-18'
  totalEnergy: Number,
  peakPower: Number,
  roomBreakdown: { type: Map, of: Number }, // { Living: 2.3, Bedroom: 1.2 }
  topDevices: [{ type: String }], // ['AC', 'Light', 'Fan']
});

module.exports = mongoose.model("DailySnapshot", DailySnapshotSchema);
