// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

// Find the workspace root, this can be replaced with `find-yarn-workspace-root`
const workspaceRoot = path.resolve(__dirname, "../..");
const projectRoot = __dirname;

const config = getDefaultConfig(projectRoot);

// 1. Watch all files within the monorepo
config.watchFolders = [workspaceRoot];
// 2. Let Metro know where to resolve packages, and in what order
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];

// 3. Support "@/..." import alias (project root)
// Metro doesn't treat `extraNodeModules` as a prefix alias, so we map `@` to
// the app root and allow subpaths via `@/foo` resolution.
config.resolver.extraNodeModules = {
  ...(config.resolver.extraNodeModules ?? {}),
  "@": projectRoot,
};

const originalResolveRequest = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName.startsWith("@/")) {
    const mapped = path.join(projectRoot, moduleName.slice(2));
    if (originalResolveRequest) {
      return originalResolveRequest(context, mapped, platform);
    }
    return context.resolveRequest(context, mapped, platform);
  }
  if (originalResolveRequest) {
    return originalResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
