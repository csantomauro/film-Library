import pkg from "pg";
const { Pool } = pkg;

// Use environment variables from Render
const pool = new Pool({
  host: process.env.DB_HOST,       // e.g., db-postgresql-xyz.render.com
  port: process.env.DB_PORT,       // usually 5432
  database: process.env.DB_NAME,   // your database name
  user: process.env.DB_USER,       // your database user
  password: process.env.DB_PASS,   // your database password
  ssl: { rejectUnauthorized: false }  // required on Render
});

export default pool;