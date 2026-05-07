import { render } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { formatViolations, runAxe } from "@/lib/test-utils/a11y";
import { MultiSelect } from "./multi-select";

const options = [
  { id: "opt1", label: "Option 1" },
  { id: "opt2", label: "Option 2" },
  { id: "opt3", label: "Option 3" },
  { id: "opt4", label: "Option 4" },
];

describe("MultiSelect accessibility", () => {
  test("Default has no axe violations", async () => {
    const { container } = render(
      <MultiSelect
        elementId="test-1"
        inputId="test-input-1"
        headline="Pick options"
        options={options}
        onChange={vi.fn()}
      />
    );
    const violations = await runAxe(container);
    expect(violations, formatViolations(violations)).toHaveLength(0);
  });

  test("Required has no axe violations", async () => {
    const { container } = render(
      <MultiSelect
        elementId="test-2"
        inputId="test-input-2"
        headline="Pick options"
        options={options}
        onChange={vi.fn()}
        required
      />
    );
    const violations = await runAxe(container);
    expect(violations, formatViolations(violations)).toHaveLength(0);
  });

  test("WithError has no axe violations", async () => {
    const { container } = render(
      <MultiSelect
        elementId="test-3"
        inputId="test-input-3"
        headline="Pick options"
        options={options}
        onChange={vi.fn()}
        errorMessage="Please select at least one option"
      />
    );
    const violations = await runAxe(container);
    expect(violations, formatViolations(violations)).toHaveLength(0);
  });

  test("Dropdown has no axe violations", async () => {
    const { container } = render(
      <MultiSelect
        elementId="test-4"
        inputId="test-input-4"
        headline="Pick options"
        options={options}
        onChange={vi.fn()}
        variant="dropdown"
      />
    );
    const violations = await runAxe(container);
    expect(violations, formatViolations(violations)).toHaveLength(0);
  });
});
