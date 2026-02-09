const express = require('express');
const ingestionRoutes = require('./routes/ingestion.routes');
const analyticsRoutes = require('./routes/analytics.routes');

const app = express();
app.use(express.json());

app.use('/v1/ingest', ingestionRoutes);
app.use('/v1/analytics', analyticsRoutes);

// Global error handler
app.use((err, req, res, next) => {
	console.error('Unhandled error:', err);
	const body = { error: 'Internal server error' };
	if (process.env.NODE_ENV !== 'production') body.details = err.message;
	res.status(500).json(body);
});

module.exports = app;
