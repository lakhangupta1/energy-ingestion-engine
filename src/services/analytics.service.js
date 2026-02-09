const pool = require('../config/db');

async function getPerformance(vehicleId) {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

  try {
    const [vehicleResult, meterResult] = await Promise.all([
      pool.query(
        `SELECT 
            COALESCE(SUM(kwh_delivered_dc), 0) AS total_dc,
            COALESCE(AVG(battery_temp), 0) AS avg_temp
         FROM vehicle_readings_history
         WHERE vehicle_id = $1
         AND timestamp >= $2`,
        [vehicleId, since]
      ),
      pool.query(
        `SELECT 
            COALESCE(SUM(kwh_consumed_ac), 0) AS total_ac
         FROM meter_readings_history
         WHERE meter_id = $1
         AND timestamp >= $2`,
        [vehicleId, since]
      )
    ]);

    const totalDc = Number(vehicleResult.rows[0].total_dc);
    const totalAc = Number(meterResult.rows[0].total_ac);

    return {
      totalAc,
      totalDc,
      efficiency: totalAc ? totalDc / totalAc : 0,
      avgBatteryTemp: Number(vehicleResult.rows[0].avg_temp)
    };

  } catch (err) {
    console.error(" getPerformance DB error:", err.message);
    throw err;
  }
}

module.exports = { getPerformance };
