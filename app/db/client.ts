import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { config } from "dotenv";

config({ path: ".env" });

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

export const migrationClient = postgres(DATABASE_URL, { max: 1 });

export const queryClient = postgres(DATABASE_URL);
export const db = drizzle(queryClient, { schema });
