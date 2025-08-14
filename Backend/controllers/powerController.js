const PowerData = require('../models/PowerData');

// @desc    Save power data
// @route   POST /api/power
// @access  Public

const getCurrentPowerState = async (req, res) => {
  try {
    const data = await PowerData.findOne().sort({ timestamp: -1 });
    res.status(200).json(data || {
      power: 0,
      energy: 0,
      cost: 0,
      peak: 0,
      devices: []
    });
  } catch (error) {
    console.error("Error fetching current state:", error);
    res.status(500).json({ error: "Failed to fetch current state" });
  }
};

const savePowerData = async (req, res) => {
  try {
    const { power, energy, cost, peak, devices } = req.body;
    
    const previous = await PowerData.findOne().sort({ timestamp: -1 });
    const baseEnergy = previous ? previous.energy : 0;
    const baseCost = previous ? previous.cost : 0;

    const newData = new PowerData({
      power,
      energy: baseEnergy + (energy || 0),
      cost: baseCost + (cost || 0),
      peak: Math.max(previous?.peak || 0, peak || 0),
      devices: Array.isArray(devices) ? devices : [],
      timestamp: new Date()
    });

    await newData.save();
    res.status(201).json(newData);
  } catch (error) {
    console.error("Save error:", error);
    res.status(500).json({ error: "Failed to save power data" });
  }
};

// @desc    Get power data history
// @route   GET /api/power/history
// @access  Public
const getPowerHistory = async (req, res) => {
  try {
    // Default to last 24 hours if no query params
    const hours = parseInt(req.query.hours) || 24;
    const limit = parseInt(req.query.limit) || 100;

    const data = await PowerData.aggregate([
      {
        $match: {
          timestamp: {
            $gte: new Date(Date.now() - hours * 60 * 60 * 1000),
          },
        },
      },
      {
        $sort: { timestamp: -1 },
      },
      {
        $limit: limit,
      },
      {
        $project: {
          _id: 0,
          power: 1,
          energy: 1,
          cost: 1,
          peak: 1,
          devices: 1,
          time: {
            $dateToString: {
              format: '%H:%M',
              date: '$timestamp',
              timezone: 'UTC',
            },
          },
          date: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$timestamp',
              timezone: 'UTC',
            },
          },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};

// @desc    Get aggregated power data for charts
// @route   GET /api/power/aggregated
// @access  Public
const getAggregatedData = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const interval = req.query.interval || 'hour'; // hour/day

    const groupStage = {
      $group: {
        _id: {
          [interval === 'hour' ? '$hour' : '$dayOfYear']: {
            $dateToString: {
              format: interval === 'hour' ? '%H:00' : '%Y-%m-%d',
              date: '$timestamp',
            },
          },
        },
        power: { $avg: '$power' },
        energy: { $sum: '$energy' },
        cost: { $sum: '$cost' },
        peak: { $max: '$peak' },
        time: { $first: '$timestamp' },
      },
    };

    const data = await PowerData.aggregate([
      {
        $match: {
          timestamp: {
            $gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
          },
        },
      },
      groupStage,
      {
        $sort: { time: 1 },
      },
      {
        $project: {
          _id: 0,
          time: '$_id',
          power: { $round: ['$power', 2] },
          energy: { $round: ['$energy', 2] },
          cost: { $round: ['$cost', 2] },
          peak: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};

module.exports = {
  savePowerData,
  getPowerHistory,
  getAggregatedData,
  getCurrentPowerState
};