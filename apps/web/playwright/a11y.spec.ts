import AxeBuilder from "@axe-core/playwright";
import { expect } from "@playwright/test";
import { test } from "./lib/fixtures";

/**
 * Accessibility E2E tests using axe-core/playwright.
 *
 * Strategy: "critical" and "serious" impact violations are hard failures.
 * "moderate" and "minor" are logged as warnings during the initial ramp-up period.
 * Once all component fixes are shipped, the filter can be removed to catch all violations.
 *
 * WCAG tags scanned: wcag2a, wcag2aa, wcag21aa
 */

const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21aa"];

test.describe("Accessibility scans — authenticated pages", () => {
  test("surveys list page has no critical/serious WCAG AA violations", async ({ page, users }) => {
    const user = await users.create();
    await user.login();

    await page.waitForURL(/\/environments\/[^/]+\/surveys/);

    const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();

    const blocking = results.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious"
    );

    if (results.violations.length > 0) {
      console.info(
        `[a11y] ${results.violations.length} total violations on surveys list page. ` +
          `${blocking.length} blocking (critical/serious).`
      );
    }

    expect(
      blocking,
      `Blocking violations:\n${blocking.map((v) => `  [${v.impact}] ${v.id}: ${v.description}`).join("\n")}`
    ).toHaveLength(0);
  });

  test("survey create/edit page has no critical/serious WCAG AA violations", async ({
    page,
    users,
  }) => {
    const user = await users.create();
    await user.login();

    await page.waitForURL(/\/environments\/[^/]+\/surveys/);
    await page.getByRole("button", { name: /create survey/i }).first().click();
    await page.waitForURL(/\/environments\/[^/]+\/surveys\/[^/]+\/edit/);

    const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();

    const blocking = results.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious"
    );

    expect(
      blocking,
      `Blocking violations:\n${blocking.map((v) => `  [${v.impact}] ${v.id}: ${v.description}`).join("\n")}`
    ).toHaveLength(0);
  });
});

test.describe("Accessibility scans — public survey pages", () => {
  test("login page has no critical/serious WCAG AA violations", async ({ page }) => {
    await page.goto("/auth/login");
    await page.waitForLoadState("networkidle");

    const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();

    const blocking = results.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious"
    );

    expect(
      blocking,
      `Blocking violations:\n${blocking.map((v) => `  [${v.impact}] ${v.id}: ${v.description}`).join("\n")}`
    ).toHaveLength(0);
  });

  test("signup page has no critical/serious WCAG AA violations", async ({ page }) => {
    await page.goto("/auth/signup");
    await page.waitForLoadState("networkidle");

    const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();

    const blocking = results.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious"
    );

    expect(
      blocking,
      `Blocking violations:\n${blocking.map((v) => `  [${v.impact}] ${v.id}: ${v.description}`).join("\n")}`
    ).toHaveLength(0);
  });
});
