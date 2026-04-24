export type TraceId = string;

export function generateTraceId(): TraceId {
  // UUID is user-safe and good enough for correlating logs/support requests.
  return globalThis.crypto?.randomUUID?.() ?? fallbackTraceId();
}

function fallbackTraceId(): TraceId {
  const rand = Math.random().toString(16).slice(2);
  const time = Date.now().toString(16);
  return `trace_${time}_${rand}`;
}

