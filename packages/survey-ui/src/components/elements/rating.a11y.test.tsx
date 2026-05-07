import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { formatViolations, runAxe } from "@/lib/test-utils/a11y";
import { Rating } from "./rating";

const baseProps = {
  elementId: "rating-test",
  inputId: "rating-input",
  headline: "How would you rate your experience?",
  onChange: vi.fn(),
};

describe("Rating accessibility — number scale", () => {
  it("wraps options in fieldset with sr-only legend", () => {
    const { container } = render(<Rating {...baseProps} scale="number" range={5} />);
    const fieldset = container.querySelector("fieldset");
    expect(fieldset).not.toBeNull();
    const legend = fieldset?.querySelector("legend");
    expect(legend?.className).toContain("sr-only");
    expect(legend?.textContent).toBe("Rating options");
  });

  it("sr-only radio inputs have tabIndex=-1", () => {
    const { container } = render(<Rating {...baseProps} scale="number" range={5} />);
    const radios = container.querySelectorAll('input[type="radio"].sr-only');
    expect(radios.length).toBe(5);
    radios.forEach((r) => {
      expect(r.getAttribute("tabindex")).toBe("-1");
    });
  });

  it("number scale radio labels include range context", () => {
    const { container } = render(<Rating {...baseProps} scale="number" range={5} />);
    const radios = container.querySelectorAll('input[type="radio"]');
    expect(radios[0].getAttribute("aria-label")).toBe("Rate 1 out of 5");
    expect(radios[4].getAttribute("aria-label")).toBe("Rate 5 out of 5");
  });

  it("has no axe violations — number scale", async () => {
    const { container } = render(<Rating {...baseProps} scale="number" range={5} />);
    const violations = await runAxe(container);
    expect(violations, formatViolations(violations)).toHaveLength(0);
  });
});

describe("Rating accessibility — star scale", () => {
  it("sr-only radio inputs have tabIndex=-1 in star scale", () => {
    const { container } = render(<Rating {...baseProps} scale="star" range={5} />);
    const radios = container.querySelectorAll('input[type="radio"].sr-only');
    radios.forEach((r) => {
      expect(r.getAttribute("tabindex")).toBe("-1");
    });
  });

  it("star scale radio labels include 'stars' suffix", () => {
    const { container } = render(<Rating {...baseProps} scale="star" range={5} />);
    const radios = container.querySelectorAll('input[type="radio"]');
    expect(radios[0].getAttribute("aria-label")).toBe("Rate 1 out of 5 stars");
  });

  it("has no axe violations — star scale", async () => {
    const { container } = render(<Rating {...baseProps} scale="star" range={5} />);
    const violations = await runAxe(container);
    expect(violations, formatViolations(violations)).toHaveLength(0);
  });
});

describe("Rating accessibility — smiley scale", () => {
  it("sr-only radio inputs have tabIndex=-1 in smiley scale", () => {
    const { container } = render(<Rating {...baseProps} scale="smiley" range={5} />);
    const radios = container.querySelectorAll('input[type="radio"].sr-only');
    radios.forEach((r) => {
      expect(r.getAttribute("tabindex")).toBe("-1");
    });
  });

  it("has no axe violations — smiley scale", async () => {
    const { container } = render(<Rating {...baseProps} scale="smiley" range={5} />);
    const violations = await runAxe(container);
    expect(violations, formatViolations(violations)).toHaveLength(0);
  });
});
