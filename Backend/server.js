const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const analyticsRoutes = require("./routes/analytics");
const notesRoutes = require("./routes/notes");
const quoteRoutes = require("./routes/quoteRoutes");
const weatherRoutes = require("./routes/weather");
const focusRoutes = require("./routes/focus");
const newsRoute = require("./routes/news");

dotenv.config();
console.log("Loaded GNEWS_API_KEY:", process.env.GNEWS_API_KEY);

const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use("/api/auth", authRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/quotes", quoteRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/focus", focusRoutes);
app.use("/api/news", newsRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
