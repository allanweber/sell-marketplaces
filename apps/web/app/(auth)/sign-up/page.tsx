"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type SubmitEventHandler, useState } from "react";

import { useSignUpMutation } from "@/queries/auth";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [traceId, setTraceId] = useState<string | null>(null);

  const signUp = useSignUpMutation();

  const onSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (signUp.isPending) return;
    setError(null);
    setTraceId(null);

    try {
      const result = await signUp.mutateAsync({ name, email, password });
      if (!result.ok) {
        setError(result.errorMessage ?? "Could not create account.");
        setTraceId(result.traceId);
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("Could not create account. Please check your connection and try again.");
    } finally {
      // state lives in React Query mutation
    }
  };

  return (
    <main style={{ maxWidth: 420, margin: "40px auto", padding: 16 }}>
      <h1>Create account</h1>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <label>
          Name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            autoComplete="name"
            required
          />
        </label>
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
            autoComplete="new-password"
            required
            minLength={8}
          />
        </label>

        <button type="submit" disabled={signUp.isPending}>
          {signUp.isPending ? "Creating…" : "Create account"}
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
        Already have an account? <Link href="/sign-in">Sign in</Link>
      </p>
    </main>
  );
}

