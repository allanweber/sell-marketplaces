import { jsonError } from "./api-envelope";
import { ensureTraceId } from "./trace";

function isDev(): boolean {
  return process.env.NODE_ENV === "development";
}

function expectedOrigin(): string | null {
  const base = process.env.BETTER_AUTH_URL;
  if (!base) return null;
  try {
    return new URL(base).origin;
  } catch {
    return null;
  }
}

function allowedOrigins(): string[] {
  const envList = (process.env.BETTER_AUTH_TRUSTED_ORIGINS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    // Normalize to origin-only strings when possible.
    .map((s) => {
      try {
        return new URL(s).origin;
      } catch {
        return s;
      }
    });

  const unique = Array.from(new Set(envList));
  if (unique.length) return unique;

  const base = expectedOrigin();
  const dev =
    isDev()
      ? ["http://localhost:3000", "http://127.0.0.1:3000"]
      : [];
  return Array.from(new Set([...(base ? [base] : []), ...dev]));
}

function matchesAllowedOrigin(actual: string, allowed: string): boolean {
  if (actual === allowed) return true;
  // Support very small wildcard surface:
  // - "https://*.example.com"
  // - "scheme://*" (e.g. sellitems://*)
  if (!allowed.includes("*")) return false;
  if (!isDev()) return false;

  // Escape regex special chars except '*'
  const escaped = allowed.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*");
  const re = new RegExp(`^${escaped}$`);
  return re.test(actual);
}

function requestOrigin(headers: Headers): string | null {
  const origin = headers.get("origin");
  if (origin && origin.trim()) return origin;
  const referer = headers.get("referer");
  if (referer && referer.trim()) {
    try {
      return new URL(referer).origin;
    } catch {
      return null;
    }
  }
  return null;
}

export function requireValidOrigin(request: Request): Response | null {
  const traceId = ensureTraceId(request.headers);
  const expected = allowedOrigins();
  const actual = requestOrigin(request.headers);

  if (!isDev() && expected.some((e) => e.includes("*"))) {
    return jsonError(
      {
        code: "CSRF_MISCONFIGURED",
        message: "Auth origin configuration contains wildcards in production.",
      },
      traceId,
      { status: 500 },
    );
  }

  // If we're missing origin configuration, fail closed so we don't silently run
  // without a CSRF baseline.
  if (!expected.length) {
    return jsonError(
      {
        code: "CSRF_MISCONFIGURED",
        message: "Server is missing auth origin configuration.",
      },
      traceId,
      { status: 500 },
    );
  }

  if (!actual) {
    return jsonError(
      { code: "CSRF_ORIGIN_MISSING", message: "Missing request origin." },
      traceId,
      { status: 403 },
    );
  }

  if (!expected.some((e) => matchesAllowedOrigin(actual, e))) {
    return jsonError(
      { code: "CSRF_ORIGIN_INVALID", message: "Invalid request origin." },
      traceId,
      { status: 403 },
    );
  }

  return null;
}

