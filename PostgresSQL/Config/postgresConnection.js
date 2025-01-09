require("dotenv").config();
const { Pool } = require("pg");

const jfsDB = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
  keepAlive: true,
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
});

module.exports = jfsDB;

