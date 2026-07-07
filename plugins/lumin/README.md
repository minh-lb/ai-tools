# Lumin

Lumin dong goi cac skill tu nhanh `agent-skills` de dung tren ca Codex va Claude Code.

Lumin khong commit ban sao skill vao nhanh nay. Nhanh nay chi giu plugin wrapper va script installer. Luc cai dat, script se hydrate skill tu nhanh `agent-skills` vao local workspace tam thoi.

Ngoai explicit surface, Lumin con cai them mot lop **auto-apply**:

- Claude Code: cai skill namespaced vao `.agents/skills/lumin-*`
- Codex: cai skill namespaced vao `.codex/skills/lumin-*`
- dong thoi them `@./.lumin/AGENTS.lumin.md` vao `AGENTS.md` de host uu tien chon skill Lumin theo ngu canh, giong cach ECC hoat dong

## Surface

- Codex: `$lumin:<skill-name>`
- Claude Code: `/lumin:<skill-name>`

## Skills hien co

- `backend-testcase-writer`
- `bugfix`
- `business-analyst`
- `debugger`
- `domain-driven-design`
- `git-workflow`
- `review-code`
- `team-full`
- `team-mini`

## Cai vao Codex

```bash
plugins/lumin/scripts/install-codex.sh
```

Script nay:

- hydrate skill tu nhanh `agent-skills` vao `plugins/lumin/skills` tam thoi
- them marketplace repo-local tu repo root, noi Codex se tu doc `/.agents/plugins/marketplace.json`
- cai plugin `lumin@lumin-local`
- xoa lai bo skill da hydrate khoi working tree sau khi cai xong

Sau khi cai, mo thread moi va go:

```text
Use $lumin:bugfix to ...
```

## Go khoi Codex

```bash
plugins/lumin/scripts/uninstall-codex.sh
```

## Cai vao Claude Code

```bash
plugins/lumin/scripts/install-claude.sh
```

Mac dinh script cai theo project:

- hydrate skill tu nhanh `agent-skills` vao thu muc tam
- copy skills vao `./.lumin/skills`
- materialize skill auto-apply vao `./.agents/skills/lumin-*`
- generate va copy slash commands vao `./.claude/commands`
- them instruction layer vao `AGENTS.md`

Moi command `/lumin:<skill-name>` se doc file skill tu `../../.lumin/skills/<skill-name>/SKILL.md`.

Neu can cai global:

```bash
plugins/lumin/scripts/install-claude.sh --global
```

## Go khoi Claude Code

Theo project:

```bash
plugins/lumin/scripts/uninstall-claude.sh
```

Global:

```bash
plugins/lumin/scripts/uninstall-claude.sh --global
```

## Dong bo lai tu nhanh agent-skills

```bash
plugins/lumin/scripts/sync-agent-skills.sh
```

Script nay:

- materialize bo skill local tu nhanh `agent-skills` vao `plugins/lumin/skills`
- generate local command shims vao `plugins/lumin/commands`
- phu hop cho inspect/debug, khong can thiet cho runtime binh thuong

## Ghi chu

- Claude Code khong doc `plugin.json` cua Codex. Lumin giai quyet bang cach hydrate skill tu `agent-skills` roi tao slash-command shim rieng cho Claude.
- Codex tu dong prefix skill theo ten plugin, nen skill `bugfix` thanh `$lumin:bugfix`.
- De auto-apply giong ECC, Lumin cai them instruction layer va skill surface namespaced theo host.
