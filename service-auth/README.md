## Set up Database for user-service

### Install dependencies

```
npm install --save-dev pg
npm install pg
```

### create user-db-server database

### run users.sql in that database

### adjust .env file:

```
DATABASE_URL="postgresql://postgres:Database123!@localhost:5432/user-db?schema=public"
```
