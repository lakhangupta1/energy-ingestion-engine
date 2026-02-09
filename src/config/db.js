const { Pool } = require('pg');
require('dotenv').config();

// here can use .env variables for better security and flexibility
const pool = new Pool({
  host: '127.0.0.1',
  port: 5433,   //number, not string
  user: 'postgres',
  password: 'postgres',
  database: 'energy'
});

module.exports = pool;
