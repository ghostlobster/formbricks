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
  ],
});
