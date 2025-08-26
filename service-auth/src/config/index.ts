import * as dotenv from "dotenv";
dotenv.config();

export const DATABASE_URL = process.env.DATABASE_URL;
export const PORT = parseInt(process.env.PORT!, 10);
export const JWT_SECRET = process.env.JWT_SECRET!;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN!;
