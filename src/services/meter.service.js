const pool = require('../config/db');

async function processMeter(data) {
  // Use pool.query directly to avoid checking out/releasing a client each call.
  // We run the two statements sequentially; if you need strict atomicity,
  // keep the transaction-based approach (uses client.connect()).
  try {
    // 1) Insert into history (append-only)
    await pool.query(
      `INSERT INTO meter_readings_history
       (meter_id, kwh_consumed_ac, voltage, timestamp)
       VALUES ($1, $2, $3, $4)`,
      [data.meterId, data.kwhConsumedAc, data.voltage, data.timestamp]
    );

    // 2) Upsert live table
    await pool.query(
      `INSERT INTO meter_live_status
       (meter_id, kwh_consumed_ac, voltage, timestamp)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (meter_id)
       DO UPDATE SET
         kwh_consumed_ac = EXCLUDED.kwh_consumed_ac,
         voltage = EXCLUDED.voltage,
         timestamp = EXCLUDED.timestamp`,
      [data.meterId, data.kwhConsumedAc, data.voltage, data.timestamp]
    );

    return { success: true };
  } catch (err) {
    throw err;
  }
}

module.exports = { processMeter };
