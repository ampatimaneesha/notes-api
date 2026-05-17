require("dotenv").config();

const knex = require("knex");
const config = require("./knexfile");

const db = knex(config.development);

module.exports = db;


const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = pool;