const mongoose = require('mongoose');

const CustomizationSchema = new mongoose.Schema({
  username: { type: String, required: true },
  houseType: { type: String, enum: ['1BHK', '2BHK', '3BHK'], required: true },
  appliances: [{ type: String }],
  customAppliances: [
    {
      name: String,
      watt: Number
    }
  ],
  tileDesign: String,
  tileColor: String,
  wallColor: String,
  floorMaterial: String,
  lightingType: String,
  designImagePaths: [String], // We'll store image URLs or paths here
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Customization', CustomizationSchema);
