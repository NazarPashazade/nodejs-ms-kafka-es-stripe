import * as dotenv from "dotenv";
dotenv.config();

export const DATABASE_URL = process.env.DATABASE_URL;
export const PORT = parseInt(process.env.PORT!, 10);

export const PRODUCT_BASE_URL = process.env.PRODUCT_BASE_URL;
export const AUTH_BASE_URL = process.env.AUTH_BASE_URL;
export const ORDER_BASE_URL = process.env.ORDER_BASE_URL;

export const CLIENT_ID = process.env.CLIENT_ID!;
export const GROUP_ID = process.env.GROUP_ID!;
export const BROKERS = [process.env.BROKERS!];

export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY!;
export const STRIPE_PUBLIC_KEY = process.env.STRIPE_PUBLIC_KEY!;
