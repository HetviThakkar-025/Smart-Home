const express = require("express");
const router = express.Router();
const Note = require("../models/Note");
const axios = require("axios"); // to call FastAPI

// ✅ Create note
router.post("/", async (req, res) => {
  try {
    const { userId, content } = req.body;
    // call FastAPI to get urgency
    const response = await axios.post("http://localhost:8000/predict_urgency", {
      text: content,
    });
    const urgency = response.data.urgency;

    const newNote = new Note({ user: userId, content, urgency });
    console.log(newNote);
    await newNote.save();
    res.json(newNote);
  } catch (err) {
    res.status(500).json({ error: "Failed to create note" });
  }
});

// ✅ Get all notes of a user
router.get("/:userId", async (req, res) => {
  try {
    const notes = await Note.find({ user: req.params.userId }).sort({
      createdAt: -1,
    });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch notes" });
  }
});

// ✅ Delete note
router.delete("/:id", async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: "Note deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete note" });
  }
});

module.exports = router;
