const express = require("express");
const router = express.Router();
const Note = require("../models/Note");
const authenticate = require("../middleware/authenticate"); // if auth required

router.get("/", authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    const urgentNotes = await Note.find({
      user: userId,
      urgency: "urgent",
    }).sort({ createdAt: -1 });

    if (!urgentNotes.length) {
      return res.status(200).json({ message: "No urgent notes." });
    }

    res.status(200).json({ notes: urgentNotes });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch focus notes" });
  }
});

module.exports = router;
