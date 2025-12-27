# Implementation Roadmap: Para Shooting Platform

**Status:** Draft | **Version:** 1.0
This document outlines the step-by-step plan to bring the _Para Shooting Committee of India_ platform to life, adhering to the Monorepo architecture.

---

## Phase 1: Foundation & Scaffold (✅ COMPLETE)

- [x] Define Monorepo Structure (`apps/`, `packages/`).
- [x] Establish Governance Rules (`rules/`).
- [x] Setup Git & `.gitignore`.
- [x] **Database Environment**: PostgreSQL 16 running in Docker with complete schema (29 tables).
- [ ] **Action Item**: Initialize Package Manager (pnpm/npm workspaces).

---

## Phase 2: Frontend Core (Next.js 14+) - **🚀 CURRENT PHASE**

**Goal:** A running Next.js app consuming the Design System.

**Status:** Ready to begin

1.  **Initialize `apps/web`**:
    - `npx create-next-app@latest` with TypeScript, Tailwind, ESLint.
    - Configure `next.config.js` for Monorepo support.
2.  **Integrate Design System**:
    - Port `css/variables.css` to Tailwind Config (`tailwind.config.ts`).
    - Create base components in `components/ui`.
3.  **Migrate Public Pages**:
    - Convert static HTML (`public/index.html`) to React Components (`page.tsx`).

---

## 🚦 Immediate Next Action

**Initialize Phase 2 (Frontend Core)**:

The database foundation is solid and running. Next step is to initialize the Next.js frontend application in `apps/web`.

**Command to run:**

```bash
cd apps
npx create-next-app@latest web --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

This will create a production-ready Next.js 14+ application with:

- ✅ TypeScript
- ✅ Tailwind CSS
- ✅ ESLint
- ✅ App Router
- ✅ `src/` directory structure
- ✅ Path aliases configured
