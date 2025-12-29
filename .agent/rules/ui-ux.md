---
trigger: always_on
---

# 📘 Project Best Practices

## 1. Project Purpose

A full‑stack monorepo delivering a secure, content‑driven website and admin dashboard for Para Shooting India. It includes:

- A Next.js frontend (public site, news/events, legal pages, admin dashboard)
- A NestJS backend API (auth, roles/permissions, events, news, results, media uploads)
- Strong security posture (encryption, guards, middleware, audit logging, secure uploads, environment hardening)
- PostgreSQL database with schema, seed, and infrastructure scripts

---

## 2. Project Structure

- Root
  - `apps/`
    - `web/` — Next.js App Router app (public pages, admin dashboard)
      - `src/app/` — App Router routes (server/client components)
      - `src/components/` — UI and layout components
      - `src/lib/` — client utilities (API wrappers, helpers)
      - `public/` — static assets
      - `middleware.ts` — Next.js middleware (e.g., security/rewrites)
      - `.env.example` — environment variables reference for web
      - `eslint.config.mjs`, `tailwind.config.js`, `postcss.config.*`, `next.config.*`, `tsconfig.json`
    - `api/` — NestJS app
      - `src/`
        - `auth/` — modules for JWT, roles/permissions, decorators/guards
        - `common/` — middleware, guards, interceptors, services (encryption, query protection, IP filter, audit)
        - `config/` — configuration registration and interfaces
        - Domain modules: `events/`, `media/`, `news/`, `results/`, `states/`, `venues/`, `shooters/`, `users/`, `health/`
      - `migrations/` — SQL migrations for schema evolution
      - `uploads/` — server upload directory
      - `test/` — Jest e2e config/tests
      - `.env.example`, `eslint.config.mjs`, `nest-cli.json`, `tsconfig*.json`, `package.json`
  - `packages/` — shared libraries (e.g., `shared-types/`, `ui/`, `database/`)
  - `infrastructure/database/` — PostgreSQL config (`postgresql.conf`, `pg_hba.conf`, `01-init.sql`)
  - `docs/` — extensive documentation (security, frontend, database, environment)
  - `rules/` — LLM guidance and testing practices (e.g., Playwright)
  - `scripts/` and PowerShell scripts — security and operational tooling
  - `docker-compose.yml` — orchestration (e.g., Postgres)
  - `netlify.toml` — hosting config (if used)
  - `README.md`, `.gitignore`

Key entry points and configuration:

- Frontend: `apps/web/src/app/layout.tsx` (root layout), `apps/web/src/app/(public)/**/page.tsx` (routes), `apps/web/next.config.*`
- Backend: `apps/api/src/main.ts` (bootstrap), `apps/api/src/app.module.ts` (root module), `apps/api/src/config/**`
- Environment: `.env.example` files in `apps/web` and `apps/api`, plus docs under `docs/ENV_*`
- Database: SQL in `infrastructure/database/` and `apps/api/migrations/`

---

## 3. Test Strategy

Frameworks and current usage:

- Backend (NestJS): Jest
  - Scripts: unit (`jest`), watch, coverage, debug, and e2e (`jest --config ./test/jest-e2e.json`)
  - E2E: `supertest` for HTTP assertions
  - Transpilation: `ts-jest`
  - Config references in `apps/api/package.json` and `apps/api/test/jest-e2e.json`
- Frontend (Next.js): No tests currently present
  - Recommendation:
    - Unit/component: React Testing Library + Jest
    - E2E: Playwright (rules documented under `rules/playwright-cursor-rules.mdc`)

Organization and naming:

- Backend Unit Tests: Place next to source (`*.spec.ts`) or under `src/**/__tests__`
- Backend E2E Tests: `apps/api/test/**`
- Frontend Tests: mirror component structure (`src/components/**/__tests__/*.test.tsx`)
- Naming: `*.spec.ts` for unit, `*.e2e-spec.ts` for e2e (API), `*.test.tsx` for frontend

Mocking guidelines:

- Prefer DI overrides in NestJS test modules for services/repositories
- Use `jest.fn()` for simple dependency mocks
- For HTTP clients and external services, centralize adapters and mock at the adapter boundary
- Avoid mocking internals of library code; prefer integration-level tests at module boundaries

Unit vs Integration vs E2E:

- Unit: Services, utilities, DTO validation logic
- Integration: Controller + Service + Repository with an in-memory or test DB container
- E2E: Full HTTP path via `supertest` for backend; Playwright for critical user flows on frontend

Coverage expectations:

- Target 80%+ line/branch coverage on backend modules
- Enforce coverage for critical code paths: auth, uploads, encryption, guards/interceptors
- Gradually introduce coverage targets for frontend as tests are added

---

## 4. Code Style

TypeScript and typing:

- Use strict TypeScript types in both apps
- Avoid `any`; prefer narrow types and shared types from `packages/shared-types` where applicable
- For Next.js, type props and loader results; for NestJS, use DTOs and entity types consistently

Async/await:

- Prefer `async/await` over `.then()`
- Always `try/catch` at boundaries; surface normalized errors to clients

Naming conventions:

- Files: kebab-case for pages (`page.tsx`), PascalCase for components (`MyComponent.tsx`), kebab-case for utilities (`api.ts`)
- Variables/functions: camelCase; Classes/React components: PascalCase; Enums: PascalCase
- DTOs: `CreateXDto`, `UpdateXDto`; Entities: `XEntity`

Comments and docs:

- Keep modules self-documenting; add JSDoc on exported functions/classes when intent is non-obvious
- Document feature flags, env vars, and assumptions in code and `docs/`

Error and exception handling:

- Backend: use global exception filters; never leak stack traces or secrets
- Transform responses via interceptors to ensure consistent API shapes
- Frontend: centralize error handling in API utilities; display user-friendly toasts/messages; log diagnostic info only in non-production

Formatting and linting:

- Follow repository ESLint configs; run formatters (Prettier) where configured
- Resolve all lint errors before commit; unused imports should be removed

---

## 5. Common Patterns

Backend (NestJS):

- Dependency Injection via modules/providers
- DTO validation with class-validator and pipes (ensure validation pipes enabled globally)
- Guards for roles/permissions (`roles.guard.ts`, `permissions.guard.ts`)
- Decorators for metadata (`@Roles`, `@Permissions`, `@Public`, `@CurrentUser`)
- Interceptors for transformation/auditing (`transform.interceptor.ts`, `audit.interceptor.ts`)
- Security services: brute-force protection, IP filtering, query protection, encryption
- Repository pattern for data access (e.g., `users/repositories/**`)
- Migrations via SQL files for reproducible schema changes

Frontend (Next.js App Router):

- Server Components by default; Client Components only when needed (`'use client'`)
- `next/link` and `next/image` for routing and optimized images
- TailwindCSS for styling; component primitives in `components/ui/*`
- App segment grouping: e.g., `(public)`, `(dashboard)`, `(auth)`
- Middleware (`middleware.ts`) for edge concerns

Configuration:

- Environment-driven configuration using `.env` files and typed config interfaces (API)
- Docker Compose for local infrastructure (PostgreSQL)
- Netlify configuration for deployment (if applicable)

---

## 6. Do's and Don'ts

✅ Do:

- Use server components by default in Next.js; add `'use client'` only when using client-only APIs (state, effects, browser APIs)
- Keep imports path-safe using configured aliases (e.g., `@/...`) and ensure tsconfig paths match build tooling
- Validate and sanitize all inbound data on the API; enforce DTOs and pipes
- Use encryption service for sensitive fields and never log secrets
- Implement granular authorization via guards/decorators at controller/route level
- Write tests for auth flows, uploads, and critical domain logic
- Keep migrations in sync with entities and document schema changes in `docs/database/**`
- Store uploads safely; validate MIME types and file size limits (multer config)

❌ Don’t:

- Mix server-only code (e.g., `fs`, server configs) inside client components
- Expose internal error details to clients or logs in production
- Bypass DTO validation or directly access request objects from services
- Commit real `.env` files or secrets; use `.env.example`
- Introduce new dependencies without documenting rationale and configuration
- Paste markdown fences or documentation into code files (avoid corruption like stray ``` in TSX)

---

## 7. Tools & Dependencies

Key libraries:

- Frontend: Next.js (App Router), React, TailwindCSS, `lucide-react`, custom UI primitives under `components/ui`
- Backend: NestJS, class-validator/transformer, JWT/guards/decorators, Multer (uploads), custom security services
- Testing: Jest (API unit/e2e), `supertest` (API e2e); Recommended: React Testing Library + Playwright (web)
- Database: PostgreSQL (Docker Compose), SQL migrations; ORM entities present (likely TypeORM patterns)

Setup (local development):

1. Database
   - `docker-compose up -d` to provision Postgres (review `infrastructure/database/*` for settings)
2. Backend API
   - Copy `apps/api/.env.example` to `.env` and fill required variables
   - Install deps and run dev server from `apps/api`:
     - `npm install`
     - `npm run start:dev`
3. Frontend Web
   - Copy `apps/web/.env.example` to `.env` and fill required variables (API base URL, etc.)
   - Install deps and run dev server from `apps/web`:
     - `npm install`
     - `npm run dev`
4. Testing (API)
   - `npm run test`, `npm run test:watch`, `npm run test:cov`, `npm run test:e2e` (from `apps/api`)

Note: If using workspaces/monorepo tooling, align with root scripts; otherwise manage installs per app.

---

## 8. Other Notes

- Security-first posture: follow `docs/security/**` guidance for TLS, headers, logging, monitoring, and incident response
- File uploads: rely on centralized multer config and validation; avoid processing untrusted files unsafely
- Environment management: use `.env.example` as the contract; document any new variables in `docs/ENV_*`
- Accessibility: ensure semantic HTML and ARIA where needed; test keyboard/focus states and color contrast
- Performance: use `next/image`, route segment caching where appropriate, and avoid client hydration where not needed
- API contract: maintain consistency across DTOs, controllers, and interceptors; avoid breaking changes and version when necessary
- LLM generation guidance:
  - Respect existing patterns (modules/services/guards/interceptors in API; server/client component separation in web)
  - Reuse shared types from `packages/shared-types`
  - Prefer composition over inheritance; keep adapters at boundaries for external services
  - Do not introduce new frameworks without justification and documentation
