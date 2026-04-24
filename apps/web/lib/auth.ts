import { betterAuth } from "better-auth";
import { expo } from "@better-auth/expo";
import { nextCookies } from "better-auth/next-js";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";

import { db, schema } from "@sell-items/db";

function getSecret(): string {
  const value = process.env.BETTER_AUTH_SECRET;
  if (value) return value;
  throw new Error("BETTER_AUTH_SECRET is required.");
}

function defaultTrustedOrigins(baseURL: string | undefined): string[] {
  const envList = (process.env.BETTER_AUTH_TRUSTED_ORIGINS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  // Production-like behavior: **only** trust what is explicitly configured.
  // - In all environments, `BETTER_AUTH_TRUSTED_ORIGINS` is the source of truth.
  // - If it isn't provided, we fall back to trusting only our own `baseURL`.
  if (envList.length) return envList;

  return baseURL ? [baseURL] : [];
}

export const auth = betterAuth({
  secret: getSecret(),
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins: defaultTrustedOrigins(process.env.BETTER_AUTH_URL),
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: { enabled: true },
  plugins: [expo(), nextCookies()],
});

