import { readFile } from "node:fs/promises";
import * as path from "node:path";
import type { PackageConfig, ProjectDocsCatalog, ProjectDocsDocument } from "./types.js";

interface RawProjectDocsEntry {
  id?: unknown;
  label?: unknown;
  description?: unknown;
}

interface RawProjectDocsCatalog {
  version?: unknown;
  documents?: unknown;
}

function validateDocumentEntry(rawEntry: unknown, index: number): ProjectDocsDocument {
  if (!rawEntry || typeof rawEntry !== "object") {
    throw new Error(`Project docs catalog document #${index + 1} must be an object.`);
  }

  const entry = rawEntry as RawProjectDocsEntry;
  if (typeof entry.id !== "string" || entry.id.trim() === "") {
    throw new Error(`Project docs catalog document #${index + 1} is missing a valid id.`);
  }

  if (typeof entry.label !== "string" || entry.label.trim() === "") {
    throw new Error(`Project docs catalog document "${entry.id}" is missing a valid label.`);
  }

  return {
    id: entry.id.trim(),
    label: entry.label.trim(),
    description:
      typeof entry.description === "string" && entry.description.trim() !== ""
        ? entry.description.trim()
        : ""
  };
}

export async function loadProjectDocsCatalog(config: PackageConfig): Promise<ProjectDocsCatalog> {
  const catalogPath = path.join(config.packageRoot, config.projectDocsCatalogPath);
  const rawCatalogText = await readFile(catalogPath, "utf8");
  const rawCatalog = JSON.parse(rawCatalogText) as RawProjectDocsCatalog;

  if (rawCatalog.version !== 1) {
    throw new Error(`Project docs catalog "${config.projectDocsCatalogPath}" must use version 1.`);
  }

  if (!Array.isArray(rawCatalog.documents)) {
    throw new Error(`Project docs catalog "${config.projectDocsCatalogPath}" must contain a documents array.`);
  }

  return {
    version: 1,
    documents: rawCatalog.documents.map((entry, index) => validateDocumentEntry(entry, index))
  };
}
