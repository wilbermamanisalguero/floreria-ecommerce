import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

let db: ReturnType<typeof createDb> | undefined;

function createDb() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL no está definida");
  }
  const client = postgres(url, { max: 5, connect_timeout: 5 });
  return drizzle(client, { schema });
}

export function getDb() {
  db ??= createDb();
  return db;
}
