import { defineConfig } from "@playwright/test";
import config from "./playwright.config";

// Extends the base config for local runs (no enterprise license, no Azure Playwright service).
// Skips spec files that require an enterprise license to render their target UI.
export default defineConfig({
  ...config,
  testIgnore: [
    // Follow-ups show an UpgradePrompt when isSurveyFollowUpsAllowed=false
    "**/survey-follow-up.spec.ts",
    // Team CRUD tests live behind the modules/ee/teams enterprise gate
    "**/organization.spec.ts",
  ],
});
