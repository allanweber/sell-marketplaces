import { toNextJsHandler } from "better-auth/next-js";

import { auth } from "@/lib/auth";
import { requireValidOrigin } from "@/lib/csrf";

export const runtime = "nodejs";

const handler = toNextJsHandler(auth);

function withCors(request: Request, response: Response): Response {
  const origin = request.headers.get("origin");
  if (!origin) return response;

  const headers = new Headers(response.headers);
  headers.set("Access-Control-Allow-Origin", origin);
  headers.set("Access-Control-Allow-Credentials", "true");
  headers.set("Vary", "Origin");
  return new Response(response.body, { status: response.status, headers });
}

export async function OPTIONS(request: Request) {
  const csrf = requireValidOrigin(request);
  if (csrf) return withCors(request, csrf);

  const reqHeaders = request.headers.get("access-control-request-headers");

  const headers = new Headers();
  const origin = request.headers.get("origin");
  if (origin) headers.set("Access-Control-Allow-Origin", origin);
  headers.set("Access-Control-Allow-Credentials", "true");
  headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  headers.set(
    "Access-Control-Allow-Headers",
    reqHeaders ?? "content-type,x-trace-id,cookie,origin",
  );
  headers.set("Access-Control-Max-Age", "600");
  headers.set("Vary", "Origin");
  return new Response(null, { status: 204, headers });
}

export async function GET(request: Request) {
  const csrf = requireValidOrigin(request);
  if (csrf) return withCors(request, csrf);
  return withCors(request, await handler.GET(request));
}

export async function POST(request: Request) {
  const csrf = requireValidOrigin(request);
  if (csrf) return withCors(request, csrf);
  return withCors(request, await handler.POST(request));
}

