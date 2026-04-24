"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { generateTraceId } from "@sell-items/domain";
import { TRACE_HEADER } from "@/lib/trace";

export function SignOutButton() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [traceId, setTraceId] = useState<string | null>(null);

  async function onSignOut() {
    if (isPending) return;
    setIsPending(true);
    setError(null);
    const newTraceId = generateTraceId();
    setTraceId(newTraceId);

    try {
      const res = await fetch("/api/auth/sign-out", {
        method: "POST",
        headers: { [TRACE_HEADER]: newTraceId },
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) {
        setError(json?.error?.message ?? "Could not sign out.");
        setTraceId(json?.traceId ?? res.headers.get(TRACE_HEADER) ?? newTraceId);
        return;
      }
      router.refresh();
    } catch {
      setError("Could not sign out. Please check your connection and try again.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div style={{ display: "grid", gap: 8, justifyItems: "start" }}>
      <button type="button" onClick={onSignOut} disabled={isPending}>
        {isPending ? "Signing out…" : "Sign out"}
      </button>
      {error ? (
        <div role="alert" style={{ color: "#b91c1c" }}>
          <div>{error}</div>
          {traceId ? (
            <div style={{ marginTop: 6, fontSize: 12, opacity: 0.9 }}>
              Trace ID: <code>{traceId}</code>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

