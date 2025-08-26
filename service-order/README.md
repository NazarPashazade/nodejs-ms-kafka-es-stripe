## Configuration of order-service

### Install runtime dependencies

```
npm i express express-rate-limiter dotenv cors
```

### Install development dependencies

```
npm install --save-dev typescript ts-node @types/node @types/express @types/cors  nodemon jest ts-jest  @types/jest
```

### Initialize TypeScript configuration

```
tsc --init
```

---

### Setup Database(drizzle + postgres)

Documentation: https://orm.drizzle.team/docs/get-started/postgresql-new

```
npm i drizzle-orm pg dotenv
npm i -D drizzle-kit tsx @types/pg
```

Crete configuration file: src/config/.index.ts

Create new Migration (Migration folder will be created)

Run these commands one by one:

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
