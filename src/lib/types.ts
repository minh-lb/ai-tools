export type Agent = "codex" | "claude";
export type InstallLocation = "global" | "local";
export type AiLibrary = "rtk" | "icm";
export type SupportedOs = "mac" | "linux";
export type InstallScope = "global" | "local";
export type LibraryMode = "install" | "uninstall";

export interface PromptChoice<T extends string = string> {
  value: T;
  label: string;
  description: string;
}

export interface PromptMultiSelectOptions<T extends string = string> {
  message: string;
  choices: PromptChoice<T>[];
  allowEmpty?: boolean;
}

export interface PromptSingleSelectOptions<T extends string = string> {
  message: string;
  choices: PromptChoice<T>[];
}

export interface PromptConfirmOptions {
  message: string;
  defaultValue?: boolean;
}

export interface BranchInfo {
  name: string;
  sha: string;
}

export interface TargetConfig {
  type: "directory" | "file";
  sourcePath?: string;
  outputPath?: string;
}

export interface ManifestItem {
  id: string;
  label: string;
  description: string;
  sourcePath: string;
  sourceBranch: string;
  sourceSha?: string;
  targets: Partial<Record<Agent, TargetConfig>>;
}

export interface ManifestFile {
  branch: string;
  manifestPath: string;
  type: "skills" | "group";
  label: string;
  description: string;
  items: ManifestItem[];
}

export interface SkillGroup {
  id: string;
  label: string;
  description: string;
  branch: string;
  items: ManifestItem[];
}

export interface CatalogIndex {
  individualSkills: ManifestItem[];
  groups: SkillGroup[];
  warnings: string[];
}

export interface SelectionSkill {
  id: string;
  label: string;
  description: string;
  sourceBranch?: string;
  sourcePath?: string;
  targets?: Partial<Record<Agent, TargetConfig>>;
}

export interface SelectionGroup {
  id: string;
  label: string;
  description: string;
  sourceBranch?: string;
}

export interface SelectionCatalog {
  version: 1;
  skills: SelectionSkill[];
  groups: SelectionGroup[];
}

export interface ProjectDocsSkill {
  id: string;
  label: string;
  description: string;
  sourceBranch?: string;
  sourcePath?: string;
}

export interface ProjectDocsCatalog {
  version: 1;
  skills: ProjectDocsSkill[];
}

export interface PackageGithubConfig {
  owner: string;
  repo: string;
  defaultBranch: string;
  skillsBranch: string;
  manifestPath: string;
  excludeBranches: string[];
}

export interface PackageConfig {
  packageRoot: string;
  github: PackageGithubConfig;
  selectionCatalogPath: string;
  projectDocsCatalogPath: string;
}

export interface GitHubClient {
  config: PackageGithubConfig;
  listBranches(): Promise<BranchInfo[]>;
  fetchManifest(input: {
    branch: string;
    sha: string;
    manifestPath: string;
  }): Promise<unknown>;
  getArchive(input: { branch: string; sha: string }): Promise<string>;
  extractArchiveEntry(input: {
    archivePath: string;
    entryPath: string;
    destinationDir: string;
  }): Promise<string>;
}

export interface PlannedInstallation extends ManifestItem {
  agent: Agent;
  targetType: "directory" | "file";
  outputPath: string;
  targetPath: string;
}

export interface InstallResult {
  id: string;
  targetPath: string;
}

export interface LibInstallStep {
  id: string;
  library: AiLibrary;
  phase: "install" | "configure" | "uninstall" | "cleanup";
  title: string;
  description: string;
  command: string;
  runner?: "shell" | "remove-binary" | "cleanup-icm-local";
  path?: string;
}

export interface LibInstallPlan {
  mode: LibraryMode;
  os: SupportedOs;
  hostOs: SupportedOs | null;
  scope: InstallScope;
  agents: Agent[];
  libraries: AiLibrary[];
  steps: LibInstallStep[];
  notes: string[];
}

export interface ProjectDocsPlannedInstallation {
  id: string;
  label: string;
  description: string;
  sourceBranch: string;
  sourcePath: string;
  targetPath: string;
}
