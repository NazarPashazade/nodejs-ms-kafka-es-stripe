import { Pool } from "pg";
import { DATABASE_URL } from "../../config";
import { drizzle } from "drizzle-orm/node-postgres/driver";
import { migrate } from "drizzle-orm/node-postgres/migrator";

const runMigration = async () => {
  try {
    console.log("Starting migration...", DATABASE_URL);
    const pool = new Pool({ connectionString: DATABASE_URL });

    const db = drizzle(pool);

    const resp = await migrate(db, { migrationsFolder: "./src/db/migrations" });

    console.log("Migration completed successfully.");
    pool.end();
  } catch (error) {
    console.error("Migration failed:", error);
  }
};

runMigration();
