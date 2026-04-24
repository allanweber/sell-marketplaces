import { generateTraceId, type ApiEnvelope, type TraceId } from "@sell-items/domain";

import { TRACE_HEADER } from "./trace";

type JsonObject = Record<string, unknown>;

export type ApiClientResult<T> =
  | { ok: true; data: T; traceId: TraceId }
  | { ok: false; errorMessage: string; traceId: TraceId };

function coerceTraceId(value: unknown): TraceId | null {
  if (typeof value !== "string") return null;
  const v = value.trim();
  if (!v) return null;
  if (v.length > 128) return null;
  if (!/^[a-zA-Z0-9:_-]+$/.test(v)) return null;
  return v;
}

async function readJsonEnvelope<T>(res: Response): Promise<ApiEnvelope<T> | null> {
  const json = (await res.json().catch(() => null)) as unknown;
  if (!json || typeof json !== "object") return null;
  return json as ApiEnvelope<T>;
}

export async function apiPostJson<T>(
  path: string,
  body: JsonObject,
  init: RequestInit = {},
): Promise<ApiClientResult<T>> {
  const outgoingTraceId = generateTraceId();
  const headers = new Headers(init.headers);
  headers.set("content-type", "application/json");
  headers.set(TRACE_HEADER, outgoingTraceId);

  const res = await fetch(path, {
    ...init,
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  const envelope = await readJsonEnvelope<T>(res);
  const traceId =
    coerceTraceId((envelope as { traceId?: unknown } | null)?.traceId) ??
    coerceTraceId(res.headers.get(TRACE_HEADER)) ??
    outgoingTraceId;

  if (!res.ok) {
    const errorMessage =
      (envelope && "error" in envelope && typeof envelope.error?.message === "string"
        ? envelope.error.message
        : null) ?? "Request failed.";
    return { ok: false, errorMessage, traceId };
  }

  if (!envelope || !("data" in envelope)) {
    return { ok: false, errorMessage: "Unexpected server response.", traceId };
  }

  return { ok: true, data: envelope.data, traceId };
}

export async function apiPostNoBody<T>(
  path: string,
  init: RequestInit = {},
): Promise<ApiClientResult<T>> {
  const outgoingTraceId = generateTraceId();
  const headers = new Headers(init.headers);
  headers.set(TRACE_HEADER, outgoingTraceId);

  const res = await fetch(path, {
    ...init,
    method: "POST",
    headers,
  });

  const envelope = await readJsonEnvelope<T>(res);
  const traceId =
    coerceTraceId((envelope as { traceId?: unknown } | null)?.traceId) ??
    coerceTraceId(res.headers.get(TRACE_HEADER)) ??
    outgoingTraceId;

  if (!res.ok) {
    const errorMessage =
      (envelope && "error" in envelope && typeof envelope.error?.message === "string"
        ? envelope.error.message
        : null) ?? "Request failed.";
    return { ok: false, errorMessage, traceId };
  }

  if (!envelope || !("data" in envelope)) {
    return { ok: false, errorMessage: "Unexpected server response.", traceId };
  }

  return { ok: true, data: envelope.data, traceId };
}

