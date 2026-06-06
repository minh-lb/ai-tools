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
2. `Install libs for AI`

The second option is currently a placeholder and exits with a clear message until the libs install flow is implemented.

## Supported Flow

The interactive installer asks for:

1. Individual skills from the local selection catalog packaged with the CLI
2. Skill groups from the same local selection catalog, shown in the same `Skills` tab
3. Installation locations: `global`, `local`, or both
4. Target agents: `codex`, `claude`, or both
5. A review tab where you can confirm or cancel after navigating back and forth with the tab bar

The wizard does not validate GitHub branches or manifests while you are selecting options. Source validation only starts after you confirm the review step.

Global installs write into:

- `~/.codex`
- `~/.claude`

Local installs write into:

- `./.codex`
- `./.claude`

## Manifest Contract

Each source branch must expose `ai-tools.catalog.json` at the branch root.

The menu shown by the wizard is driven by `selection-catalog.json` in this package. Update that file when you add or rename installable skills/groups.

```json
{
  "version": 1,
  "type": "skills",
  "label": "General Skills",
  "description": "Standalone skills",
  "items": [
    {
      "id": "laravel-code-reviewer",
      "label": "Laravel Code Reviewer",
      "description": "Review Laravel and PHP changes",
      "sourcePath": "skills/laravel-code-reviewer",
      "targets": {
        "codex": {
          "type": "directory",
          "outputPath": "skills/laravel-code-reviewer"
        },
        "claude": {
          "type": "file",
          "outputPath": "agents/laravel-code-reviewer.md"
        }
      }
    }
  ]
}
```

Rules:

- `skill-general` must use `"type": "skills"`
- group branches must use `"type": "group"`
- `sourcePath` and `outputPath` must stay inside the repository or install root
- each selected skill id must be unique across the final merged selection

## Non-Interactive Usage

```bash
ai-tools install \
  --skills laravel-code-reviewer,mql5-ui-designer \
  --groups laravel-ddd \
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
