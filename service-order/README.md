## Configuration of order-service

1. Install runtime dependencies

   ```
   npm i express express-rate-limiter dotenv cors
   ```

2. Install development dependencies

   ```
   npm install --save-dev typescript ts-node @types/node @types/express @types/cors  nodemon jest ts-jest  @types/jest
   ```

3. Initialize TypeScript configuration

   ```
   tsc --init
   ```

---

## Setup Database(drizzle + postgres)

1. Create "order-db-server" database if it is not exist

2. Install Dependencies (Doc: https://orm.drizzle.team/docs/get-started/postgresql-new)

   ```
   npm i drizzle-orm pg dotenv
   npm i -D drizzle-kit tsx @types/pg
   ```

3. Create configuration files:

   ```
   ./src/drizzle.config.ts
   ./db/db-connection.ts (to connect db)
   ./db/schema/order.ts (to create database schema)
   ./db/schema/cart.ts (to create database schema)
   ./db/migrations/migration.ts (to run migrations)
   ```

4. Run these commands one by one:

   ```
   "db:generate": "drizzle-kit generate",
   "db:migrate": "tsx ./src/db/migrations/migration.ts",
   "db:push": "drizzle-kit push"
   ```

Download DTO mapping libraries:

```
npm i @sinclair/typebox ajv
```

Logging

```
npm i pino pino-http pino-pretty
```

Kafka

Create Types and install library

```
npm i kafkajs
npm i --save-dev @types/kafkajs
```
