# ai-tools

`@minhluudev/ai-tools` is an npm CLI that installs AI skills from GitHub branches in this repository into Codex and Claude.

## Install

```bash
npm install -g @minhluudev/ai-tools
ai-tools install
```

## Supported Flow

The interactive installer asks for:

1. Individual skills from the `skill-general` branch
2. Skill groups from other branches such as `laravel-ddd`
3. Installation location: `global` or `local`
4. Target agent: `codex` or `claude`

Global installs write into:

- `~/.codex`
- `~/.claude`

Local installs write into:

- `./.codex`
- `./.claude`

## Manifest Contract

Each source branch must expose `ai-tools.catalog.json` at the branch root.

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
  --location local \
  --agent codex \
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
