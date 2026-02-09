const app = require('./app');
const pool = require('./config/db');

const PORT = 3000;

async function startServer() {
  try {
    // Check DB connection
    await pool.query('SELECT 1');
    console.log(' Database connected');

    // Auto create tables if not exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS meter_readings_history (
        id BIGSERIAL PRIMARY KEY,
        meter_id VARCHAR NOT NULL,
        kwh_consumed_ac FLOAT NOT NULL,
        voltage FLOAT NOT NULL,
        timestamp TIMESTAMPTZ NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS vehicle_readings_history (
        id BIGSERIAL PRIMARY KEY,
        vehicle_id VARCHAR NOT NULL,
        soc FLOAT NOT NULL,
        kwh_delivered_dc FLOAT NOT NULL,
        battery_temp FLOAT NOT NULL,
        timestamp TIMESTAMPTZ NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS meter_live_status (
        meter_id VARCHAR PRIMARY KEY,
        kwh_consumed_ac FLOAT,
        voltage FLOAT,
        timestamp TIMESTAMPTZ
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS vehicle_live_status (
        vehicle_id VARCHAR PRIMARY KEY,
        soc FLOAT,
        kwh_delivered_dc FLOAT,
        battery_temp FLOAT,
        timestamp TIMESTAMPTZ
      );
    `);

    console.log(" Tables verified/created");

    // Start server only after DB ready
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error(" Failed to start server:", err.message);
    process.exit(1);
  }
}

startServer();
