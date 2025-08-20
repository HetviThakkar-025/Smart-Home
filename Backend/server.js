const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path=require('path')
const customizationRoutes = require('./routes/customization');
const authRoutes = require("./routes/authRoutes");
const analyticsRoutes = require("./routes/analytics");  
const notesRoutes = require("./routes/notes");
const quoteRoutes = require("./routes/quoteRoutes");
const weatherRoutes = require("./routes/weather");
const focusRoutes = require("./routes/focus");
const newsRoute = require("./routes/news");
const petCareRoutes = require("./routes/petCare");
const smartKitchenRoutes = require("./routes/smartKitchen");
const powerRoutes = require("./routes/powerRoutes");
const errorHandler = require("./middleware/errorHandler");
const decorsenseRoutes = require("./routes/decorsense");
const Customization = require('./models/Customization');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(customizationRoutes);

// Static middleware to serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Check Mongo URI before connecting
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is missing in .env file");
  process.exit(1);
}

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// Power Schema & Model
const powerSchema = new mongoose.Schema({
  device: String,
  state: String,
  powerUsage: Number,
  timestamp: { type: Date, default: Date.now },
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
    res
      .status(500)
      .json({ success: false, message: "Server error saving power data" });
  }
});

// Test Route
app.get("/", (req, res) => {
  res.send("Smart Home Backend is running 🚀");
});

app.post('/api/customization', async (req, res) => {
  try {
    const data = req.body;
    const customization = new Customization(data);
    await customization.save();
    res.status(200).json({ message: 'Customization saved!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save customization', details: err });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/quotes", quoteRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/focus", focusRoutes);
app.use("/api/news", newsRoute);
app.use("/api/power", powerRoutes);
app.use("/api/power", powerRoutes);
app.use("/api/petcare", petCareRoutes);
app.use("/api/smart-kitchen", smartKitchenRoutes);
app.use("/api/decorsense", decorsenseRoutes);
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
