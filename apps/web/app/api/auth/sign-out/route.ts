import { auth } from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/api-envelope";
import { requireValidOrigin } from "@/lib/csrf";
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

  try {
    const res = await auth.api.signOut({
      headers: request.headers,
      asResponse: true,
    });

    const headers = new Headers();
    headers.set("cache-control", "no-store");
    try {
      appendSetCookieHeaders(res.headers, headers);
    } catch {
      return jsonError(
        { code: "INTERNAL", message: "Could not clear auth session. Please try again." },
        traceId,
        { status: 500, headers },
      );
    }

    if (!res.ok) {
      // Sign out should be idempotent to avoid scary UX if the session is already gone.
      return jsonOk({ ok: true }, traceId, { status: 200, headers });
    }

    return jsonOk({ ok: true }, traceId, { status: 200, headers });
  } catch {
    return jsonError(
      { code: "INTERNAL", message: "Could not sign out. Please try again." },
      traceId,
      { status: 500, headers: { "cache-control": "no-store" } },
    );
  }
}

