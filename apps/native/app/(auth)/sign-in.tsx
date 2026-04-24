import { router } from "expo-router";
import { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";

import { getBetterAuthResultTraceId, useNativeSignInMutation } from "@/queries/auth";

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [traceId, setTraceId] = useState<string | null>(null);

  const signIn = useNativeSignInMutation();

  async function onSubmit() {
    if (signIn.isPending) return;
    setError(null);
    setTraceId(null);

    try {
      const result = await signIn.mutateAsync({ email, password });
      if ((result as any)?.error) {
        setError((result as any).error.message ?? "Invalid email or password.");
        setTraceId(getBetterAuthResultTraceId(result));
        return;
      }

      router.replace("/");
    } catch {
      setError("Could not sign in. Please check your connection and try again.");
    } finally {
      // state lives in React Query mutation
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

      <Button title={signIn.isPending ? "Signing in…" : "Sign in"} onPress={onSubmit} disabled={signIn.isPending} />

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

