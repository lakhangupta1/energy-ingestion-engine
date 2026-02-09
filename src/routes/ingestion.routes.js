const express = require('express');
const router = express.Router();
const { ingest } = require('../controllers/ingestion.controller');

router.post('/', ingest);

module.exports = router;
