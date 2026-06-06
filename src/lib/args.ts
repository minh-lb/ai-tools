import type { Agent, CliOptions, Command, InstallLocation, ParseArgsResult } from "./types.js";

const COMMANDS: ReadonlySet<Command> = new Set(["install", "help"]);
const AGENTS: ReadonlySet<Agent> = new Set(["codex", "claude"]);
const LOCATIONS: ReadonlySet<InstallLocation> = new Set(["global", "local"]);
const FLAG_KEYS = new Set(["agent", "location", "skills", "groups"]);

function parseCsv(value: string): string[] {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function isAgent(value: string): value is Agent {
  return AGENTS.has(value as Agent);
}

export function isInstallLocation(value: string): value is InstallLocation {
  return LOCATIONS.has(value as InstallLocation);
}

export function parseArgs(argv: string[]): ParseArgsResult {
  let command: Command = "install";
  const options: CliOptions = {
    help: false,
    yes: false,
    agents: [],
    locations: [],
    skills: [],
    groups: []
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];

    if (token === "--help" || token === "-h") {
      options.help = true;
      continue;
    }

    if (token === "--yes") {
      options.yes = true;
      continue;
    }

    if (!token.startsWith("--")) {
      if (COMMANDS.has(token as Command)) {
        command = token as Command;
        continue;
      }

      throw new Error(`Unknown argument "${token}".`);
    }

    const key = token.slice(2);
    if (!FLAG_KEYS.has(key)) {
      throw new Error(`Unknown flag "${token}".`);
    }

    const value = argv[index + 1];
    if (!value || value.startsWith("--")) {
      throw new Error(`Flag "${token}" requires a value.`);
    }

    index += 1;

    if (key === "skills" || key === "groups") {
      options[key] = parseCsv(value);
      continue;
    }

    if (key === "agent") {
      const agents = parseCsv(value);
      if (agents.some((agent) => !isAgent(agent))) {
        throw new Error(`Invalid agent list "${value}". Use "codex" and/or "claude".`);
      }
      options.agents = agents as Agent[];
      continue;
    }

    if (key === "location") {
      const locations = parseCsv(value);
      if (locations.some((location) => !isInstallLocation(location))) {
        throw new Error(`Invalid location list "${value}". Use "global" and/or "local".`);
      }
      options.locations = locations as InstallLocation[];
    }
  }

  return { command, options };
}

export function printHelp(): void {
  console.log(`ai-tools

Usage:
  ai-tools
  ai-tools install [options]
  ai-tools help

Default behavior:
  Running "ai-tools" in an interactive terminal opens a top-level menu.
  Running "ai-tools install" starts the skills installer directly.

Options:
  --skills <ids>      Comma-separated individual skill ids
  --groups <ids>      Comma-separated group ids
  --location <types>  Comma-separated: global,local
  --agent <agents>    Comma-separated: codex,claude
  --yes               Skip overwrite prompts
  --help, -h          Show help
`);
}
