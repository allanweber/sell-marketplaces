import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("[db] DATABASE_URL is required.");

declare global {
  // eslint-disable-next-line no-var
  var __sellItemsPool: Pool | undefined;
}

// Cache the Pool on `globalThis` so dev hot-reloads/module re-evals don’t create
// a new connection pool each time (which can exhaust Postgres connections).
export const pool =
  globalThis.__sellItemsPool ??
  new Pool({
    connectionString: databaseUrl,
  });

if (!globalThis.__sellItemsPool) {
  globalThis.__sellItemsPool = pool;
}

export const db = drizzle(pool, { schema });

