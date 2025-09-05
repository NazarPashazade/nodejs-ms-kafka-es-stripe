import * as dotenv from "dotenv";
dotenv.config();

export const APP_ENV = process.env.APP_ENV;

export const PORT = parseInt(process.env.PORT!, 10);

export const DATABASE_URL = process.env.DATABASE_URL;

export const CLIENT_ID = process.env.CLIENT_ID!;
export const GROUP_ID = process.env.GROUP_ID!;
export const BROKERS = [process.env.BROKERS!];

export const ELASTIC_SEARCH_URL = process.env.ELASTIC_SEARCH_URL!;
