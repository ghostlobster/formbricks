import { render } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { SingleSelect } from "@/components/elements/single-select";
import { formatViolations, runAxe } from "@/lib/test-utils/a11y";

const options = [
  { id: "opt1", label: "Option 1" },
  { id: "opt2", label: "Option 2" },
  { id: "opt3", label: "Option 3" },
  { id: "opt4", label: "Option 4" },
];

describe("SingleSelect quick axe check", () => {
  test("Required story has no axe violations", async () => {
    const { container } = render(
      <SingleSelect
        elementId="test-1"
        inputId="test-input-1"
        headline="Pick an option"
        options={options}
        onChange={vi.fn()}
        required={true}
      />
    );
    const violations = await runAxe(container);
    expect(violations, formatViolations(violations)).toHaveLength(0);
  });

  test("WithError story has no axe violations", async () => {
    const { container } = render(
      <SingleSelect
        elementId="test-2"
        inputId="test-input-2"
        headline="Pick an option"
        options={options}
        onChange={vi.fn()}
        errorMessage="Please select an option"
      />
    );
    const violations = await runAxe(container);
    expect(violations, formatViolations(violations)).toHaveLength(0);
  });

  test("Dropdown story has no axe violations", async () => {
    const { container } = render(
      <SingleSelect
        elementId="test-3"
        inputId="test-input-3"
        headline="Pick an option"
        options={options}
        onChange={vi.fn()}
        variant="dropdown"
      />
    );
    const violations = await runAxe(container);
    expect(violations, formatViolations(violations)).toHaveLength(0);
  });
});
