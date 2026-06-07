# ai-tools

`@minhluudev/ai-tools` is an npm CLI that installs AI skills from GitHub branches in this repository into Codex and Claude.

## Install

```bash
npm install -g @minhluudev/ai-tools
ai-tools install
```

By default, `ai-tools` and `ai-tools install` run as an interactive terminal UI when executed in a normal terminal. CLI options are only needed for non-interactive or scripted usage.
Use `← →` to switch tabs, `↑ ↓` to move within a tab, `space` or `enter` to toggle options, and `q` or `esc` to cancel. On the `Review` tab, `enter` confirms the highlighted action.

Running `ai-tools` now shows a top-level menu with:

1. `Install agent skills`
2. `Install project docs`
3. `Install libs for AI`
4. `Cancel`

`Install project docs` now opens its own terminal UI with two tabs: `Skills` and `Review`.
`Install libs for AI` is still a placeholder until that flow is implemented.

## Supported Flow

The interactive installer asks for:

1. Individual skills from the local selection catalog packaged with the CLI
2. Installation locations: `global`, `local`, or both
3. Target agents: `codex`, `claude`, or both
4. A review tab where you can confirm or cancel after navigating back and forth with the tab bar

The project docs installer asks for:

1. Skills from the local `project-docs-catalog.json`
2. A `Review` tab where you can confirm, go back to the main menu, or cancel

The wizard does not validate GitHub branches or manifests while you are selecting options. Source validation only starts after you confirm the review step.

Global installs write into:

- `~/.codex`
- `~/.claude`

Local installs write into:

- `./.codex`
- `./.claude`

## Manifest Contract

Each source branch must expose `ai-tools.catalog.json` at the branch root.

The menu shown by the wizard is driven by `selection-catalog.json` in this package. Update that file when you add or rename installable skills.

```json
{
  "version": 1,
  "type": "skills",
  "label": "General Skills",
  "description": "Standalone skills",
  "items": [
    {
      "id": "git-engineering-workflow",
      "label": "Git engineering workflow",
      "description": "Folder: git-engineering-workflow",
      "sourcePath": "skills/git-engineering-workflow",
      "targets": {
        "codex": {
          "type": "directory",
          "outputPath": "skills/git-engineering-workflow"
        },
        "claude": {
          "type": "file",
          "outputPath": "agents/git-engineering-workflow.md"
        }
      }
    }
  ]
}
```

Rules:

- `agent-skills` must use `"type": "skills"`
- group branches must use `"type": "group"`
- `sourcePath` and `outputPath` must stay inside the repository or install root
- each selected skill id must be unique across the final merged selection

## Non-Interactive Usage

```bash
ai-tools install \
  --skills git-engineering-workflow,review-code \
  --location local,global \
  --agent codex,claude \
  --yes
```

## CI/CD

GitHub Actions includes:

- `.github/workflows/ci.yml` for test and package validation on `push` to `main` and all pull requests
- `.github/workflows/publish.yml` for npm publish on tags matching `v*.*.*` and manual dispatch

To publish successfully, configure the repository secret `NPM_TOKEN` with publish access to the target npm package.

For the first public publish of this scoped package, use:

```bash
npm publish --access public
```
