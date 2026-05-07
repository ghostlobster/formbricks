import axe from "axe-core";

/** Run axe-core on a DOM element and return violations. */
export async function runAxe(container: Element, options?: axe.RunOptions): Promise<axe.Result[]> {
  const results = await axe.run(container, {
    runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa"] },
    ...options,
  });
  return results.violations;
}

/** Format axe violations into a readable string for test failure messages. */
export function formatViolations(violations: axe.Result[]): string {
  if (violations.length === 0) return "No violations";
  return violations
    .map(
      (v) =>
        `[${v.impact ?? "unknown"}] ${v.id}: ${v.description}\n  Nodes: ${v.nodes
          .map((n) => n.html)
          .slice(0, 2)
          .join(", ")}`
    )
    .join("\n\n");
}
