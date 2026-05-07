import { AxeBuilder } from "@axe-core/playwright";
import type { TestRunnerConfig } from "@storybook/test-runner";

const config: TestRunnerConfig = {
  async postVisit(page) {
    const results = await new AxeBuilder({ page })
      .include("#storybook-root")
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();

    if (results.violations.length > 0) {
      const details = results.violations
        .map(
          (v) =>
            `  [${v.impact ?? "unknown"}] ${v.id}: ${v.description}\n    Nodes: ${v.nodes
              .slice(0, 2)
              .map((n) => n.html)
              .join(", ")}`
        )
        .join("\n");
      throw new Error(`${String(results.violations.length)} accessibility violation(s):\n${details}`);
    }
  },
};

export default config;
