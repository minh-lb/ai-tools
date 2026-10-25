## Project memory — ai-memory

- At the start of every project work session, check `.agents/ai-memory/project-config.json`. When present, invoke the installed `ai-memory` skill before project analysis or edits, even if the user's task does not mention memory. When absent, skip automatic memory use silently.
- Read project memory once per session and reuse it; reload only for missing context, a project change, or context loss. Validate identity and use only the configured `obsidian_mcp_name` server.
- This project authorizes automatic memory saves through that skill after meaningful verified progress, a durable decision, a new blocker, or completion, before the final response or a requested handoff. Save only new durable facts; skip pure chat, repeated status, and unchanged follow-ups.
- Honor explicit read-only or no-memory requests. On config, MCP, or ownership failure, stop memory operations, report the limitation once, and continue work that does not depend on it. Report any partial save accurately; retry automatically only when the cause changes, or when the user requests it.
