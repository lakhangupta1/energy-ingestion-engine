const pool = require('../config/db');

async function processVehicle(data) {
  let client;

  try {
    //  Try to connect
    client = await pool.connect();
    console.log(" Database connected successfully");

  } catch (connectionError) {
    console.error("Database connection failed:", connectionError.message);
    throw connectionError;
  }

  const timestamp = data.timestamp || new Date();

  try {
    await client.query('BEGIN');

    await client.query(
      `INSERT INTO vehicle_readings_history
       (vehicle_id, soc, kwh_delivered_dc, battery_temp, timestamp)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        data.vehicleId,
        data.soc,
        data.kwhDeliveredDc,
        data.batteryTemp,
        timestamp
      ]
    );

    await client.query(
      `INSERT INTO vehicle_live_status
       (vehicle_id, soc, kwh_delivered_dc, battery_temp, timestamp)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (vehicle_id)
       DO UPDATE SET
         soc = EXCLUDED.soc,
         kwh_delivered_dc = EXCLUDED.kwh_delivered_dc,
         battery_temp = EXCLUDED.battery_temp,
         timestamp = EXCLUDED.timestamp`,
      [
        data.vehicleId,
        data.soc,
        data.kwhDeliveredDc,
        data.batteryTemp,
        timestamp
      ]
    );

    await client.query('COMMIT');
    return { success: true };

  } catch (err) {
    await client.query('ROLLBACK');
    console.error(" Transaction failed:", err.message);
    throw err;

  } finally {
    if (client) client.release();
  }
}

module.exports = { processVehicle };
