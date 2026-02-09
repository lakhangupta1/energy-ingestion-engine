const pool = require('../config/db');

async function processVehicle(data) {
    
  // Use pool.query directly to reduce client checkout overhead.
  // If you require atomic multi-statement transactions, revert to using a
  // dedicated client via pool.connect() and BEGIN/COMMIT.
  try {
    await pool.query(
      `INSERT INTO vehicle_readings_history
       (vehicle_id, soc, kwh_delivered_dc, battery_temp, timestamp)
       VALUES ($1, $2, $3, $4, $5)`,
      [data.vehicleId, data.soc, data.kwhDeliveredDc, data.batteryTemp, data.timestamp]
    );

    await pool.query(
      `INSERT INTO vehicle_live_status
       (vehicle_id, soc, kwh_delivered_dc, battery_temp, timestamp)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (vehicle_id)
       DO UPDATE SET
         soc = EXCLUDED.soc,
         kwh_delivered_dc = EXCLUDED.kwh_delivered_dc,
         battery_temp = EXCLUDED.battery_temp,
         timestamp = EXCLUDED.timestamp`,
      [data.vehicleId, data.soc, data.kwhDeliveredDc, data.batteryTemp, data.timestamp]
    );

    return { success: true };
  } catch (err) {
    throw err;
  }
}

module.exports = { processVehicle };
