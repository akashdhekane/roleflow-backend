import app from "./app";
import { Pool } from "pg";

const PORT = process.env.PORT || 3000;
export const db = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:Admin@localhost:5432/roleflow',
});
const startServer = async () => {
  try {
    await db.connect();
    console.log("✅ Connected to PostgreSQL");

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to connect to PostgreSQL:", err);
    process.exit(1); // exit if DB connection fails
  }
};

startServer();
