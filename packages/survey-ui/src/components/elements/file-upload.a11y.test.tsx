import { render } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { formatViolations, runAxe } from "@/lib/test-utils/a11y";
import { FileUpload } from "./file-upload";

const baseProps = {
  elementId: "file-upload-test",
  inputId: "file-input",
  headline: "Upload your documents",
  onChange: vi.fn(),
};

describe("FileUpload accessibility", () => {
  test("upload button has aria-label", () => {
    const { container } = render(<FileUpload {...baseProps} />);
    const button = container.querySelector("button[aria-label]");
    expect(button).not.toBeNull();
    expect(button?.getAttribute("aria-label")).toContain("Upload");
  });

  test("file input has aria-describedby pointing to label span", () => {
    const { container } = render(<FileUpload {...baseProps} />);
    const input = container.querySelector('input[type="file"]');
    const describedBy = input?.getAttribute("aria-describedby") ?? "";
    expect(describedBy).toContain("file-input-label");
  });

  test("file input aria-describedby includes error id when error exists", () => {
    const { container } = render(<FileUpload {...baseProps} errorMessage="Please upload a file" />);
    const input = container.querySelector('input[type="file"]');
    const describedBy = input?.getAttribute("aria-describedby") ?? "";
    expect(describedBy).toContain("file-input-label");
    expect(describedBy).toContain("file-input-error");
  });

  test("delete button has item-specific aria-label when file is uploaded", () => {
    const { container } = render(
      <FileUpload
        {...baseProps}
        value={[{ name: "resume.pdf", url: "data:application/pdf;base64,abc" }]}
        allowMultiple
      />
    );
    const deleteButton = container.querySelector('button[aria-label^="Delete"]');
    expect(deleteButton).not.toBeNull();
    expect(deleteButton?.getAttribute("aria-label")).toBe("Delete resume.pdf");
  });

  test("has no axe violations in default state", async () => {
    const { container } = render(<FileUpload {...baseProps} />);
    const violations = await runAxe(container);
    expect(violations, formatViolations(violations)).toHaveLength(0);
  });

  test("has no axe violations with error shown", async () => {
    const { container } = render(<FileUpload {...baseProps} errorMessage="Please upload a file" />);
    const violations = await runAxe(container);
    expect(violations, formatViolations(violations)).toHaveLength(0);
  });

  test("has no axe violations with uploaded files", async () => {
    const { container } = render(
      <FileUpload
        {...baseProps}
        value={[{ name: "doc.pdf", url: "data:application/pdf;base64,abc" }]}
        allowMultiple
      />
    );
    const violations = await runAxe(container);
    expect(violations, formatViolations(violations)).toHaveLength(0);
  });
});
