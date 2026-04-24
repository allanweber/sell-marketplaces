import { generateTraceId, type TraceId } from "@sell-items/domain";

export const TRACE_HEADER = "x-trace-id" as const;

function isSafeTraceId(value: string): boolean {
  const v = value.trim();
  if (!v) return false;
  // Avoid log forging / header injection / absurdly large values.
  if (v.length > 128) return false;
  // Allow UUIDs and simple token-like IDs.
  return /^[a-zA-Z0-9:_-]+$/.test(v);
}

export function getIncomingTraceId(headers: Headers): TraceId | null {
  const value = headers.get(TRACE_HEADER);
  if (!value) return null;
  return isSafeTraceId(value) ? value.trim() : null;
}

export function ensureTraceId(headers: Headers): TraceId {
  return getIncomingTraceId(headers) ?? generateTraceId();
}

