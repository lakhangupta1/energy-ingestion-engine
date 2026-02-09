const { meterSchema, vehicleSchema } = require('../validators/telemetry.validator');
const { processMeter } = require('../services/meter.service');
const { processVehicle } = require('../services/vehicle.service');

async function ingest(req, res) {
  const payload = req.body;

  try {
    if (payload.meterId) {
      const { error } = meterSchema.validate(payload);
      if (error) return res.status(400).json({ error: error.message });

      await processMeter(payload);
      return res.json({ status: 'Meter processed' });
    }

    if (payload.vehicleId) {
      const { error } = vehicleSchema.validate(payload);
      if (error) return res.status(400).json({ error: error.message });

      await processVehicle(payload);
      return res.json({ status: 'Vehicle processed' });
    }

    return res.status(400).json({ error: 'Invalid telemetry type' });
  } catch (err) {
    console.error('Ingest handler error:', err);
    const body = { error: 'Internal server error' };
    if (process.env.NODE_ENV !== 'production') body.details = err.message;
    return res.status(500).json(body);
  }
}

module.exports = { ingest };
