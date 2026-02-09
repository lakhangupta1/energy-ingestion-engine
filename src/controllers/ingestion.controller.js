const { meterSchema, vehicleSchema } = require('../validators/telemetry.validator');
const { processMeter } = require('../services/meter.service');
const { processVehicle } = require('../services/vehicle.service');

async function ingest(req, res) {
  const payload = req.body;

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
}

module.exports = { ingest };
