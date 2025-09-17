import { Pool } from "pg";
import { DATABASE_URL } from "../config";
import { NodePgDatabase } from "drizzle-orm/node-postgres/driver";
import * as schema from "./schema";
import { drizzle } from "drizzle-orm/node-postgres";

const pool = new Pool({
  connectionString: DATABASE_URL,
});

pool
  .connect()
  .then((client) => {
    console.log("✅ Database connected successfully");
    client.release();
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err);
  });

export const DB: NodePgDatabase<typeof schema> = drizzle(pool, { schema });
