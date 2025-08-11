const mongoose = require("mongoose");

const FeedingLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  time: { type: String, required: true },
  food: { type: String, required: true },
  notes: { type: String },
});

module.exports = mongoose.model("FeedingLog", FeedingLogSchema);
