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
            },
            pi: {
              type: "directory",
              outputPath: "skills/skill-1"
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
  assert.equal(manifest.items[0].targets.pi?.outputPath, "skills/skill-1");
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
      },
      {
        id: "document-writer",
        label: "Document Writer",
        description: "Technical document authoring and review",
        sourceBranch: "agent-skills",
        sourcePath: "document-writer"
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
      github: client.config
    },
    selectionCatalog,
    selectedSkillIds: ["git-workflow", "document-writer"],
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
        },
        pi: {
          type: "directory"
        }
      }
    },
    {
      id: "document-writer",
      label: "Document Writer",
      description: "Technical document authoring and review",
      sourceBranch: "agent-skills",
      sourcePath: "document-writer",
      targets: {
        codex: { type: "directory" },
        claude: { type: "directory" },
        pi: { type: "directory" }
      }
    }
  ]);
});

test("loadSelectionCatalog includes curated local skills in installer choices", async () => {
  const catalog = await loadSelectionCatalog({
    packageRoot: process.cwd(),
    selectionCatalogPath: "selection-catalog.json",
    github: {
      owner: "minhluudev",
      repo: "ai-tools",
      defaultBranch: "main",
      skillsBranch: "skill-general",
      manifestPath: "ai-tools.catalog.json",
      excludeBranches: ["main", "master"]
    }
  });

  assert.deepEqual(
    catalog.skills.map((skill) => skill.id),
    [
      "developer",
      "document-writer",
      "generate-flow",
      "git-workflow",
      "reviewer",
      "solutions-architect",
      "task-creator",
      "tester"
    ]
  );

  assert.deepEqual(
    catalog.skills.find((skill) => skill.id === "developer"),
    {
      id: "developer",
      label: "Developer",
      description: "Implement features, fix bugs, refactor code, or change tests in an existing repository. Verify the resulting behavior.",
      sourceBranch: "agent-skills",
      sourcePath: "developer",
      targets: undefined
    }
  );

  assert.deepEqual(
    catalog.skills.find((skill) => skill.id === "document-writer"),
    {
      id: "document-writer",
      label: "Document Writer",
      description: "Apply when writing, explaining, summarizing, rewriting, or presenting user-facing answers and technical documents. Make content relevant, plain-language, concise, accurate, and easy for a non-developer to understand and review. This is a communication/output quality skill, not a document-planning workflow.",
      sourceBranch: "agent-skills",
      sourcePath: "document-writer",
      targets: undefined
    }
  );

  assert.deepEqual(
    catalog.skills.find((skill) => skill.id === "tester"),
    {
      id: "tester",
      label: "Tester",
      description: "Write unit, integration, and E2E tests, author feature-level E2E test case documents, or run and diagnose existing tests and interactive frontend checks.",
      sourceBranch: "agent-skills",
      sourcePath: "tester",
      targets: undefined
    }
  );

  assert.deepEqual(
    catalog.skills.find((skill) => skill.id === "git-workflow"),
    {
      id: "git-workflow",
      label: "Git workflow",
      description: "Use when handling Git branches, commits, pushes, PR/MRs, merges, conflicts, releases, or worktrees. Load before every Git operation, including read-only checks; require explicit permission for commits and pushes.",
      sourceBranch: "agent-skills",
      sourcePath: "git-workflow",
      targets: undefined
    }
  );

  assert.deepEqual(
    catalog.skills.find((skill) => skill.id === "reviewer"),
    {
      id: "reviewer",
      label: "Reviewer",
      description: "Use only when reviewer is explicitly requested for code, technical documents, GitHub PRs, GitLab MRs, or a named workflow handoff.",
      sourceBranch: "agent-skills",
      sourcePath: "reviewer",
      targets: undefined
    }
  );

  assert.deepEqual(
    catalog.skills.find((skill) => skill.id === "solutions-architect"),
    {
      id: "solutions-architect",
      label: "Solutions Architect",
      description: "Design or review solution architecture for software systems, infrastructure, cloud or on-premises deployments, data platforms, and system integrations. Use for architecture outlines, consequential design decisions, migrations, and implementation-readiness assessments.",
      sourceBranch: "agent-skills",
      sourcePath: "solutions-architect",
      targets: undefined
    }
  );

  assert.deepEqual(
    catalog.skills.find((skill) => skill.id === "task-creator"),
    {
      id: "task-creator",
      label: "Task Creator",
      description: "Draft and create a new backlog task, ticket, or issue in a task tracker or an explicitly requested local file. Use when the user asks to create, log, or file new work; do not trigger for ordinary implementation requests or updates to an existing task.",
      sourceBranch: "agent-skills",
      sourcePath: "task-creator",
      targets: undefined
    }
  );

  assert.deepEqual(
    catalog.skills.find((skill) => skill.id === "generate-flow"),
    {
      id: "generate-flow",
      label: "Generate Flow",
      description: "Create an evidence-backed flow document when the user asks to trace, map, document, or generate an end-to-end flow for a specific feature. Do not trigger on a generic question about how code works when no document is requested.",
      sourceBranch: "agent-skills",
      sourcePath: "generate-flow",
      targets: undefined
    }
  );

});
