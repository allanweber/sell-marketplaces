module.exports = {
  reactStrictMode: true,
  experimental: {
    externalDir: true,
  },
  transpilePackages: ["@repo/ui"],
  turbopack: {
    resolveAlias: {
      "react-native": "react-native-web",
    },
    resolveExtensions: [
      ".web.js",
      ".web.jsx",
      ".web.ts",
      ".web.tsx",
      ".js",
      ".jsx",
      ".ts",
      ".tsx",
      ".json",
    ],
  },
};
