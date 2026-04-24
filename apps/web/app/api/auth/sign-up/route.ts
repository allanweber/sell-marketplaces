import { auth } from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/api-envelope";
import { requireValidOrigin } from "@/lib/csrf";
import { requireRateLimit } from "@/lib/rate-limit";
import { ensureTraceId } from "@/lib/trace";

export const runtime = "nodejs";

function appendSetCookieHeaders(from: Headers, to: Headers) {
  const anyFrom = from as unknown as { getSetCookie?: () => string[] };
  const values = anyFrom.getSetCookie?.();
  if (values?.length) {
    for (const v of values) to.append("set-cookie", v);
    return;
  }

  // Best-effort fallback for runtimes without `getSetCookie()`.
  const raw = from.get("set-cookie");
  if (raw) {
    to.append("set-cookie", raw);
    return;
  }

  throw new Error("Set-Cookie extraction unsupported in this runtime.");
}

export async function POST(request: Request) {
  const csrf = requireValidOrigin(request);
  if (csrf) return csrf;

  const traceId = ensureTraceId(request.headers);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError(
      { code: "BAD_REQUEST", message: "Invalid JSON body." },
      traceId,
      { status: 400 },
    );
  }

  const email = typeof (body as any)?.email === "string" ? (body as any).email.trim() : "";
  const password = typeof (body as any)?.password === "string" ? (body as any).password : "";
  const name = typeof (body as any)?.name === "string" ? (body as any).name.trim() : "";

  const rate = requireRateLimit(
    request,
    { keyPrefix: "auth:sign-up", limit: 5, windowMs: 60_000 },
    email ? `email:${email.toLowerCase()}` : undefined,
  );
  if (rate) return rate;

  if (!name || !email || !email.includes("@") || password.length < 8) {
    return jsonError(
      {
        code: "VALIDATION_ERROR",
        message: "Please enter your name, a valid email, and a password (min 8 characters).",
      },
      traceId,
      { status: 400, headers: { "cache-control": "no-store" } },
    );
  }

  try {
    const res = await auth.api.signUpEmail({
      headers: request.headers,
      body: { email, password, name },
      asResponse: true,
    });

    const headers = new Headers();
    headers.set("cache-control", "no-store");
    try {
      appendSetCookieHeaders(res.headers, headers);
    } catch {
      return jsonError(
        {
          code: "INTERNAL",
          message: "Auth session cookies could not be set. Please try again.",
        },
        traceId,
        { status: 500, headers },
      );
    }

    if (!res.ok) {
      // Avoid leaking whether an email already exists.
      return jsonError(
        { code: "AUTH_SIGN_UP_FAILED", message: "Could not create account. Please try again." },
        traceId,
        { status: 400, headers },
      );
    }

    // Cookie-based session is established via Set-Cookie; keep the JSON payload minimal.
    return jsonOk({ ok: true }, traceId, { status: 200, headers });
  } catch {
    return jsonError(
      { code: "INTERNAL", message: "Could not create account. Please try again." },
      traceId,
      { status: 500, headers: { "cache-control": "no-store" } },
    );
  }
}

