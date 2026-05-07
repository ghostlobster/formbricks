import { render } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { formatViolations, runAxe } from "@/lib/test-utils/a11y";
import { Ranking } from "./ranking";

const mockOptions = [
  { id: "opt1", label: "JavaScript" },
  { id: "opt2", label: "TypeScript" },
  { id: "opt3", label: "Python" },
];

const defaultProps = {
  elementId: "ranking-test",
  inputId: "ranking-input",
  headline: "Rank your favorite languages",
  options: mockOptions,
  onChange: vi.fn(),
};

describe("Ranking accessibility", () => {
  test("wraps options in a fieldset with sr-only legend", () => {
    const { container } = render(<Ranking {...defaultProps} />);
    const fieldset = container.querySelector("fieldset");
    expect(fieldset).not.toBeNull();
    const legend = fieldset?.querySelector("legend");
    expect(legend?.className).toContain("sr-only");
    expect(legend?.textContent).toBe("Ranking options");
  });

  test("unranked option buttons have descriptive aria-label", () => {
    const { container } = render(<Ranking {...defaultProps} />);
    const addButtons = container.querySelectorAll("button[aria-label]");
    const labels = Array.from(addButtons).map((b) => b.getAttribute("aria-label"));
    expect(labels.some((l) => l?.includes("JavaScript"))).toBe(true);
  });

  test("ranked items have Move up / Move down buttons with descriptive labels", () => {
    const { container } = render(<Ranking {...defaultProps} value={["opt1", "opt2", "opt3"]} />);
    const moveUpButtons = container.querySelectorAll('button[aria-label^="Move "][aria-label$=" up"]');
    const moveDownButtons = container.querySelectorAll('button[aria-label^="Move "][aria-label$=" down"]');
    expect(moveUpButtons.length).toBeGreaterThan(0);
    expect(moveDownButtons.length).toBeGreaterThan(0);
  });

  test("has no axe violations in unranked state", async () => {
    const { container } = render(<Ranking {...defaultProps} />);
    const violations = await runAxe(container);
    expect(violations, formatViolations(violations)).toHaveLength(0);
  });

  test("has no axe violations with items ranked", async () => {
    const { container } = render(<Ranking {...defaultProps} value={["opt1", "opt2", "opt3"]} />);
    const violations = await runAxe(container);
    expect(violations, formatViolations(violations)).toHaveLength(0);
  });
});
