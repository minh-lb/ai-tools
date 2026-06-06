import * as path from "node:path";

export function normalizeManifestPath(input: string, label: string): string {
  if (typeof input !== "string" || input.trim() === "") {
    throw new Error(`${label} must be a non-empty string.`);
  }

  const normalized = path.posix.normalize(input.trim());
  if (
    normalized === "." ||
    normalized.startsWith("../") ||
    normalized.includes("/../") ||
    normalized.startsWith("/")
  ) {
    throw new Error(`${label} must stay inside the repository root.`);
  }

  return normalized;
}

export function resolveInsideRoot(rootPath: string, relativePath: string): string {
  const absolutePath = path.resolve(rootPath, relativePath);
  const relativeFromRoot = path.relative(rootPath, absolutePath);

  if (
    relativeFromRoot === ".." ||
    relativeFromRoot.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relativeFromRoot)
  ) {
    throw new Error(`Resolved path escapes install root: ${relativePath}`);
  }

  return absolutePath;
}
