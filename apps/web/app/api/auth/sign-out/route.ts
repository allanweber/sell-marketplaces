import { jsonError, jsonOk } from "@/lib/api-envelope";
import { auth } from "@/lib/auth";
import { requireValidOrigin } from "@/lib/csrf";
import { ensureTraceId } from "@/lib/trace";

export const runtime = "nodejs";

function withCors(request: Request, response: Response): Response {
  const origin = request.headers.get("origin");
  if (!origin) return response;

  const headers = new Headers(response.headers);
  headers.set("Access-Control-Allow-Origin", origin);
  headers.set("Access-Control-Allow-Credentials", "true");
  headers.set("Vary", "Origin");
  return new Response(response.body, { status: response.status, headers });
}

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

export async function OPTIONS(request: Request) {
  const csrf = requireValidOrigin(request);
  if (csrf) return withCors(request, csrf);

  const reqHeaders = request.headers.get("access-control-request-headers");

  const headers = new Headers();
  const origin = request.headers.get("origin");
  if (origin) headers.set("Access-Control-Allow-Origin", origin);
  headers.set("Access-Control-Allow-Credentials", "true");
  headers.set("Access-Control-Allow-Methods", "POST,OPTIONS");
  headers.set(
    "Access-Control-Allow-Headers",
    reqHeaders ?? "content-type,x-trace-id,cookie,origin",
  );
  headers.set("Access-Control-Max-Age", "600");
  headers.set("Vary", "Origin");
  return new Response(null, { status: 204, headers });
}

export async function POST(request: Request) {
  const csrf = requireValidOrigin(request);
  if (csrf) return withCors(request, csrf);

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
      return withCors(
        request,
        jsonError(
          { code: "INTERNAL", message: "Could not clear auth session. Please try again." },
          traceId,
          { status: 500, headers },
        ),
      );
    }

    if (!res.ok) {
      // Sign out should be idempotent to avoid scary UX if the session is already gone.
      return withCors(request, jsonOk({ ok: true }, traceId, { status: 200, headers }));
    }

    return withCors(request, jsonOk({ ok: true }, traceId, { status: 200, headers }));
  } catch {
    return withCors(
      request,
      jsonError(
        { code: "INTERNAL", message: "Could not sign out. Please try again." },
        traceId,
        { status: 500, headers: { "cache-control": "no-store" } },
      ),
    );
  }
}

