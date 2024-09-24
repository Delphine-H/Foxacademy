require('dotenv').config();
const { Pool } = require('pg');

// Configure la connexion à la base de données PostgreSQL
const db = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.DB_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.DB_PORT,
});

module.exports = db;
