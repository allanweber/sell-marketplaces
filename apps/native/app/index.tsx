import { router } from "expo-router";
import { useState } from "react";
import { Button, Text, View } from "react-native";

import { authClient } from "@/lib/auth-client";
import { useNativeSignOutMutation } from "@/queries/auth";

export default function Home() {
  const { data: session, isPending } = authClient.useSession();
  const [error, setError] = useState<string | null>(null);
  const [traceId, setTraceId] = useState<string | null>(null);

  const signOut = useNativeSignOutMutation();

  async function onSignOut() {
    if (signOut.isPending) return;
    setError(null);
    setTraceId(null);
    try {
      const result = await signOut.mutateAsync();
      if (!result.ok) {
        setError(result.errorMessage);
        setTraceId(result.traceId ?? null);
        return;
      }
      router.replace("/sign-in");
    } catch {
      setError("Could not sign out. Please check your connection and try again.");
    } finally {
      // state lives in React Query mutation
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
      <Button
        title={signOut.isPending ? "Signing out…" : "Sign out"}
        onPress={onSignOut}
        disabled={signOut.isPending}
      />
      {error ? (
        <View style={{ gap: 6 }}>
          <Text style={{ color: "#b91c1c" }}>{error}</Text>
          {traceId ? <Text style={{ color: "#6b7280", fontSize: 12 }}>Trace ID: {traceId}</Text> : null}
        </View>
      ) : null}
    </View>
  );
}
