const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Customization = require("../models/Customization");

const router = express.Router();

// Create uploads folder if not exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({ storage });

router.post(
  "/api/customization",
  upload.array("designImages"),
  async (req, res) => {
    try {
      const {
        username,
        houseType,
        appliances,
        customAppliances,
        tileDesign,
        tileColor,
        wallColor,
        floorMaterial,
        lightingType,
      } = req.body;

      const newCustomization = new Customization({
        username,
        houseType,
        appliances: JSON.parse(appliances || "[]"),
        customAppliances: JSON.parse(customAppliances || "[]"),
        tileDesign,
        tileColor,
        wallColor,
        floorMaterial,
        lightingType,
        designImagePaths: req.files.map((file) => `/uploads/${file.filename}`),
      });

      await newCustomization.save();
      res.status(201).json({ message: "Customization saved successfully" });
    } catch (error) {
      console.error("Error saving customization:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }
);

module.exports = router;
