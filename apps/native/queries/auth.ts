import { useMutation } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { extractTraceId } from "@/lib/trace-id";

export function useNativeSignInMutation(args: { email: string; password: string }) {
  return useMutation({
    mutationFn: async () => authClient.signIn.email(args),
  });
}

export function useNativeSignUpMutation(args: { name: string; email: string; password: string }) {
  return useMutation({
    mutationFn: async () => authClient.signUp.email(args),
  });
}

export function useNativeSignOutMutation() {
  return useMutation({
    mutationFn: async () => {
      const res = await apiFetch("/api/auth/sign-out", { method: "POST" });
      const json = await res.json().catch(() => null);
      const traceId = json?.traceId ?? res.headers.get("x-trace-id");
      if (!res.ok) {
        return {
          ok: false as const,
          errorMessage: json?.error?.message ?? "Could not sign out. Please try again.",
          traceId,
        };
      }

      // Clear local session/cookie state owned by the Better Auth Expo plugin.
      await (authClient as any).signOut?.();

      return { ok: true as const, traceId };
    },
  });
}

export function getBetterAuthResultTraceId(result: unknown): string | null {
  return extractTraceId(result as any);
}

