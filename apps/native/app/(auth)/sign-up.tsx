import { router } from "expo-router";
import { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";

import { getBetterAuthResultTraceId, useNativeSignUpMutation } from "@/queries/auth";

export default function SignUpScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [traceId, setTraceId] = useState<string | null>(null);

  const signUp = useNativeSignUpMutation();

  async function onSubmit() {
    if (signUp.isPending) return;
    setError(null);
    setTraceId(null);

    try {
      const result = await signUp.mutateAsync({ name, email, password });
      if ((result as any)?.error) {
        setError((result as any).error.message ?? "Could not create account. Please try again.");
        setTraceId(getBetterAuthResultTraceId(result));
        return;
      }

      router.replace("/");
    } catch {
      setError("Could not create account. Please check your connection and try again.");
    } finally {
      // state lives in React Query mutation
    }
  }

  return (
    <View style={{ flex: 1, padding: 16, justifyContent: "center", gap: 12 }}>
      <Text style={{ fontSize: 28, fontWeight: "600" }}>Create account</Text>

      <TextInput
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
        placeholder="Name"
        accessibilityLabel="Name"
        testID="auth.name"
        style={{
          borderWidth: 1,
          borderColor: "#d1d5db",
          borderRadius: 10,
          padding: 12,
        }}
      />
      <TextInput
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        placeholder="Email"
        accessibilityLabel="Email"
        testID="auth.email"
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
        placeholder="Password (min 8 chars)"
        accessibilityLabel="Password"
        testID="auth.password"
        style={{
          borderWidth: 1,
          borderColor: "#d1d5db",
          borderRadius: 10,
          padding: 12,
        }}
      />

      <Button
        title={signUp.isPending ? "Creating…" : "Create account"}
        onPress={onSubmit}
        disabled={signUp.isPending}
      />

      <Button title="I already have an account" onPress={() => router.push("/sign-in")} />

      {error ? (
        <View style={{ gap: 6 }}>
          <Text style={{ color: "#b91c1c" }}>{error}</Text>
          {traceId ? <Text style={{ color: "#6b7280", fontSize: 12 }}>Trace ID: {traceId}</Text> : null}
        </View>
      ) : null}
    </View>
  );
}

