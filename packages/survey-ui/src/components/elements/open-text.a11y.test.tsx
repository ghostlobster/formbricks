import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { formatViolations, runAxe } from "@/lib/test-utils/a11y";
import { OpenText } from "./open-text";

const defaultProps = {
  elementId: "opentext-test",
  inputId: "opentext-input",
  headline: "What is your name?",
  onChange: vi.fn(),
};

describe("OpenText accessibility", () => {
  it("renders without char counter when no charLimit is set", () => {
    const { container } = render(<OpenText {...defaultProps} />);
    expect(container.querySelector('[aria-live="polite"]')).toBeNull();
  });

  it("char counter span has aria-live and aria-atomic when charLimit.max is set", () => {
    const { container } = render(<OpenText {...defaultProps} charLimit={{ max: 100 }} />);
    const counter = container.querySelector('[aria-live="polite"]');
    expect(counter).not.toBeNull();
    expect(counter?.getAttribute("aria-atomic")).toBe("true");
    expect(counter?.id).toBe("opentext-input-counter");
  });

  it("input aria-describedby includes counter ID when charLimit.max is set", () => {
    const { container } = render(<OpenText {...defaultProps} charLimit={{ max: 100 }} />);
    const input = container.querySelector("input");
    const describedBy = input?.getAttribute("aria-describedby") ?? "";
    expect(describedBy).toContain("opentext-input-counter");
  });

  it("textarea aria-describedby includes counter ID for long-answer", () => {
    const { container } = render(<OpenText {...defaultProps} longAnswer charLimit={{ max: 200 }} />);
    const textarea = container.querySelector("textarea");
    const describedBy = textarea?.getAttribute("aria-describedby") ?? "";
    expect(describedBy).toContain("opentext-input-counter");
  });

  it("input aria-describedby includes description ID when description is set", () => {
    const { container } = render(
      <OpenText {...defaultProps} description="Enter your full name" charLimit={{ max: 50 }} />
    );
    const input = container.querySelector("input");
    const describedBy = input?.getAttribute("aria-describedby") ?? "";
    expect(describedBy).toContain("opentext-input-description");
    expect(describedBy).toContain("opentext-input-counter");
  });

  it("has no axe violations", async () => {
    const { container } = render(<OpenText {...defaultProps} />);
    const violations = await runAxe(container);
    expect(violations, formatViolations(violations)).toHaveLength(0);
  });

  it("has no axe violations with char limit", async () => {
    const { container } = render(<OpenText {...defaultProps} charLimit={{ max: 100 }} />);
    const violations = await runAxe(container);
    expect(violations, formatViolations(violations)).toHaveLength(0);
  });
});
