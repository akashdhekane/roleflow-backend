import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const db = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:Admin@localhost:5432/roleflow',
});

export const initDB = async () => {
  try {
    await db.connect();
    console.log("✅ Connected to PostgreSQL");
  } catch (err) {
    console.error("❌ Connection error:", err);
  }
};
