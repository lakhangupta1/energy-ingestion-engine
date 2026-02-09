const express = require('express');
const router = express.Router();
const { performance } = require('../controllers/analytics.controller');

router.get('/performance/:vehicleId', performance);

module.exports = router;
