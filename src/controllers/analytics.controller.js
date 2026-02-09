const { getPerformance } = require('../services/analytics.service');

async function performance(req, res) {
  const { vehicleId } = req.params;

  try {
    const data = await getPerformance(vehicleId);
    res.json(data);
  } catch (err) {
    console.error('Analytics performance error:', err);
    const body = { error: 'Internal server error' };
    // if (process.env.NODE_ENV !== 'production') body.details = err.message;
    res.status(500).json(body);
  }
}

module.exports = { performance };
