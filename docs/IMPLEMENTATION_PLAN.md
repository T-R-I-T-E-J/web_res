# Implementation Roadmap: Para Shooting Platform

**Status:** Draft | **Version:** 1.0
This document outlines the step-by-step plan to bring the _Para Shooting Committee of India_ platform to life, adhering to the Monorepo architecture.

---

## Phase 1: Foundation & Scaffold (✅ Structure Complete)

- [x] Define Monorepo Structure (`apps/`, `packages/`).
- [x] Establish Governance Rules (`rules/`).
- [x] setup Git & `.gitignore`.
- [ ] **Action Item:** Initialize Package Manager (pnpm/npm workspaces).

## Phase 2: Frontend Core (Next.js 14+)

**Goal:** A running Next.js app consuming the Design System.

1.  **Initialize `apps/web`**:
    - `npx create-next-app@latest` with TypeScript, Tailwind, ESLint.
    - Configure `next.config.js` for Monorepo support.
2.  **Integrate Design System**:
    - Port `css/variables.css` to Tailwind Config (`tailwind.config.ts`).
    - Create base components in `components/ui`.
3.  **Migrate Public Pages**:
    - Convert static HTML (`public/index.html`) to React Components (`page.tsx`).

## Phase 3: Shared Libraries (`packages/`)

**Goal:** Type safety and consistency.

1.  **`packages/shared-types`**:
    - Initialize TS project.
    - Define Zod schemas for `Shooter`, `Score`, `User`.
2.  **`packages/ui`**:
    - Setup shared Tailwind configuration presests.

## Phase 4: Database & Backend (`apps/api`)

**Goal:** Robust API with PostgreSQL.

1.  **Database Setup**:
    - Initialize `packages/database` with Prisma ORM.
    - Model the schema (Users, Shooters, Scores) in `schema.prisma`.
    - Run migrations against local PostgreSQL.
2.  **Backend API Initialization**:
    - Setup `apps/api` with Express/Fastify.
    - Connect to Prisma.
    - Implement "Vertical Slice" folder structure.

## Phase 5: Authentication & Security

**Goal:** Secure RBAC (Role-Based Access Control).

1.  **Auth Strategy**:
    - Implement JWT generation/verification in `apps/api`.
    - Create "Auth Guard" Middleware.
2.  **Frontend Auth**:
    - Build Login/Register forms.
    - Create `AuthProvider` context in Next.js.
    - Protect `/dashboard` routes.

## Phase 6: DevOps & Deployment

**Goal:** Production readiness.

1.  **Dockerization**:
    - Create `Dockerfile` for `apps/web` and `apps/api`.
    - Create `docker-compose.yml` for full stack orchestration.
2.  **CI/CD**:
    - Github Action for Linting & Type Checking.

---

## 🚦 Immediate Next Action

**Initialize Phase 2 (Frontend Core)**:
Run `npx create-next-app` inside `apps/web` to replace the placeholder folder.
