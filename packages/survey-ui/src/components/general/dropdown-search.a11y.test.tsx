import { render } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, test, vi } from "vitest";
import { formatViolations, runAxe } from "@/lib/test-utils/a11y";
import { DropdownSearchInput } from "./dropdown-search";

const defaultProps = {
  searchQuery: "",
  setSearchQuery: vi.fn(),
  searchInputRef: createRef<HTMLInputElement>(),
  placeholder: "Search...",
};

describe("DropdownSearchInput accessibility", () => {
  test("search container has role='search'", () => {
    const { container } = render(<DropdownSearchInput {...defaultProps} />);
    expect(container.querySelector('[role="search"]')).not.toBeNull();
  });

  test("uses placeholder as aria-label when no searchAriaLabel provided", () => {
    const { container } = render(<DropdownSearchInput {...defaultProps} />);
    const input = container.querySelector("input");
    expect(input?.getAttribute("aria-label")).toBe("Search...");
  });

  test("uses searchAriaLabel over placeholder when provided", () => {
    const { container } = render(
      <DropdownSearchInput {...defaultProps} searchAriaLabel="Search options for: What is your country?" />
    );
    const input = container.querySelector("input");
    expect(input?.getAttribute("aria-label")).toBe("Search options for: What is your country?");
  });

  test("search icon has aria-hidden", () => {
    const { container } = render(<DropdownSearchInput {...defaultProps} />);
    const icon = container.querySelector("svg");
    expect(icon?.getAttribute("aria-hidden")).toBe("true");
  });

  test("has no axe violations with default props", async () => {
    const { container } = render(<DropdownSearchInput {...defaultProps} />);
    const violations = await runAxe(container);
    expect(violations, formatViolations(violations)).toHaveLength(0);
  });

  test("has no axe violations with contextual aria-label", async () => {
    const { container } = render(
      <DropdownSearchInput
        {...defaultProps}
        searchAriaLabel="Search options for: Favorite programming language"
      />
    );
    const violations = await runAxe(container);
    expect(violations, formatViolations(violations)).toHaveLength(0);
  });
});
