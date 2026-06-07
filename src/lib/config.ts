import { readFile } from "node:fs/promises";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import type { PackageConfig } from "./types.js";

const PACKAGE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");

interface PackageJsonShape {
  aiTools?: {
    github?: Partial<PackageConfig["github"]>;
    selectionCatalogPath?: string;
    projectDocsCatalogPath?: string;
  };
}

export async function loadPackageConfig(): Promise<PackageConfig> {
  const packageJsonPath = path.join(PACKAGE_ROOT, "package.json");
  const rawPackageJson = await readFile(packageJsonPath, "utf8");
  const packageJson = JSON.parse(rawPackageJson) as PackageJsonShape;
  const aiTools = packageJson.aiTools;

  if (!aiTools?.github?.owner || !aiTools.github.repo) {
    throw new Error("package.json is missing aiTools.github.owner or aiTools.github.repo.");
  }

  return {
    packageRoot: PACKAGE_ROOT,
    selectionCatalogPath: aiTools.selectionCatalogPath || "selection-catalog.json",
    projectDocsCatalogPath: aiTools.projectDocsCatalogPath || "project-docs-catalog.json",
    github: {
      owner: aiTools.github.owner,
      repo: aiTools.github.repo,
      defaultBranch: aiTools.github.defaultBranch || "main",
      skillsBranch: aiTools.github.skillsBranch || "skill-general",
      manifestPath: aiTools.github.manifestPath || "ai-tools.catalog.json",
      excludeBranches: aiTools.github.excludeBranches || ["main", "master"]
    }
  };
}
