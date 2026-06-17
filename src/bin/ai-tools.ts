#!/usr/bin/env node

import { runCli } from "../cli.js";

function isCancellationMessage(message: string): boolean {
  return message === "Installation cancelled."
    || message === "Installation cancelled because existing targets would be overwritten."
    || message === "MCP workflow cancelled.";
}

runCli().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);

  if (isCancellationMessage(message)) {
    process.exitCode = 0;
    return;
  }

  console.error(`Error: ${message}`);
  process.exitCode = 1;
});
