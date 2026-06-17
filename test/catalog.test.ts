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
        id: "git-engineering-workflow",
        label: "Git engineering workflow",
        description: "Folder: git-engineering-workflow",
        sourceBranch: "agent-skills",
        sourcePath: "git-engineering-workflow"
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
      projectDocsCatalogPath: "project-docs-catalog.json",
      github: client.config
    },
    selectionCatalog,
    selectedSkillIds: ["git-engineering-workflow"],
    selectedGroupIds: []
  });

  assert.deepEqual(items, [
    {
      id: "git-engineering-workflow",
      label: "Git engineering workflow",
      description: "Folder: git-engineering-workflow",
      sourceBranch: "agent-skills",
      sourcePath: "git-engineering-workflow",
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
      manifestPath: "ai-tools.catalog.json",
      excludeBranches: ["main", "master"]
    }
  });

  assert.deepEqual(
    catalog.skills.find((skill) => skill.id === "bugfix"),
    {
      id: "bugfix",
      label: "Bugfix",
      description: "Folder: bugfix",
      sourceBranch: "agent-skills",
      sourcePath: "bugfix",
      targets: undefined
    }
  );

  assert.deepEqual(
    catalog.skills.find((skill) => skill.id === "trace-bug"),
    {
      id: "trace-bug",
      label: "Trace bug",
      description: "Folder: trace-bug",
      sourceBranch: "agent-skills",
      sourcePath: "trace-bug",
      targets: undefined
    }
  );

  assert.deepEqual(
    catalog.skills.find((skill) => skill.id === "business-analyst"),
    {
      id: "business-analyst",
      label: "Business analyst",
      description: "Folder: business-analyst",
      sourceBranch: "agent-skills",
      sourcePath: "business-analyst",
      targets: undefined
    }
  );
});
