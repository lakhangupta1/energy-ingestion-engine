const { getPerformance } = require('../services/analytics.service');

async function performance(req, res) {
  const { vehicleId } = req.params;

  const data = await getPerformance(vehicleId);
  res.json(data);
}

module.exports = { performance };
