import { authClient } from "./auth-client";
import { generateTraceId } from "@sell-items/domain";

function getBaseURL(): string {
  const raw = process.env.EXPO_PUBLIC_WEB_BASE_URL ?? "http://localhost:3000";
  try {
    // Validate it is a real absolute URL.
    // eslint-disable-next-line no-new
    new URL(raw);
    return raw;
  } catch {
    return "http://localhost:3000";
  }
}

export async function apiFetch(
  path: string,
  init: RequestInit = {},
) {
  const cookies = authClient.getCookie();
  const headers = new Headers(init.headers);

  if (!headers.has("x-trace-id")) {
    headers.set("x-trace-id", generateTraceId());
  }

  if (cookies) headers.set("Cookie", cookies);

  const baseURL = getBaseURL();
  const baseOrigin = new URL(baseURL).origin;

  // Under our strict CSRF/origin policy, native sends an origin-like header that matches
  // the web base URL origin, not the custom scheme.
  if (!headers.has("Origin")) {
    headers.set("Origin", baseOrigin);
  }

  // Prevent accidentally sending auth cookies to arbitrary hosts.
  // Only allow absolute-path relative URLs.
  if (!path.startsWith("/")) {
    throw new Error("apiFetch only supports absolute-path relative URLs (starting with '/').");
  }

  const url = new URL(path, baseURL);
  if (url.origin !== baseOrigin) {
    throw new Error("apiFetch refused to send request to a different origin.");
  }

  return fetch(url.toString(), {
    ...init,
    headers,
    credentials: "omit",
  });
}

