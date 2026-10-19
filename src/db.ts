
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.DB_HOST || "localhost",
  database: process.env.POSTGRES_DB,
  port: Number(process.env.POSTGRES_PORT || 5432),
});
