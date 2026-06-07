// Substitution required: replace "ComponentName" and update props to match the generated component.
// Requires: @testing-library/react, @testing-library/user-event v14+ (npm i -D @testing-library/user-event)
// If Vitest is configured without globals: true, add: import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ComponentName from "./index";

describe("ComponentName", () => {
  it("renders required content", () => {
    render(<ComponentName label="Test value" />);
    expect(screen.getByText("Test value")).toBeInTheDocument();
  });

  it("calls handler when action is triggered", async () => {
    const user = userEvent.setup(); // required for @testing-library/user-event v14+
    const handleAction = vi.fn();
    render(<ComponentName label="Click me" onAction={handleAction} />);
    await user.click(screen.getByRole("button"));
    expect(handleAction).toHaveBeenCalledTimes(1);
  });

  // Add a test per state the component owns (loading, empty, error, disabled, success).
  // Prefer getByRole, getByLabelText, getByText over test IDs.
  // Assert visible behavior and output, not implementation details.
});
