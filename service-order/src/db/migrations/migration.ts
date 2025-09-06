import { Pool } from "pg";
import { DATABASE_URL } from "../../config";
import { drizzle } from "drizzle-orm/node-postgres/driver";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { logger } from "../../utils";

const runMigration = async () => {
  try {
    logger.info("Starting migration...");
    const pool = new Pool({ connectionString: DATABASE_URL });

    const db = drizzle(pool);

    const resp = await migrate(db, { migrationsFolder: "./src/db/migrations" });

    logger.info("Migration completed successfully.");
    pool.end();
  } catch (error) {
    logger.error("Migration failed:", { error });
  }
};

runMigration();
