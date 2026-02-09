const pool = require('../config/db');

async function processMeter(data) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1️⃣ Insert into history (append-only)
    await client.query(
      `INSERT INTO meter_readings_history
       (meter_id, kwh_consumed_ac, voltage, timestamp)
       VALUES ($1, $2, $3, $4)`,
      [data.meterId, data.kwhConsumedAc, data.voltage, data.timestamp]
    );

    // 2️⃣ Upsert live table
    await client.query(
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

    await client.query('COMMIT');
    return { success: true };

  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

module.exports = { processMeter };
