export type Agent = "codex" | "claude";
export type InstallLocation = "global" | "local";
export type Command = "install" | "help";

export interface CliOptions {
  help: boolean;
  yes: boolean;
  agents: Agent[];
  locations: InstallLocation[];
  skills: string[];
  groups: string[];
}

export interface ParseArgsResult {
  command: Command;
  options: CliOptions;
}

export interface PromptChoice<T extends string = string> {
  value: T;
  label: string;
  description: string;
}

export interface PromptSession {
  ask(question: string): Promise<string>;
  close(): Promise<void>;
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
