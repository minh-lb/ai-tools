import { test } from "node:test";
import * as assert from "node:assert/strict";
import { loadCatalogIndex, mergeSelectedItems, validateManifest } from "../src/lib/catalog.js";
import { loadSelectionCatalog, resolveSelectionItems } from "../src/lib/selection-catalog.js";
import type { GitHubClient } from "../src/lib/types.js";

test("validateManifest normalizes a valid manifest", () => {
  const manifest = validateManifest(
    {
      version: 1,
      type: "skills",
      label: "General Skills",
      items: [
        {
          id: "skill-1",
          label: "Skill One",
          description: "A test skill",
          sourcePath: "skills/skill-1",
          targets: {
            codex: {
              type: "directory",
              outputPath: "skills/skill-1"
            },
            claude: {
              type: "file",
              outputPath: "agents/skill-1.md"
            }
          }
        }
      ]
    },
    {
      branch: "skill-general",
      manifestPath: "ai-tools.catalog.json"
    }
  );

  assert.equal(manifest.label, "General Skills");
  assert.equal(manifest.items[0].sourceBranch, "skill-general");
  assert.equal(manifest.items[0].targets.claude?.outputPath, "agents/skill-1.md");
});

test("mergeSelectedItems deduplicates identical items", () => {
  const skill = {
    id: "skill-1",
    label: "Skill One",
    description: "",
    sourceBranch: "skill-general",
    sourcePath: "skills/skill-1",
    targets: {
      codex: {
        type: "directory" as const,
        outputPath: "skills/skill-1"
      }
    }
  };

  const result = mergeSelectedItems({
    individualSkills: [skill],
    groups: [
      {
        id: "group-1",
        label: "Group One",
        description: "",
        branch: "group-1",
        items: [skill]
      }
    ],
    selectedSkillIds: ["skill-1"],
    selectedGroupIds: ["group-1"]
  });

  assert.equal(result.length, 1);
  assert.equal(result[0].id, "skill-1");
});

test("mergeSelectedItems rejects conflicting duplicate ids", () => {
  assert.throws(
    () =>
      mergeSelectedItems({
        individualSkills: [
          {
            id: "skill-1",
            label: "Skill One",
            description: "",
            sourceBranch: "skill-general",
            sourcePath: "skills/skill-1",
            targets: {
              codex: {
                type: "directory" as const,
                outputPath: "skills/skill-1"
              }
            }
          }
        ],
        groups: [
          {
            id: "group-1",
            label: "Group One",
            description: "",
            branch: "group-1",
            items: [
              {
                id: "skill-1",
                label: "Skill One Override",
                description: "",
                sourceBranch: "laravel-ddd",
                sourcePath: "skills/skill-1-alt",
                targets: {
                  codex: {
                    type: "directory" as const,
                    outputPath: "skills/skill-1"
                  }
                }
              }
            ]
          }
        ],
        selectedSkillIds: ["skill-1"],
        selectedGroupIds: ["group-1"]
      }),
    /multiple incompatible sources/
  );
});

test("loadCatalogIndex falls back to default branch when configured skills branch is missing", async () => {
  const client: GitHubClient = {
    config: {
      owner: "minhluudev",
      repo: "ai-tools",
      defaultBranch: "main",
      skillsBranch: "skill-general",
      pluginsBranch: "plugins",
      manifestPath: "ai-tools.catalog.json",
      excludeBranches: ["main", "master"]
    },
    async listBranches() {
      return [{ name: "main", sha: "abc123" }];
    },
    async fetchManifest(input) {
      if (input.branch !== "main") {
        throw new Error("missing");
      }

      return {
        version: 1,
        type: "skills",
        label: "General Skills",
        items: [
          {
            id: "skill-1",
            label: "Skill One",
            sourcePath: "skills/skill-1",
            targets: {
              codex: {
                type: "directory"
              }
            }
          }
        ]
      };
    },
    async getArchive() {
      return "";
    },
    async extractArchiveEntry() {
      return "";
    }
  };

  const index = await loadCatalogIndex(client, client.config);

  assert.equal(index.individualSkills.length, 1);
  assert.match(index.warnings[0], /Falling back to "main"/);
});

test("loadCatalogIndex reports available branches when no manifest can be loaded", async () => {
  const client: GitHubClient = {
    config: {
      owner: "minhluudev",
      repo: "ai-tools",
      defaultBranch: "main",
      skillsBranch: "skill-general",
      pluginsBranch: "plugins",
      manifestPath: "ai-tools.catalog.json",
      excludeBranches: ["main", "master"]
    },
    async listBranches() {
      return [{ name: "main", sha: "abc123" }];
    },
    async fetchManifest() {
      throw new Error("missing");
    },
    async getArchive() {
      return "";
    },
    async extractArchiveEntry() {
      return "";
    }
  };

  await assert.rejects(
    () => loadCatalogIndex(client, client.config),
    /Expected "ai-tools\.catalog\.json".*Available branches: main/
  );
});

test("resolveSelectionItems loads manifests only after the user has made selections", async () => {
  const selectionCatalog = {
    version: 1 as const,
    skills: [
      {
        id: "skill-1",
        label: "Skill One",
        description: "A standalone skill"
      }
    ],
    groups: [
      {
        id: "group-1",
        label: "Group One",
        description: "A grouped install"
      }
    ]
  };

  const client: GitHubClient = {
    config: {
      owner: "minhluudev",
      repo: "ai-tools",
      defaultBranch: "main",
      skillsBranch: "skill-general",
      pluginsBranch: "plugins",
      manifestPath: "ai-tools.catalog.json",
      excludeBranches: ["main", "master"]
    },
    async listBranches() {
      return [];
    },
    async fetchManifest(input) {
      if (input.branch === "skill-general") {
        return {
          version: 1,
          type: "skills",
          items: [
            {
              id: "skill-1",
              label: "Skill One",
              sourcePath: "skills/skill-1",
              targets: {
                codex: {
                  type: "directory"
                }
              }
            }
          ]
        };
      }

      if (input.branch === "group-1") {
        return {
          version: 1,
          type: "group",
          items: [
            {
              id: "skill-2",
              label: "Skill Two",
              sourcePath: "skills/skill-2",
              targets: {
                codex: {
                  type: "directory"
                }
              }
            }
          ]
        };
      }

      throw new Error(`Unexpected branch ${input.branch}`);
    },
    async getArchive() {
      return "";
    },
    async extractArchiveEntry() {
      return "";
    }
  };

  const items = await resolveSelectionItems({
    client,
    config: {
      packageRoot: "/tmp/project",
      selectionCatalogPath: "selection-catalog.json",
      projectDocsCatalogPath: "project-docs-catalog.json",
      github: client.config
    },
    selectionCatalog,
    selectedSkillIds: ["skill-1"],
    selectedGroupIds: ["group-1"]
  });

  assert.deepEqual(
    items.map((item) => item.id),
    ["skill-1", "skill-2"]
  );
});

test("resolveSelectionItems supports direct branch folders without a manifest", async () => {
  const selectionCatalog = {
    version: 1 as const,
    skills: [
      {
        id: "git-workflow",
        label: "Git workflow",
        description: "Folder: git-workflow",
        sourceBranch: "agent-skills",
        sourcePath: "git-workflow"
      }
    ],
    groups: []
  };

  const client: GitHubClient = {
    config: {
      owner: "minhluudev",
      repo: "ai-tools",
      defaultBranch: "main",
      skillsBranch: "skill-general",
      pluginsBranch: "plugins",
      manifestPath: "ai-tools.catalog.json",
      excludeBranches: ["main", "master"]
    },
    async listBranches() {
      return [];
    },
    async fetchManifest() {
      throw new Error("manifest should not be loaded for direct branch folders");
    },
    async getArchive() {
      return "";
    },
    async extractArchiveEntry() {
      return "";
    }
  };

  const items = await resolveSelectionItems({
    client,
    config: {
      packageRoot: "/tmp/project",
      selectionCatalogPath: "selection-catalog.json",
      projectDocsCatalogPath: "project-docs-catalog.json",
      github: client.config
    },
    selectionCatalog,
    selectedSkillIds: ["git-workflow"],
    selectedGroupIds: []
  });

  assert.deepEqual(items, [
    {
      id: "git-workflow",
      label: "Git workflow",
      description: "Folder: git-workflow",
      sourceBranch: "agent-skills",
      sourcePath: "git-workflow",
      targets: {
        codex: {
          type: "directory"
        },
        claude: {
          type: "directory"
        }
      }
    }
  ]);
});

test("loadSelectionCatalog includes curated local skills in installer choices", async () => {
  const catalog = await loadSelectionCatalog({
    packageRoot: process.cwd(),
    selectionCatalogPath: "selection-catalog.json",
    projectDocsCatalogPath: "project-docs-catalog.json",
    github: {
      owner: "minhluudev",
      repo: "ai-tools",
      defaultBranch: "main",
      skillsBranch: "skill-general",
      pluginsBranch: "plugins",
      manifestPath: "ai-tools.catalog.json",
      excludeBranches: ["main", "master"]
    }
  });

  assert.deepEqual(
    catalog.skills.find((skill) => skill.id === "bugfix"),
    {
      id: "bugfix",
      label: "Bugfix",
      description: "Trace, isolate, and fix bugs — regressions, runtime errors, flaky issues, and performance defects.",
      sourceBranch: "agent-skills",
      sourcePath: "bugfix",
      targets: undefined
    }
  );

  assert.deepEqual(
    catalog.skills.find((skill) => skill.id === "debugger"),
    {
      id: "debugger",
      label: "Debugger",
      description: "Investigate code defects without applying a fix — root cause analysis and debugging handoff.",
      sourceBranch: "agent-skills",
      sourcePath: "debugger",
      targets: undefined
    }
  );

  assert.deepEqual(
    catalog.skills.find((skill) => skill.id === "business-analyst"),
    {
      id: "business-analyst",
      label: "Business analyst",
      description: "Analyze requirements and produce SRS documentation.",
      sourceBranch: "agent-skills",
      sourcePath: "business-analyst",
      targets: undefined
    }
  );

  assert.deepEqual(
    catalog.skills.find((skill) => skill.id === "domain-driven-design"),
    {
      id: "domain-driven-design",
      label: "Domain Driven Design",
      description: "Laravel backend module design using DDD layers, Actions, DTOs, repositories, and events.",
      sourceBranch: "agent-skills",
      sourcePath: "domain-driven-design",
      targets: undefined
    }
  );

  assert.deepEqual(
    catalog.skills.find((skill) => skill.id === "backend-testcase-writer"),
    {
      id: "backend-testcase-writer",
      label: "Backend testcase writer",
      description: "Write detailed backend testcase documents for API endpoints, services, repositories, and workers/consumers.",
      sourceBranch: "agent-skills",
      sourcePath: "backend-testcase-writer",
      targets: undefined
    }
  );

  assert.deepEqual(
    catalog.skills.find((skill) => skill.id === "git-workflow"),
    {
      id: "git-workflow",
      label: "Git workflow",
      description: "GitFlow-style git workflow — committing, branching, merging, PRs, releases, and conflict resolution.",
      sourceBranch: "agent-skills",
      sourcePath: "git-workflow",
      targets: undefined
    }
  );

  assert.deepEqual(
    catalog.skills.find((skill) => skill.id === "team-mini"),
    {
      id: "team-mini",
      label: "Team Mini",
      description: "Boot a Claude Code + Codex agent team (Leader + on-demand Coder). Waits for user task before running.",
      sourceBranch: "agent-skills",
      sourcePath: "team-mini",
      targets: undefined
    }
  );

  assert.deepEqual(
    catalog.skills.find((skill) => skill.id === "team-full"),
    {
      id: "team-full",
      label: "Team Full",
      description: "Full TDD agent team — spec → testcases → tests → implement → verify → review. Leader and Tester agents included.",
      sourceBranch: "agent-skills",
      sourcePath: "team-full",
      targets: undefined
    }
  );

  assert.deepEqual(
    catalog.skills.find((skill) => skill.id === "team-sp"),
    {
      id: "team-sp",
      label: "Team SP",
      description: "Superpowers-native agent team — Planner (brainstorming + writing-plans), Leader (executing-plans), Coder (Codex + verification). Best for complex or ambiguous tasks.",
      sourceBranch: "agent-skills",
      sourcePath: "team-sp",
      targets: undefined
    }
  );

  assert.deepEqual(
    catalog.skills.find((skill) => skill.id === "review-code"),
    {
      id: "review-code",
      label: "Review code",
      description: "Structured code review for backend services, APIs, and server-side code.",
      sourceBranch: "agent-skills",
      sourcePath: "review-code",
      targets: undefined
    }
  );

  assert.deepEqual(
    catalog.skills.find((skill) => skill.id === "make-task"),
    {
      id: "make-task",
      label: "Make Task",
      description: "Create or update structured task documents from Jira, Trello, Notion, Linear, GitHub Issues, or plain descriptions.",
      sourceBranch: "agent-skills",
      sourcePath: "make-task",
      targets: undefined
    }
  );

  assert.deepEqual(
    catalog.skills.find((skill) => skill.id === "generate-flow"),
    {
      id: "generate-flow",
      label: "Generate Flow",
      description: "Trace a feature's data and logic end-to-end through source code layers — from trigger to persistence, event emission, response, or failure.",
      sourceBranch: "agent-skills",
      sourcePath: "generate-flow",
      targets: undefined
    }
  );

  assert.deepEqual(
    catalog.skills.find((skill) => skill.id === "coding-rules"),
    {
      id: "coding-rules",
      label: "Coding Rules",
      description: "Mandatory coding rules for JavaScript, TypeScript, PHP, ReactJS, Laravel, Docker, and SQL, plus SOLID/OOP/Clean Code baselines.",
      sourceBranch: "agent-skills",
      sourcePath: "coding-rules",
      targets: undefined
    }
  );

  assert.deepEqual(
    catalog.skills.find((skill) => skill.id === "react-component-generator"),
    {
      id: "react-component-generator",
      label: "React Component Generator",
      description: "Create or refactor repo-aligned React components under components/**, with index.tsx, controller.ts, and style.module.css conventions.",
      sourceBranch: "agent-skills",
      sourcePath: "react-component-generator",
      targets: undefined
    }
  );
});
