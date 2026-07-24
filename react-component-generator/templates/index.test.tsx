// Substitution required: replace "ComponentName" and update props to match the generated component.
// Requires: @testing-library/react, @testing-library/user-event v14+ (npm i -D @testing-library/user-event)
// Test runner: detect Vitest vs Jest from the repo (package.json/vitest.config.*/jest.config.*) before using this template.
// - Vitest: use vi.fn() / vi.mock(); if `globals: true` is not set, add: import { describe, it, expect, vi } from "vitest";
// - Jest: replace every `vi.fn()` below with `jest.fn()` and `vi.mock()` with `jest.mock()` — no extra import needed, Jest globals are ambient.
// If the component has a controller.ts that calls useQuery/useMutation, mock the controller module directly
// (vi.mock("./controller") / jest.mock("./controller")) instead of the network layer — this is a component-level
// unit test. Reserve MSW-based network mocking for container/integration tests that exercise the real controller.
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ComponentName from "./index";

describe("ComponentName", () => {
  it("renders required content", () => {
    render(<ComponentName label="Test value" />);
    expect(screen.getByText("Test value")).toBeInTheDocument();
  });

  it("calls onConfirm when the action is triggered", async () => {
    const user = userEvent.setup(); // required for @testing-library/user-event v14+
    const handleConfirm = vi.fn(); // jest.fn() if the repo uses Jest
    render(<ComponentName label="Click me" onConfirm={handleConfirm} />);
    await user.click(screen.getByRole("button"));
    expect(handleConfirm).toHaveBeenCalledTimes(1);
  });

  // Add a test per state the component owns (loading, empty, error, disabled, success).
  // Prefer getByRole, getByLabelText, getByText over test IDs.
  // Assert visible behavior and output, not implementation details.
});
