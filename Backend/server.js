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
const petCareRoutes = require("./routes/petCare");
const smartKitchenRoutes = require("./routes/smartKitchen");
const powerRoutes = require('./routes/powerRoutes');
const errorHandler = require('./middleware/errorHandler');
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smart-home';

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ MongoDB connected');
  app.listen(5000, () => console.log('🚀 Server running on port 5000'));
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

app.use("/api/auth", authRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/quotes", quoteRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/focus", focusRoutes);
app.use("/api/news", newsRoute);
app.use('/api/power', powerRoutes);
app.use("/api/petcare", petCareRoutes);
app.use("/api/smart-kitchen", smartKitchenRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
