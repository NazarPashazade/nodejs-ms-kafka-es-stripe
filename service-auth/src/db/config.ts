import { Pool, QueryResult } from "pg";
import * as dotenv from "dotenv";
import { DATABASE_URL } from "../config";

dotenv.config();

const pool = new Pool({ connectionString: DATABASE_URL });

pool.on("connect", () => {
  console.log("connected to the db");
});

export const query = <T extends import("pg").QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> => {
  return pool.query<T>(text, params);
};
