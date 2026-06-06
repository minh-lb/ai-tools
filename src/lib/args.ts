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
    agent: undefined,
    location: undefined,
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
      if (!isAgent(value)) {
        throw new Error(`Invalid agent "${value}". Use "codex" or "claude".`);
      }
      options.agent = value;
      continue;
    }

    if (key === "location") {
      if (!isInstallLocation(value)) {
        throw new Error(`Invalid location "${value}". Use "global" or "local".`);
      }
      options.location = value;
    }
  }

  return { command, options };
}

export function printHelp(): void {
  console.log(`ai-tools

Usage:
  ai-tools install [options]
  ai-tools help

Options:
  --skills <ids>      Comma-separated individual skill ids
  --groups <ids>      Comma-separated group ids
  --location <type>   global | local
  --agent <agent>     codex | claude
  --yes               Skip overwrite prompts
  --help, -h          Show help
`);
}
