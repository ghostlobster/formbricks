import { render } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { formatViolations, runAxe } from "@/lib/test-utils/a11y";
import { Consent } from "./consent";

const baseProps = {
  elementId: "consent-test",
  inputId: "consent-input",
  headline: "Do you agree to the terms?",
  checkboxLabel: "I agree to the terms and conditions",
  onChange: vi.fn(),
};

describe("Consent accessibility", () => {
  test("checkbox has an associated label via htmlFor", () => {
    const { container } = render(<Consent {...baseProps} />);
    const checkbox = container.querySelector("#consent-input-checkbox");
    expect(checkbox).not.toBeNull();
    const label = container.querySelector('label[for="consent-input-checkbox"]');
    expect(label).not.toBeNull();
  });

  test("checkbox has aria-invalid=false when no error", () => {
    const { container } = render(<Consent {...baseProps} />);
    const checkbox = container.querySelector("#consent-input-checkbox");
    expect(checkbox?.getAttribute("aria-invalid")).toBe("false");
  });

  test("checkbox has aria-invalid=true when error is present", () => {
    const { container } = render(<Consent {...baseProps} errorMessage="You must accept the terms" />);
    const checkbox = container.querySelector("#consent-input-checkbox");
    expect(checkbox?.getAttribute("aria-invalid")).toBe("true");
  });

  test("checkbox has aria-describedby pointing to error element when error exists", () => {
    const { container } = render(<Consent {...baseProps} errorMessage="You must accept the terms" />);
    const checkbox = container.querySelector("#consent-input-checkbox");
    const describedBy = checkbox?.getAttribute("aria-describedby");
    expect(describedBy).toBe("consent-input-error");
    const errorEl = container.querySelector("#consent-input-error");
    expect(errorEl).not.toBeNull();
  });

  test("no aria-describedby on checkbox when no error", () => {
    const { container } = render(<Consent {...baseProps} />);
    const checkbox = container.querySelector("#consent-input-checkbox");
    expect(checkbox?.getAttribute("aria-describedby")).toBeNull();
  });

  test("has no axe violations in default state", async () => {
    const { container } = render(<Consent {...baseProps} />);
    const violations = await runAxe(container);
    expect(violations, formatViolations(violations)).toHaveLength(0);
  });

  test("has no axe violations with error shown", async () => {
    const { container } = render(<Consent {...baseProps} errorMessage="You must accept the terms" />);
    const violations = await runAxe(container);
    expect(violations, formatViolations(violations)).toHaveLength(0);
  });

  test("has no axe violations when checked", async () => {
    const { container } = render(<Consent {...baseProps} value={true} />);
    const violations = await runAxe(container);
    expect(violations, formatViolations(violations)).toHaveLength(0);
  });
});
