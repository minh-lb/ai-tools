import { test } from "node:test";
import * as assert from "node:assert/strict";
import { mergeSelectedItems, validateManifest } from "../src/lib/catalog.js";

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
