// routes/decorsense.js
const express = require("express");
const multer = require("multer");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const FormData = require("form-data");

const router = express.Router();

// Multer setup - store file in memory
const upload = multer({ storage: multer.memoryStorage() });

router.post("/analyze", upload.single("roomImage"), async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, error: "No file uploaded" });
    }

    const colabEndpoint =
      process.env.COLAB_API_URL ||
      "https://25965c4b71c4.ngrok-free.app/analyze";

    const formData = new FormData();
    formData.append("file", req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });
    formData.append("mode", req.body.mode || "mood");
    console.log(formData);

    // Send to Colab
    const colabRes = await fetch(colabEndpoint, {
      method: "POST",
      body: formData,
    });

    if (!colabRes.ok) {
      throw new Error(`Colab API error: ${colabRes.statusText}`);
    }

    const colabData = await colabRes.json();

    // Transform suggestions into UI-friendly shape
    const formattedSuggestions = (colabData.suggestions || []).map(
      (text, i) => ({
        title: `💡 Suggestion ${i + 1}`,
        detail: text,
      })
    );

    console.log(colabData.detected_items);
    console.log(formattedSuggestions);
    res.json({
      success: true,
      detectedItems: colabData.detected_items || [],
      suggestions: formattedSuggestions,
    });
  } catch (err) {
    console.error("Error in DecorSense:", err);
    res.status(500).json({ success: false, error: "AI processing failed" });
  }
});

module.exports = router;
