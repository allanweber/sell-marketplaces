"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type SubmitEventHandler, useState } from "react";

import { useSignInMutation } from "@/queries/auth";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [traceId, setTraceId] = useState<string | null>(null);

  const signIn = useSignInMutation();

  const onSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (signIn.isPending) return;
    setError(null);
    setTraceId(null);

    try {
      const result = await signIn.mutateAsync({ email, password });
      if (!result.ok) {
        setError(result.errorMessage ?? "Could not sign in.");
        setTraceId(result.traceId);
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("Could not sign in. Please check your connection and try again.");
    } finally {
      // state lives in React Query mutation
    }
  };

  return (
    <main style={{ maxWidth: 420, margin: "40px auto", padding: 16 }}>
      <h1>Sign in</h1>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <label>
          Email
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            autoComplete="email"
            required
          />
        </label>
        <label>
          Password
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            autoComplete="current-password"
            required
            minLength={8}
          />
        </label>

        <button type="submit" disabled={signIn.isPending}>
          {signIn.isPending ? "Signing in…" : "Sign in"}
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
      </form>

      <p style={{ marginTop: 16 }}>
        New here? <Link href="/sign-up">Create an account</Link>
      </p>
    </main>
  );
}

