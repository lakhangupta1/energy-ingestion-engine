const express = require('express');
const ingestionRoutes = require('./routes/ingestion.routes');
const analyticsRoutes = require('./routes/analytics.routes');

const app = express();
app.use(express.json());

app.use('/v1/ingest', ingestionRoutes);
app.use('/v1/analytics', analyticsRoutes);

module.exports = app;
