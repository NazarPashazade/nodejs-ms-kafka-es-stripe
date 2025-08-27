## Setup Database(drizzle + postgres)

1. Create "user-db-server" database if it is not exist

2. Install Dependencies (Doc: https://orm.drizzle.team/docs/get-started/postgresql-new)

   ```
   npm i drizzle-orm pg dotenv
   npm i -D drizzle-kit tsx @types/pg
   ```

3. Create configuration files:

   ```
   ./src/drizzle.config.ts
   ./db/db-connection.ts (to connect db)
   ./db/schema/user.ts (to create database schema)
   ./db/migrations/migration.ts (to run migrations)
   ```

4. Run these commands one by one:

   ```
   "db:generate": "drizzle-kit generate",
   "db:migrate": "tsx ./src/db/migrations/migration.ts",
   "db:push": "drizzle-kit push"
   ```
