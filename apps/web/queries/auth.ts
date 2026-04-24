import { useMutation } from "@tanstack/react-query";

import { apiPostJson, apiPostNoBody } from "@/lib/api-client";

export function useSignInMutation(args: { email: string; password: string }) {
  return useMutation({
    mutationFn: async () => apiPostJson<unknown>("/api/auth/sign-in", args),
  });
}

export function useSignUpMutation(args: { name: string; email: string; password: string }) {
  return useMutation({
    mutationFn: async () => apiPostJson<unknown>("/api/auth/sign-up", args),
  });
}

export function useSignOutMutation() {
  return useMutation({
    mutationFn: async () => apiPostNoBody<unknown>("/api/auth/sign-out"),
  });
}

