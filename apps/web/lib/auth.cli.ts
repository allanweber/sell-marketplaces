import { betterAuth } from "better-auth";
import { expo } from "@better-auth/expo";
import { nextCookies } from "better-auth/next-js";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

function getSecret(): string {
  const value = process.env.BETTER_AUTH_SECRET;
  if (value) return value;
  throw new Error("BETTER_AUTH_SECRET is required.");
}

function getDatabaseUrl(): string {
  const value = process.env.DATABASE_URL;
  if (value) return value;
  throw new Error("DATABASE_URL is required.");
}

const pool = new Pool({
  connectionString: getDatabaseUrl(),
});

const db = drizzle(pool);

export const auth = betterAuth({
  secret: getSecret(),
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins:
    process.env.BETTER_AUTH_TRUSTED_ORIGINS?.split(",")
      .map((s) => s.trim())
      .filter(Boolean) ?? [],
  database: drizzleAdapter(db, { provider: "pg" }),
  emailAndPassword: { enabled: true },
  plugins: [expo(), nextCookies()],
});

