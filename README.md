# ai-tools

`@minhluudev/ai-tools` is a personal CLI for installing the AI tools, agent skills, and project docs that I use in my own workflow.

## Install

```bash
npm install -g @minhluudev/ai-tools
```

## Usage

```bash
ai-tools
```

Main menu:

1. `Install agent skills`
2. `Install project docs`
3. `Install libs for AI`
4. `Install mcp`
5. `Cancel`

Controls:

- `← →` switch tabs
- `↑ ↓` move
- `space` or `enter` select
- `q` or `esc` cancel

`Install agent skills`
- installs selected skills into `~/.codex`, `~/.claude`, `./.codex`, or `./.claude`

`Install project docs`
- copies the contents inside the selected docs folder into the current working directory

`Install mcp`
- opens a guided workflow with tabs for `Select MCP`, `Agent`, `Mode`, and `Review`
- supports `Ant Design`, `GitLab`, `GitHub`, `Figma`, and `Shadcn`
- supports selecting `Codex`, `Claude`, or both in the same run
- supports `Install` and `Uninstall`
- builds commands from current official MCP setup docs, executes the selected plan, and prints any extra configuration still required after install
- in `Uninstall`, runs a safety preflight so removals target only the expected scope/config and warn when similarly named entries exist elsewhere
