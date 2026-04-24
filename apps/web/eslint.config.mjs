import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

export default defineConfig([
  ...nextVitals,
  globalIgnores([".next/**", "out/**", "build/**", "dist/**", "node_modules/**"]),
  {
    files: ["**/*.tsx"],
    rules: {
      "no-restricted-globals": [
        "error",
        {
          name: "fetch",
          message:
            "Do not call fetch() in React components. Use TanStack React Query + the shared API module (e.g. lib/api-client.ts).",
        },
      ],
    },
  },
]);

