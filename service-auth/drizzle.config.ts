import { defineConfig } from "drizzle-kit";
import { DATABASE_URL } from "./src/config";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema/*",
  out: "./src/db/migrations",
  driver: "pglite",
  dbCredentials: { url: DATABASE_URL! },
  migrations: {
    table: "migrations",
    schema: "./src/db/migrations",
    prefix: "timestamp",
  },
});
