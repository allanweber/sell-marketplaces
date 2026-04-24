import { fail, ok, type ApiError, type ApiErrorResponse, type ApiSuccess } from "@sell-items/domain";
import type { TraceId } from "@sell-items/domain";

import { TRACE_HEADER } from "./trace";

export function jsonOk<T>(
  data: T,
  traceId: TraceId,
  init?: ResponseInit,
): Response {
  const body: ApiSuccess<T> = ok(data, traceId);
  const headers = new Headers(init?.headers);
  headers.set("content-type", "application/json");
  headers.set(TRACE_HEADER, traceId);
  return Response.json(body, { ...init, headers });
}

export function jsonError(
  error: ApiError,
  traceId: TraceId,
  init?: ResponseInit,
): Response {
  const body: ApiErrorResponse = fail(error, traceId);
  const headers = new Headers(init?.headers);
  headers.set("content-type", "application/json");
  headers.set(TRACE_HEADER, traceId);
  return Response.json(body, { ...init, headers });
}

