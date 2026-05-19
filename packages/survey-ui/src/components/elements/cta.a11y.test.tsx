import { render } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { formatViolations, runAxe } from "@/lib/test-utils/a11y";
import { CTA } from "./cta";

const baseProps = {
  elementId: "cta-test",
  inputId: "cta-input",
  headline: "Ready to get started?",
  buttonLabel: "Get Started",
  onClick: vi.fn(),
};

describe("CTA accessibility — internal button", () => {
  test("has no axe violations in default state", async () => {
    const { container } = render(<CTA {...baseProps} />);
    const violations = await runAxe(container);
    expect(violations, formatViolations(violations)).toHaveLength(0);
  });

  test("has no axe violations with error shown", async () => {
    const { container } = render(<CTA {...baseProps} errorMessage="This step is required" />);
    const violations = await runAxe(container);
    expect(violations, formatViolations(violations)).toHaveLength(0);
  });
});

describe("CTA accessibility — external button", () => {
  test("renders sr-only 'opens in new tab' text", () => {
    const { container } = render(<CTA {...baseProps} buttonExternal buttonUrl="https://example.com" />);
    // ElementError also renders an sr-only live-region when empty, so select from inside the button
    const button = container.querySelector("button");
    const srOnly = button?.querySelector(".sr-only");
    expect(srOnly).not.toBeNull();
    expect(srOnly?.textContent).toContain("opens in new tab");
  });

  test("external link icon has aria-hidden=true", () => {
    const { container } = render(<CTA {...baseProps} buttonExternal buttonUrl="https://example.com" />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("aria-hidden")).toBe("true");
  });

  test("has no axe violations in external button state", async () => {
    const { container } = render(<CTA {...baseProps} buttonExternal buttonUrl="https://example.com" />);
    const violations = await runAxe(container);
    expect(violations, formatViolations(violations)).toHaveLength(0);
  });
});
