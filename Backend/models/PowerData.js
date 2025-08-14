const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  name: String,
  power: Number,
  state: String,
  type: String,
});

const powerDataSchema = new mongoose.Schema(
  {
    power: {
      type: Number,
      required: true,
    },
    energy: {
      type: Number,
      required: true,
    },
    cost: {
      type: Number,
      required: true,
    },
    peak: {
      type: Number,
      required: true,
    },
    devices: [deviceSchema],
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster querying
powerDataSchema.index({ timestamp: 1 });

module.exports = mongoose.model('PowerData', powerDataSchema);