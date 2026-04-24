import { useMutation } from "@tanstack/react-query";

import { apiPostJson, apiPostNoBody } from "@/lib/api-client";

export function useSignInMutation() {
  return useMutation({
    mutationFn: async (args: { email: string; password: string }) =>
      apiPostJson<unknown>("/api/auth/sign-in", args),
  });
}

export function useSignUpMutation() {
  return useMutation({
    mutationFn: async (args: { name: string; email: string; password: string }) =>
      apiPostJson<unknown>("/api/auth/sign-up", args),
  });
}

export function useSignOutMutation() {
  return useMutation({
    mutationFn: async () => apiPostNoBody<unknown>("/api/auth/sign-out"),
  });
}

