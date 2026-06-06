import * as process from "node:process";
import { createInterface } from "node:readline/promises";
import type {
  PromptChoice,
  PromptConfirmOptions,
  PromptMultiSelectOptions,
  PromptSession,
  PromptSingleSelectOptions
} from "./types.js";

export function createPromptSession(): PromptSession {
  const readline = createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return {
    async ask(question: string): Promise<string> {
      return readline.question(question);
    },
    async close(): Promise<void> {
      readline.close();
    }
  };
}

function parseNumericSelection(input: string, maxIndex: number, allowEmpty: boolean): number[] {
  const trimmed = input.trim();
  if (trimmed === "") {
    if (allowEmpty) {
      return [];
    }
    throw new Error("At least one option must be selected.");
  }

  if (trimmed.toLowerCase() === "all") {
    return Array.from({ length: maxIndex }, (_, index) => index + 1);
  }

  const rawValues = trimmed.split(",").map((item) => item.trim());
  const indexes = new Set<number>();

  for (const rawValue of rawValues) {
    const number = Number.parseInt(rawValue, 10);
    if (!Number.isInteger(number) || number < 1 || number > maxIndex) {
      throw new Error(`"${rawValue}" is not a valid selection.`);
    }
    indexes.add(number);
  }

  return [...indexes].sort((a, b) => a - b);
}

function printChoices<T extends string>(message: string, choices: PromptChoice<T>[]): void {
  console.log("");
  console.log(message);
  for (const [index, choice] of choices.entries()) {
    console.log(`${index + 1}. ${choice.label}`);
    console.log(`   ${choice.description}`);
  }
}

export async function promptMultiSelect<T extends string>(
  prompt: PromptSession,
  options: PromptMultiSelectOptions<T>
): Promise<T[]> {
  if (options.choices.length === 0) {
    return [];
  }

  printChoices(options.message, options.choices);

  while (true) {
    const answer = await prompt.ask(
      `Enter numbers separated by commas${options.allowEmpty ? ", blank for none," : ""} or "all": `
    );

    try {
      const indexes = parseNumericSelection(answer, options.choices.length, options.allowEmpty ?? false);
      return indexes.map((choiceIndex) => options.choices[choiceIndex - 1].value);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(message);
    }
  }
}

export async function promptSingleSelect<T extends string>(
  prompt: PromptSession,
  options: PromptSingleSelectOptions<T>
): Promise<T> {
  if (options.choices.length === 0) {
    throw new Error(`No choices available for "${options.message}".`);
  }

  if (options.choices.length === 1) {
    return options.choices[0].value;
  }

  printChoices(options.message, options.choices);

  while (true) {
    const answer = await prompt.ask("Enter one number: ");
    const selectedIndex = Number.parseInt(answer.trim(), 10);
    if (
      Number.isInteger(selectedIndex) &&
      selectedIndex >= 1 &&
      selectedIndex <= options.choices.length
    ) {
      return options.choices[selectedIndex - 1].value;
    }
    console.error(`"${answer.trim()}" is not a valid selection.`);
  }
}

export async function promptConfirm(
  prompt: PromptSession,
  options: PromptConfirmOptions
): Promise<boolean> {
  const defaultLabel = options.defaultValue ? "Y/n" : "y/N";

  while (true) {
    const answer = (await prompt.ask(`${options.message} (${defaultLabel}): `)).trim().toLowerCase();

    if (answer === "") {
      return options.defaultValue ?? false;
    }

    if (answer === "y" || answer === "yes") {
      return true;
    }

    if (answer === "n" || answer === "no") {
      return false;
    }

    console.error(`"${answer}" is not a valid answer.`);
  }
}
