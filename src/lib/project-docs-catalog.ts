import { readFile } from "node:fs/promises";
import * as path from "node:path";
import { normalizeManifestPath } from "./paths.js";
import type { PackageConfig, ProjectDocsCatalog, ProjectDocsSkill } from "./types.js";

interface RawProjectDocsEntry {
  id?: unknown;
  label?: unknown;
  description?: unknown;
  sourceBranch?: unknown;
  sourcePath?: unknown;
}

interface RawProjectDocsCatalog {
  version?: unknown;
  skills?: unknown;
}

function validateSkillEntry(rawEntry: unknown, index: number): ProjectDocsSkill {
  if (!rawEntry || typeof rawEntry !== "object") {
    throw new Error(`Project docs catalog skill #${index + 1} must be an object.`);
  }

  const entry = rawEntry as RawProjectDocsEntry;
  if (typeof entry.id !== "string" || entry.id.trim() === "") {
    throw new Error(`Project docs catalog skill #${index + 1} is missing a valid id.`);
  }

  if (typeof entry.label !== "string" || entry.label.trim() === "") {
    throw new Error(`Project docs catalog skill "${entry.id}" is missing a valid label.`);
  }

  const sourceBranch =
    typeof entry.sourceBranch === "string" && entry.sourceBranch.trim() !== ""
      ? entry.sourceBranch.trim()
      : undefined;
  const sourcePath =
    typeof entry.sourcePath === "string" && entry.sourcePath.trim() !== ""
      ? normalizeManifestPath(entry.sourcePath, `${entry.id}.sourcePath`)
      : undefined;

  return {
    id: entry.id.trim(),
    label: entry.label.trim(),
    description:
      typeof entry.description === "string" && entry.description.trim() !== ""
        ? entry.description.trim()
        : "",
    sourceBranch,
    sourcePath
  };
}

export async function loadProjectDocsCatalog(config: PackageConfig): Promise<ProjectDocsCatalog> {
  const catalogPath = path.join(config.packageRoot, config.projectDocsCatalogPath);
  const rawCatalogText = await readFile(catalogPath, "utf8");
  const rawCatalog = JSON.parse(rawCatalogText) as RawProjectDocsCatalog;

  if (rawCatalog.version !== 1) {
    throw new Error(`Project docs catalog "${config.projectDocsCatalogPath}" must use version 1.`);
  }

  if (!Array.isArray(rawCatalog.skills)) {
    throw new Error(`Project docs catalog "${config.projectDocsCatalogPath}" must contain a skills array.`);
  }

  return {
    version: 1,
    skills: rawCatalog.skills.map((entry, index) => validateSkillEntry(entry, index))
  };
}
