import { defineConfig, globalIgnores } from "eslint/config";
import tseslintParser from "@typescript-eslint/parser";

export default defineConfig([
  globalIgnores([".expo/**", "dist/**", "build/**", "node_modules/**"]),
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tseslintParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
  },
  {
    files: ["**/*.tsx"],
    rules: {
      "no-restricted-globals": [
        "error",
        {
          name: "fetch",
          message:
            "Do not call fetch() in React components. Use TanStack React Query + the shared API module (e.g. lib/api.ts).",
        },
      ],
    },
  },
]);

