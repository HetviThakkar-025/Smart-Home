// server.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Check Mongo URI before connecting
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is missing in .env file");
  process.exit(1);
}

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => {
  console.error("❌ MongoDB connection error:", err);
  process.exit(1);
});

// Power Schema & Model
const powerSchema = new mongoose.Schema({
  device: String,
  state: String,
  powerUsage: Number,
  timestamp: { type: Date, default: Date.now }
});

const Power = mongoose.model("Power", powerSchema);

// Routes
app.post("/api/power", async (req, res) => {
  try {
    console.log("📥 Received power data:", req.body);
    const powerData = new Power(req.body);
    await powerData.save();
    res.status(200).json({ success: true, message: "Power data saved" });
  } catch (err) {
    console.error("❌ Error saving power data:", err);
    res.status(500).json({ success: false, message: "Server error saving power data" });
  }
});

// Test Route
app.get("/", (req, res) => {
  res.send("Smart Home Backend is running 🚀");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
