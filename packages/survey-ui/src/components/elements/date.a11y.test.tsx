import { render } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { formatViolations, runAxe } from "@/lib/test-utils/a11y";
import { DateElement } from "./date";

const baseProps = {
  elementId: "date-test",
  inputId: "date-input",
  headline: "When is your appointment?",
  onChange: vi.fn(),
};

describe("DateElement accessibility", () => {
  test("has no axe violations in default state", async () => {
    const { container } = render(<DateElement {...baseProps} />);
    const violations = await runAxe(container);
    expect(violations, formatViolations(violations)).toHaveLength(0);
  });

  test("has no axe violations with a selected date", async () => {
    const { container } = render(<DateElement {...baseProps} value="2024-06-15" />);
    const violations = await runAxe(container);
    expect(violations, formatViolations(violations)).toHaveLength(0);
  });

  test("has no axe violations with error shown", async () => {
    const { container } = render(<DateElement {...baseProps} errorMessage="Please select a date" />);
    const violations = await runAxe(container);
    expect(violations, formatViolations(violations)).toHaveLength(0);
  });

  test("calendar container is keyboard-reachable", () => {
    const { container } = render(<DateElement {...baseProps} />);
    const focusable = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    expect(focusable.length).toBeGreaterThan(0);
  });
});
