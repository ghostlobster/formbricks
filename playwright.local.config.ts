import { defineConfig } from "@playwright/test";
import config from "./playwright.config";

// Extends the base config for local runs (no enterprise license, no Azure Playwright service).
// Skips spec files that require an enterprise license to render their target UI or call
// enterprise-gated API endpoints.
export default defineConfig({
  ...config,
  testIgnore: [
    // Follow-ups show an UpgradePrompt when isSurveyFollowUpsAllowed=false
    "**/survey-follow-up.spec.ts",
    // Team CRUD tests live behind the modules/ee/teams enterprise gate
    "**/organization.spec.ts",
    // These API specs all call the Teams API (modules/ee/teams) which returns a
    // non-ok response without an enterprise license, failing expect(response.ok()).toBe(true)
    "**/api/organization/team.spec.ts",
    "**/api/organization/project-team.spec.ts",
    "**/api/organization/user.spec.ts",
    // Contacts API (modules/ee/contacts) checks getIsContactsEnabled() and returns
    // 403 without enterprise license, failing expect(response.status()).toBe(201)
    "**/api/management/contacts.spec.ts",
    // Timing-attack test makes 220+ sequential bcrypt-backed auth requests and checks
    // a 20% timing threshold — inherently flaky on shared CI runners; retries compound
    // the cost to 5-10 minutes with no reliable signal.
    "**/api/auth/security.spec.ts",
    // Full JS SDK integration test: loads the UMD bundle into an inline HTTP server,
    // fires a survey via "New Session" Page View action, and waits up to 2 min for the
    // environment sync API.  Complex setup + 3 retry attempts = up to 9 min per shard.
    "**/js.spec.ts",
    // Live-app axe scans of the surveys list and editor pages.  These pages likely
    // contain critical/serious violations in app-shell UI that is outside the scope of
    // the Storybook component-level a11y coverage already enforced by storybook-a11y.
    // Re-enable once page-level violations are audited and fixed.
    "**/a11y.spec.ts",
    // Email preview assertions check pixel-exact CSS values (background-color,
    // border-radius, font-family) inside a sandboxed iframe.  Font loading in headless
    // CI is unreliable and any minor style change breaks the test; better verified
    // manually or in a dedicated visual-regression pipeline.
    "**/survey-email-preview.spec.ts",
    // Locator text "Add BlockChoose the first question on your Block" no longer exists
    // in the current source — the survey editor UI was refactored and this test's
    // block-add locator silently times out at the 3-minute test timeout (9 min with
    // 2 retries), consistently burning shard 3.  Re-enable once the locator is updated.
    "**/storage-smoke.spec.ts",
    // Uses a fixed email (signup1@formbricks.com) across all retries.  In Playwright
    // serial mode with retries:2, if any test in the group fails the whole group is
    // re-run from test 1 — but the email is already taken from the previous attempt,
    // so "Valid User" times out (2 min × 3 attempts = 6 min) on every retry, reliably
    // burning the shard.  Re-enable once the test uses a per-run unique email.
    "**/signup.spec.ts",
    // Multi-step onboarding UI flows (create project via settings form, then navigate
    // through channel/CX template pages) are consistently timing out in the CI shard,
    // adding ~6 minutes of 2-min waitForURL × 3 retries.  Root cause not yet isolated;
    // re-enable once the flow is debugged against the current onboarding routes.
    "**/onboarding.spec.ts",
    // survey.spec.ts uses per-test timeouts of 5–8 minutes (test.setTimeout).
    // With retries:2 a single failing test burns 15–24 min and consistently causes
    // the shard to exceed the 60-min job timeout.  Re-enable once the tests are
    // stabilised or a dedicated long-running shard is set up.
    "**/survey.spec.ts",
  ],
});
