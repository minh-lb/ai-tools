import type { Agent } from "./types.js";

export type AgentSelectionOption = Agent | "both";

export const AGENT_SELECTION_CHOICES: Array<{
  id: AgentSelectionOption;
  label: string;
  description: string;
}> = [
  {
    id: "codex",
    label: "◇  Codex",
    description: "Install as Codex skills."
  },
  {
    id: "claude",
    label: "◇  Claude",
    description: "Install as Claude custom agents."
  },
  {
    id: "pi",
    label: "◇  Pi",
    description: "Install as Pi skills."
  },
  {
    id: "both",
    label: "◇  Both (Codex + Claude)",
    description: "Install for both Codex and Claude."
  }
];

const BOTH_AGENTS: Agent[] = ["codex", "claude"];
const ALL_AGENTS: Agent[] = ["codex", "claude", "pi"];

export function isAgentOptionSelected(
  option: AgentSelectionOption,
  selectedAgents: ReadonlySet<Agent>
): boolean {
  if (option === "both") {
    return BOTH_AGENTS.every((agent) => selectedAgents.has(agent));
  }

  return selectedAgents.has(option);
}

export function toggleAgentOption(
  selectedAgents: Set<Agent>,
  option: AgentSelectionOption
): void {
  if (option === "both") {
    if (BOTH_AGENTS.every((agent) => selectedAgents.has(agent))) {
      for (const agent of BOTH_AGENTS) {
        selectedAgents.delete(agent);
      }
    } else {
      for (const agent of BOTH_AGENTS) {
        selectedAgents.add(agent);
      }
    }
    return;
  }

  if (selectedAgents.has(option)) {
    selectedAgents.delete(option);
  } else {
    selectedAgents.add(option);
  }
}

export function toggleAllAgents(selectedAgents: Set<Agent>): void {
  if (ALL_AGENTS.every((agent) => selectedAgents.has(agent))) {
    selectedAgents.clear();
    return;
  }

  for (const agent of ALL_AGENTS) {
    selectedAgents.add(agent);
  }
}
