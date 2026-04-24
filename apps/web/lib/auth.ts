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

  if (envList.length) return envList;

  const webDev = ["http://localhost:3000", "http://127.0.0.1:3000"];
  const expoDev = ["exp://*", "exp://**"];

  return [
    ...(baseURL ? [baseURL] : []),
    ...(process.env.NODE_ENV === "development" ? [...webDev, ...expoDev] : []),
  ];
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

