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
4. `Install plugin`
5. `Install mcp`
6. `Cancel`

Controls:

- `← →` switch tabs
- `↑ ↓` move
- `space` or `enter` select
- `q` or `esc` cancel

`Install agent skills`
- installs selected skills into `~/.codex`, `~/.claude`, `./.codex`, or `./.claude`

`Install project docs`
- copies the contents inside the selected docs folder into the current working directory

`Install libs for AI`
- opens a guided workflow with tabs for `Libraries`, `Agents`, `OS`, `Scope`, `Mode`, and `Review`
- supports `rtk-ai/rtk`, `rtk-ai/icm`, and `affaan-m/ECC`
- runs the current upstream install flow for each selected library and prints safety notes when an upstream flow is broader than the selected agent or scope
- for `ECC`, clones the upstream repo into a temporary directory and runs the documented repo-based setup flow for the selected agent, with warnings about the documented Claude plugin overlap

`Install plugin`
- opens a guided workflow with tabs for `Plugins`, `Agents`, `Mode`, and `Review`
- currently supports `Lumin`
- loads the plugin bundle from the repository `plugins` branch at runtime, so the main branch CLI can install it without vendoring the plugin files into `main`
- supports `Install` and `Uninstall`
- installs plugins in global mode only

`Install mcp`
- opens a guided workflow with tabs for `Select MCP`, `Agent`, `Mode`, and `Review`
- supports `Ant Design`, `GitLab`, `GitHub`, `Figma`, and `Shadcn`
- supports selecting `Codex`, `Claude`, or both in the same run
- supports `Install` and `Uninstall`
- builds commands from current official MCP setup docs, executes the selected plan, and prints any extra configuration still required after install
- in `Uninstall`, runs a safety preflight so removals target only the expected scope/config and warn when similarly named entries exist elsewhere
