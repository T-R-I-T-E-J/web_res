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

---

## Phase 5A: News & Announcements System (🚀 IN PROGRESS)

**Goal:** Implement full News/Announcements system (API + Admin + Public).

**Status:** In Progress

1.  **Backend (NestJS)**:
    - [x] Database Schema (`news_articles` table exists).
    - [ ] Create `News` Module (Controller, Service, Repository).
    - [ ] Implement CRUD for Admin.
    - [ ] Implement Public Endpoints (List, Get One).
2.  **Frontend (Admin)**:
    - [ ] News Management Page (List, Create, Edit, Delete).
3.  **Frontend (Public)**:
    - [ ] Home Page News Section.
    - [ ] News Listing Page.
    - [ ] News Detail Page.

---

## 🚦 Immediate Next Action

**Implement News API**:

The database table `news_articles` is ready. We are starting the backend implementation.

**Tasks:**

1.  Create `News` entity and DTOs.
2.  Implement `NewsService` and `NewsController`.
3.  Register `NewsModule`.

---
