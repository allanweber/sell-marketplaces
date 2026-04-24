import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";
import * as SecureStore from "expo-secure-store";

const baseURL = process.env.EXPO_PUBLIC_WEB_BASE_URL ?? "http://localhost:3000";
const scheme = process.env.EXPO_PUBLIC_APP_SCHEME ?? "sellitems";

export const authClient = createAuthClient({
  baseURL,
  plugins: [
    expoClient({
      scheme,
      storagePrefix: "sell-items",
      storage: SecureStore,
    }),
  ],
});

