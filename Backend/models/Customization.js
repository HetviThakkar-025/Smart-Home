const mongoose = require("mongoose");

const CustomizationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  houseType: { type: String, enum: ["1BHK", "2BHK", "3BHK"], required: true },
  appliances: [{ type: String }],
  customAppliances: [
    {
      name: String,
      watt: Number,
    },
  ],
  tileDesign: String,
  tileColor: String,
  wallColor: String,
  floorMaterial: String,
  lightingType: String,
  designImagePaths: [String],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Customization", CustomizationSchema);
