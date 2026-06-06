import { checkbox, confirm, select } from "@inquirer/prompts";
import type {
  PromptConfirmOptions,
  PromptMultiSelectOptions,
  PromptSession,
  PromptSingleSelectOptions
} from "./types.js";

const PROMPT_CONTEXT = {
  clearPromptOnDone: true
} as const;

export function createPromptSession(): PromptSession {
  return {
    async ask(): Promise<string> {
      throw new Error("PromptSession.ask is not used with checkbox/select prompts.");
    },
    async close(): Promise<void> {
      // No-op. @inquirer/prompts manages its own lifecycle.
    }
  };
}

export async function promptMultiSelect<T extends string>(
  _prompt: PromptSession,
  options: PromptMultiSelectOptions<T>
): Promise<T[]> {
  if (options.choices.length === 0) {
    return [];
  }

  const selectedValues = await checkbox<T>({
    message: options.message,
    choices: options.choices.map((choice) => ({
      value: choice.value,
      name: choice.label,
      description: choice.description
    })),
    required: !(options.allowEmpty ?? false)
  }, PROMPT_CONTEXT);

  if (selectedValues.length === 0 && !(options.allowEmpty ?? false)) {
    throw new Error("At least one option must be selected.");
  }

  return selectedValues;
}

export async function promptSingleSelect<T extends string>(
  _prompt: PromptSession,
  options: PromptSingleSelectOptions<T>
): Promise<T> {
  if (options.choices.length === 0) {
    throw new Error(`No choices available for "${options.message}".`);
  }

  if (options.choices.length === 1) {
    return options.choices[0].value;
  }

  return select<T>({
    message: options.message,
    choices: options.choices.map((choice) => ({
      value: choice.value,
      name: choice.label,
      description: choice.description
    }))
  }, PROMPT_CONTEXT);
}

export async function promptConfirm(
  _prompt: PromptSession,
  options: PromptConfirmOptions
): Promise<boolean> {
  return confirm({
    message: options.message,
    default: options.defaultValue ?? false
  }, PROMPT_CONTEXT);
}
