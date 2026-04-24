import { jsonError } from "./api-envelope";
import { ensureTraceId } from "./trace";

type RateLimitConfig = {
  keyPrefix: string;
  limit: number;
  windowMs: number;
};

type Counter = { count: number; resetAt: number };

const store = new Map<string, Counter>();

const MAX_KEYS = 10_000;

function cleanup(now: number) {
  store.forEach((v, k) => {
    if (v.resetAt <= now) store.delete(k);
  });
}

function getClientIp(request: Request): string {
  const trustProxy = process.env.TRUST_PROXY === "1";
  if (trustProxy) {
    const forwarded = request.headers.get("x-forwarded-for");
    const first = forwarded?.split(",")[0]?.trim();
    if (first && first.length <= 128) return first;
    const realIp = request.headers.get("x-real-ip")?.trim();
    if (realIp && realIp.length <= 128) return realIp;
  }
  return "unknown";
}

export function requireRateLimit(
  request: Request,
  config: RateLimitConfig,
  extraKey?: string,
): Response | null {
  const now = Date.now();
  cleanup(now);

  // Basic DoS guard: don't allow unbounded growth.
  if (store.size > MAX_KEYS) {
    cleanup(now);
    if (store.size > MAX_KEYS) store.clear();
  }

  const traceId = ensureTraceId(request.headers);
  const ip = getClientIp(request);
  const key = `${config.keyPrefix}:${ip}${extraKey ? `:${extraKey}` : ""}`;

  const current = store.get(key);
  if (!current || current.resetAt <= now) {
    // First request in a new window counts as 1 of `limit`.
    store.set(key, { count: 1, resetAt: now + config.windowMs });
    return null;
  }

  const nextCount = current.count + 1;
  if (nextCount > config.limit) {
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((current.resetAt - now) / 1000),
    );
    return jsonError(
      { code: "RATE_LIMITED", message: "Too many attempts. Please try again shortly." },
      traceId,
      {
        status: 429,
        headers: {
          "cache-control": "no-store",
          "retry-after": String(retryAfterSeconds),
        },
      },
    );
  }

  current.count = nextCount;
  store.set(key, current);
  return null;
}

