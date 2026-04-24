import { router } from "expo-router";
import { useState } from "react";
import { Button, Text, View } from "react-native";

import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";

export default function Home() {
  const { data: session, isPending } = authClient.useSession();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [traceId, setTraceId] = useState<string | null>(null);

  async function onSignOut() {
    if (isSigningOut) return;
    setIsSigningOut(true);
    setError(null);
    setTraceId(null);
    try {
      const res = await apiFetch("/api/auth/sign-out", { method: "POST" });
      const json = await res.json().catch(() => null);
      if (!res.ok) {
        setError(json?.error?.message ?? "Could not sign out. Please try again.");
        setTraceId(json?.traceId ?? res.headers.get("x-trace-id"));
        return;
      }

      // Clear local session/cookie state owned by the Better Auth Expo plugin.
      await (authClient as any).signOut?.();

      router.replace("/sign-in");
    } catch {
      setError("Could not sign out. Please check your connection and try again.");
    } finally {
      setIsSigningOut(false);
    }
  }

  if (isPending) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Loading…</Text>
      </View>
    );
  }

  if (!session) {
    return (
      <View style={{ flex: 1, padding: 16, justifyContent: "center", gap: 12 }}>
        <Text style={{ fontSize: 28, fontWeight: "600" }}>Sell Items</Text>
        <Button title="Sign in" onPress={() => router.push("/sign-in")} />
        <Button title="Create account" onPress={() => router.push("/sign-up")} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16, justifyContent: "center", gap: 12 }}>
      <Text style={{ fontSize: 28, fontWeight: "600" }}>Sell Items</Text>
      <Text>
        Signed in as <Text style={{ fontWeight: "700" }}>{session.user.email}</Text>
      </Text>
      <Button title={isSigningOut ? "Signing out…" : "Sign out"} onPress={onSignOut} disabled={isSigningOut} />
      {error ? (
        <View style={{ gap: 6 }}>
          <Text style={{ color: "#b91c1c" }}>{error}</Text>
          {traceId ? <Text style={{ color: "#6b7280", fontSize: 12 }}>Trace ID: {traceId}</Text> : null}
        </View>
      ) : null}
    </View>
  );
}
