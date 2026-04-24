import { router } from "expo-router";
import { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";

import { authClient } from "@/lib/auth-client";
import { extractTraceId } from "@/lib/trace-id";

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [traceId, setTraceId] = useState<string | null>(null);

  async function onSubmit() {
    if (isPending) return;
    setIsPending(true);
    setError(null);
    setTraceId(null);

    try {
      const result = await authClient.signIn.email({ email, password });
      if (result.error) {
        setError(result.error.message ?? "Invalid email or password.");
        setTraceId(extractTraceId(result));
        return;
      }

      router.replace("/");
    } catch {
      setError("Could not sign in. Please check your connection and try again.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <View style={{ flex: 1, padding: 16, justifyContent: "center", gap: 12 }}>
      <Text style={{ fontSize: 28, fontWeight: "600" }}>Sign in</Text>

      <TextInput
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        placeholder="Email"
        style={{
          borderWidth: 1,
          borderColor: "#d1d5db",
          borderRadius: 10,
          padding: 12,
        }}
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="Password"
        style={{
          borderWidth: 1,
          borderColor: "#d1d5db",
          borderRadius: 10,
          padding: 12,
        }}
      />

      <Button title={isPending ? "Signing in…" : "Sign in"} onPress={onSubmit} disabled={isPending} />

      <Button title="Create account" onPress={() => router.push("/sign-up")} />

      {error ? (
        <View style={{ gap: 6 }}>
          <Text style={{ color: "#b91c1c" }}>{error}</Text>
          {traceId ? <Text style={{ color: "#6b7280", fontSize: 12 }}>Trace ID: {traceId}</Text> : null}
        </View>
      ) : null}
    </View>
  );
}

