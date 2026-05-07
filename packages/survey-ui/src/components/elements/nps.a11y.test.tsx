import { render } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { formatViolations, runAxe } from "@/lib/test-utils/a11y";
import { NPS } from "./nps";

const defaultProps = {
  elementId: "nps-test",
  inputId: "nps-input",
  headline: "How likely are you to recommend us?",
  lowerLabel: "Not at all",
  upperLabel: "Extremely likely",
  onChange: vi.fn(),
  onSubmit: vi.fn(),
};

describe("NPS accessibility", () => {
  test("wraps options in a fieldset with a legend", () => {
    const { container } = render(<NPS {...defaultProps} />);
    const fieldset = container.querySelector("fieldset");
    expect(fieldset).not.toBeNull();
    const legend = fieldset?.querySelector("legend");
    expect(legend).not.toBeNull();
    expect(legend?.className).toContain("sr-only");
    expect(legend?.textContent).toBe("NPS rating options");
  });

  test("sr-only radio inputs have tabIndex=-1 to prevent duplicate tab stops", () => {
    const { container } = render(<NPS {...defaultProps} />);
    const radioInputs = container.querySelectorAll('input[type="radio"].sr-only');
    expect(radioInputs.length).toBeGreaterThan(0);
    radioInputs.forEach((input) => {
      expect(input.getAttribute("tabindex")).toBe("-1");
    });
  });

  test("radio inputs have descriptive aria-label", () => {
    const { container } = render(<NPS {...defaultProps} />);
    const radioInputs = container.querySelectorAll('input[type="radio"]');
    expect(radioInputs[0].getAttribute("aria-label")).toBe("Rate 0 out of 10");
    expect(radioInputs[10].getAttribute("aria-label")).toBe("Rate 10 out of 10");
  });

  test("has no axe violations", async () => {
    const { container } = render(<NPS {...defaultProps} />);
    const violations = await runAxe(container);
    expect(violations, formatViolations(violations)).toHaveLength(0);
  });
});
