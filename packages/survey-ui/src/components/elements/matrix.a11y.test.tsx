import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { formatViolations, runAxe } from "@/lib/test-utils/a11y";
import { Matrix } from "./matrix";

const mockRows = [
  { id: "row1", label: "Customer support" },
  { id: "row2", label: "Product quality" },
];

const mockColumns = [
  { id: "col1", label: "Poor" },
  { id: "col2", label: "Average" },
  { id: "col3", label: "Excellent" },
];

const defaultProps = {
  elementId: "matrix-test",
  inputId: "matrix-input",
  headline: "Rate our services",
  rows: mockRows,
  columns: mockColumns,
  onChange: vi.fn(),
};

describe("Matrix accessibility", () => {
  it("column headers have id attributes for header association", () => {
    const { container } = render(<Matrix {...defaultProps} />);
    const colHeaders = container.querySelectorAll("thead th[id]");
    expect(colHeaders).toHaveLength(mockColumns.length);
    expect(colHeaders[0].id).toBe("matrix-input-col-col1");
    expect(colHeaders[1].id).toBe("matrix-input-col-col2");
    expect(colHeaders[2].id).toBe("matrix-input-col-col3");
  });

  it("row headers have id attributes for header association", () => {
    const { container } = render(<Matrix {...defaultProps} />);
    const rowHeaders = container.querySelectorAll("th[scope='row'][id]");
    expect(rowHeaders).toHaveLength(mockRows.length);
    expect(rowHeaders[0].id).toBe("matrix-input-row-row1");
    expect(rowHeaders[1].id).toBe("matrix-input-row-row2");
  });

  it("data cells have headers attribute linking to row and column headers", () => {
    const { container } = render(<Matrix {...defaultProps} />);
    const dataCells = container.querySelectorAll("td[headers]");
    // 2 rows × 3 columns = 6 cells
    expect(dataCells).toHaveLength(6);
    const firstCell = dataCells[0] as HTMLTableCellElement;
    expect(firstCell.getAttribute("headers")).toBe("matrix-input-col-col1 matrix-input-row-row1");
  });

  it("radio buttons use comma separator in aria-label for proper JAWS announcement", () => {
    const { container } = render(<Matrix {...defaultProps} />);
    const radioButtons = container.querySelectorAll('[role="radio"]');
    expect(radioButtons[0].getAttribute("aria-label")).toBe("Customer support, Poor");
    expect(radioButtons[0].getAttribute("aria-label")).not.toContain("-");
  });

  it("has no axe violations", async () => {
    const { container } = render(<Matrix {...defaultProps} />);
    const violations = await runAxe(container);
    expect(violations, formatViolations(violations)).toHaveLength(0);
  });

  it("has no axe violations when error is shown", async () => {
    const { container } = render(<Matrix {...defaultProps} errorMessage="Please rate all rows" />);
    const violations = await runAxe(container);
    expect(violations, formatViolations(violations)).toHaveLength(0);
  });
});
