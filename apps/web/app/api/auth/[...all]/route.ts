import { toNextJsHandler } from "better-auth/next-js";

import { auth } from "@/lib/auth";
import { requireValidOrigin } from "@/lib/csrf";

export const runtime = "nodejs";

const handler = toNextJsHandler(auth);

export async function GET(request: Request) {
  const csrf = requireValidOrigin(request);
  if (csrf) return csrf;
  return handler.GET(request);
}

export async function POST(request: Request) {
  const csrf = requireValidOrigin(request);
  if (csrf) return csrf;
  return handler.POST(request);
}

