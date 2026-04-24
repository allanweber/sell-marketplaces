export function extractTraceId(value: unknown): string | null {
  if (!value || typeof value !== "object") return null;
  if (!("traceId" in value)) return null;

  const traceId = (value as { traceId?: unknown }).traceId;
  return typeof traceId === "string" ? traceId : null;
}

