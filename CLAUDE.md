# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Start dev environment (Docker services + all apps)
pnpm go                      # Recommended: starts DB + runs all dev servers
pnpm db:up                   # Start Docker services only
pnpm dev                     # Start all dev servers (requires DB already up)

# Build
pnpm build                   # Production build for all packages and apps
pnpm build --filter=@formbricks/surveys... --force  # Force rebuild surveys + deps

# Test
pnpm test                    # Run all Vitest suites
pnpm test:coverage           # Run with coverage
pnpm test:e2e                # Run Playwright E2E suite

# Run tests for a specific package
pnpm --filter @formbricks/web test
# Run a single test file
pnpm vitest run apps/web/lib/jwt.test.ts

# Lint / Format
pnpm lint
pnpm format

# Database
pnpm db:migrate:dev          # Apply pending Prisma migrations (dev)
pnpm fb-migrate-dev          # Create a new schema migration + apply it
pnpm db:seed                 # Seed with sample data (admin@formbricks.com / password123)
pnpm db:seed:clear           # Clear data and re-seed (DESTRUCTIVE)

# Add a data migration (non-schema)
pnpm --filter @formbricks/database generate-data-migration

# i18n
pnpm i18n                    # Generate + validate translation keys
pnpm i18n:validate           # Validate keys only
```

## Monorepo Architecture

This is a pnpm + Turborepo monorepo. Key workspaces:

- **`apps/web`** — The main Next.js application (App Router). All product UI and API lives here.
- **`apps/storybook`** — Storybook for reusable UI components.
- **`apps/ai`** — AI service package.
- **`packages/database`** — Prisma schema, migrations, and generated client. Schema at `packages/database/schema.prisma`.
- **`packages/surveys`** — Pre-compiled Vite bundle (UMD + ESM) served from `apps/web/public/js/`. After any change here, rebuild with `--force` and hard-refresh the browser.
- **`packages/survey-ui`** — React UI for survey rendering, consumed by `packages/surveys`.
- **`packages/cache`** — Redis-backed caching service with singleton pattern.
- **`packages/storage`** — S3-compatible file storage abstraction.
- **`packages/types`** — Shared TypeScript types and Zod schemas.
- **`packages/logger`** — Shared structured logger (`@formbricks/logger`).

### apps/web structure

```
apps/web/
├── app/                    # Next.js App Router
│   ├── (app)/              # Authenticated product routes
│   ├── (auth)/             # Auth routes (login, signup, etc.)
│   ├── api/                # Route handlers (v1 management + client API)
│   └── ...
├── modules/                # Feature modules (colocated UI + logic)
│   ├── ee/                 # Enterprise Edition features
│   ├── ui/                 # Shared React UI components
│   └── <feature>/          # Feature module (auth, billing, survey, etc.)
├── lib/                    # Shared server-side services and utilities
│   ├── */service.ts        # Domain services (user, survey, environment, etc.)
│   ├── cache/              # Cache facade (wraps @formbricks/cache)
│   └── utils/              # Shared utility functions
└── locales/                # i18n translation files (default: en-US.json)
```

## Key Patterns

### Server Actions

All server actions use `next-safe-action` via two clients defined in `apps/web/lib/utils/action-client/index.ts`:

- `actionClient` — Unauthenticated actions (adds audit log context).
- `authenticatedActionClient` — Requires a session; injects `ctx.user`.

Actions use `.inputSchema(ZSchema).action(async ({ parsedInput, ctx }) => { ... })` and are placed in `actions.ts` files colocated with their feature module.

```typescript
"use server";
import { authenticatedActionClient } from "@/lib/utils/action-client";

export const myAction = authenticatedActionClient
  .inputSchema(ZMyInput)
  .action(async ({ parsedInput, ctx }) => {
    // ctx.user is available here
    return someService(parsedInput.id, ctx.user.id);
  });
```

### Services

Domain services live in `apps/web/lib/*/service.ts`. They import directly from `@formbricks/database` (Prisma) and use `react`'s `cache()` for request-level deduplication.

```typescript
import "server-only";
import { cache as reactCache } from "react";
import { prisma } from "@formbricks/database";

export const getEnvironment = reactCache(async (environmentId: string) => {
  return prisma.environment.findUnique({ where: { id: environmentId } });
});
```

### Caching

- **Request-level dedup**: Use React `cache()` from `"react"`.
- **Redis cache**: Use `cache` facade from `@/lib/cache` which wraps `@formbricks/cache`.
- **Never use** `unstable_cache()` from Next.js.
- Use `createCacheKey.*` helpers from `@formbricks/cache` for all cache keys.
- `cache.withCache(fn, key, ttlMs)` never throws — it falls back to executing `fn` if Redis is unavailable.

### Enterprise Features

Enterprise-only code lives under `apps/web/modules/ee/`. Check `ENTERPRISE_LICENSE_KEY` env or the license service before exposing EE features.

### Database Migrations

- **Schema change**: Modify `packages/database/schema.prisma` → run `pnpm fb-migrate-dev`.
- **Data migration**: Run `pnpm --filter @formbricks/database generate-data-migration` → implement in the generated `migration.ts` using only Prisma raw queries.
- Migrations live in `packages/database/migration/` with `timestamp_name` directories containing either `migration.sql` or `migration.ts`.
- All data must be scoped by `organizationId` or `environmentId` (multi-tenancy).

### Storage (`@formbricks/storage`)

All storage operations return `Result<T, StorageError>` — check `.ok` before accessing `.data`. Key functions: `getSignedUploadUrl`, `getSignedDownloadUrl`, `getFileStream`, `deleteFile`, `deleteFilesByPrefix`.

### Cache (`@formbricks/cache`)

Uses a `globalThis` singleton Redis client via `getCacheService()`. Core operations return `Result<T, CacheError>`. The web app accesses this through the Proxy-based facade at `@/lib/cache`.

## Testing

- **Unit tests**: Vitest, colocated as `*.test.ts` next to source. Test `.ts` files only — `.tsx` files are covered by Playwright E2E.
- **E2E tests**: Playwright specs in `apps/web/playwright/`.
- **Mocks**: Place in `__mocks__/` directories. Mock `@aws-sdk/client-s3` at module level for storage tests.
- Test files colocated with the code they exercise (`utility.test.ts` alongside `utility.ts`).

## Conventions

### Naming

- `PascalCase` for React components and folders under `modules/`.
- `camelCase` for functions and variables.
- `SCREAMING_SNAKE_CASE` for constants.

### Code Style

- Prettier: 110-char width, semicolons, double quotes, sorted import groups.
- Shared ESLint config: `@formbricks/eslint-config`.
- Prefer type inference; avoid `any`; use shared types from `@formbricks/types`.

### i18n

- All user-facing strings use `t()` from `react-i18next`. Keys are lowercase with dot nesting (e.g., `common.save`).
- Translations live in `apps/web/locales/`. After adding keys to `en-US.json`, run `pnpm i18n` — Lingo.dev auto-translates on commit.

### Dates

- Use shared formatting helpers from `apps/web/lib/utils/date-display.ts` for display. Locale comes from `user.locale` / `getLocale()`, not browser defaults.
- Storage/API values stay as ISO 8601 / UTC — never localize machine-facing timestamps.

### Prisma / Database

- Never use `skip`/`offset` with `prisma.*.count()`; only `where`.
- Run count and data queries in parallel with `Promise.all`.
- Prefer cursor pagination for large datasets.
- Filter by `createdAt` only alongside indexed fields (e.g., `surveyId + createdAt`).

### Commits and PRs

Commits follow Conventional Commits: `fix:`, `feat:`, `chore:` with optional PR number appended (e.g., `fix: update OpenAPI schema (#6617)`). PRs should include screenshots for UI changes, list env/migration changes, and paste relevant command output.

### Storybook

Stories are in `stories.tsx` files colocated with the component, importing from `"./index"`. Use `@storybook/react-vite`; organize argTypes into `Behavior`, `Appearance`, `Content`.

### GitHub Actions

Always set minimal `permissions` for `GITHUB_TOKEN`. Add `step-security/harden-runner` as the first step on `ubuntu-latest` jobs.
