import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { formatViolations, runAxe } from "@/lib/test-utils/a11y";
import { ElementError } from "./element-error";

describe("ElementError accessibility", () => {
  test("always renders a live region so screen readers register it before content arrives", () => {
    const { container } = render(<ElementError />);
    const liveRegion = container.querySelector('[role="status"]');
    expect(liveRegion).not.toBeNull();
    expect(liveRegion?.getAttribute("aria-live")).toBe("polite");
    expect(liveRegion?.getAttribute("aria-atomic")).toBe("true");
  });

  test("live region is sr-only when no error is provided", () => {
    const { container } = render(<ElementError />);
    const liveRegion = container.querySelector('[role="status"]');
    expect(liveRegion?.className).toContain("sr-only");
  });

  test("live region contains error text when errorMessage is set", () => {
    render(<ElementError errorMessage="This field is required" />);
    expect(screen.getByText("This field is required")).toBeInTheDocument();
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  test("decorative icon has aria-hidden when error is shown", () => {
    const { container } = render(<ElementError errorMessage="Required" />);
    const icon = container.querySelector("svg");
    expect(icon?.getAttribute("aria-hidden")).toBe("true");
  });

  test("has no axe violations when no error", async () => {
    const { container } = render(
      <div>
        <ElementError />
      </div>
    );
    const violations = await runAxe(container);
    expect(violations, formatViolations(violations)).toHaveLength(0);
  });

  test("has no axe violations when error is shown", async () => {
    const { container } = render(
      <div>
        <ElementError errorMessage="Please select an option" />
      </div>
    );
    const violations = await runAxe(container);
    expect(violations, formatViolations(violations)).toHaveLength(0);
  });

  test("renders error indicator bar with aria-hidden", () => {
    const { container } = render(<ElementError errorMessage="Error" />);
    const bar = container.querySelector('[aria-hidden="true"]');
    expect(bar).not.toBeNull();
  });
});
