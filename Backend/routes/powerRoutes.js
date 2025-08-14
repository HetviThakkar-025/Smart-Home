const express = require('express');
const {
  savePowerData,
  getPowerHistory,
  getAggregatedData,
} = require('../controllers/powerController');

const router = express.Router();

router.post('/', savePowerData);
router.get('/history', getPowerHistory);
router.get('/aggregated', getAggregatedData);

module.exports = router;