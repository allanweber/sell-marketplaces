"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { useSignOutMutation } from "@/queries/auth";

export function SignOutButton() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [traceId, setTraceId] = useState<string | null>(null);

  const signOut = useSignOutMutation();

  async function onSignOut() {
    if (signOut.isPending) return;
    setError(null);
    setTraceId(null);

    try {
      const result = await signOut.mutateAsync();
      if (!result.ok) {
        setError(result.errorMessage ?? "Could not sign out.");
        setTraceId(result.traceId);
        return;
      }
      router.refresh();
    } catch {
      setError("Could not sign out. Please check your connection and try again.");
    } finally {
      // state lives in React Query mutation
    }
  }

  return (
    <div style={{ display: "grid", gap: 8, justifyItems: "start" }}>
      <button type="button" onClick={onSignOut} disabled={signOut.isPending}>
        {signOut.isPending ? "Signing out…" : "Sign out"}
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

