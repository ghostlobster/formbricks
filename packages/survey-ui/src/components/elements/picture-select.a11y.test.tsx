import { render } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { formatViolations, runAxe } from "@/lib/test-utils/a11y";
import { PictureSelect } from "./picture-select";

const options = [
  { id: "opt-1", imageUrl: "https://placehold.co/300x200", alt: "Mountain landscape" },
  { id: "opt-2", imageUrl: "https://placehold.co/300x200", alt: "Ocean view" },
  { id: "opt-3", imageUrl: "https://placehold.co/300x200", alt: "Forest path" },
  { id: "opt-4", imageUrl: "https://placehold.co/300x200", alt: "Desert scene" },
];

const baseProps = {
  elementId: "picture-select-test",
  inputId: "picture-input",
  headline: "Which image do you prefer?",
  options,
  onChange: vi.fn(),
};

describe("PictureSelect accessibility — single select", () => {
  test("all images have non-empty alt text", () => {
    const { container } = render(<PictureSelect {...baseProps} />);
    const images = container.querySelectorAll("img");
    expect(images.length).toBe(options.length);
    images.forEach((img) => {
      expect(img.getAttribute("alt")).toBeTruthy();
    });
  });

  test("radio buttons have descriptive aria-label", () => {
    const { container } = render(<PictureSelect {...baseProps} />);
    // Radix RadioGroupItem renders as <button role="radio"> in jsdom
    const radios = container.querySelectorAll('button[role="radio"]');
    expect(radios.length).toBe(options.length);
    radios.forEach((radio) => {
      expect(radio.getAttribute("aria-label")).toBeTruthy();
    });
  });

  test("has no axe violations in single select mode", async () => {
    const { container } = render(<PictureSelect {...baseProps} />);
    const violations = await runAxe(container);
    expect(violations, formatViolations(violations)).toHaveLength(0);
  });

  test("has no axe violations with a selected value", async () => {
    const { container } = render(<PictureSelect {...baseProps} value="opt-1" />);
    const violations = await runAxe(container);
    expect(violations, formatViolations(violations)).toHaveLength(0);
  });
});

describe("PictureSelect accessibility — multi select", () => {
  test("checkboxes have descriptive aria-label", () => {
    const { container } = render(<PictureSelect {...baseProps} allowMulti />);
    // Radix Checkbox renders as <button role="checkbox">
    const checkboxes = container.querySelectorAll('button[role="checkbox"]');
    expect(checkboxes.length).toBe(options.length);
    checkboxes.forEach((cb) => {
      expect(cb.getAttribute("aria-label")).toBeTruthy();
    });
  });

  test("has no axe violations in multi select mode", async () => {
    const { container } = render(<PictureSelect {...baseProps} allowMulti />);
    const violations = await runAxe(container);
    expect(violations, formatViolations(violations)).toHaveLength(0);
  });

  test("has no axe violations with selected values", async () => {
    const { container } = render(<PictureSelect {...baseProps} allowMulti value={["opt-1", "opt-3"]} />);
    const violations = await runAxe(container);
    expect(violations, formatViolations(violations)).toHaveLength(0);
  });
});
