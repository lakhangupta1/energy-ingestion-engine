const pool = require('../config/db');

async function getPerformance(vehicleId) {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const vehicleResult = await pool.query(
    `SELECT 
        SUM(kwh_delivered_dc) AS total_dc,
        AVG(battery_temp) AS avg_temp
     FROM vehicle_readings_history
     WHERE vehicle_id = $1
     AND timestamp >= $2`,
    [vehicleId, since]
  );

  const meterResult = await pool.query(
    `SELECT 
        SUM(kwh_consumed_ac) AS total_ac
     FROM meter_readings_history
     WHERE meter_id = $1
     AND timestamp >= $2`,
    [vehicleId, since]
  );

  const totalDc = Number(vehicleResult.rows[0].total_dc || 0);
  const totalAc = Number(meterResult.rows[0].total_ac || 0);

  return {
    totalAc,
    totalDc,
    efficiency: totalAc ? totalDc / totalAc : 0,
    avgBatteryTemp: Number(vehicleResult.rows[0].avg_temp || 0)
  };
}

module.exports = { getPerformance };
