# Project Architecture & Folder Structure

## Para Shooting Committee of India Platform

**Status:** Draft | **Role:** Senior Architect | **Stack:** Monorepo (Next.js + Node.js API)

---

## 1. High-Level Architecture Strategy

We will utilize a **Monorepo Architecture** (using TurboRepo or Nx) to manage the codebase. This approach offers the best balance of separation of concerns and developer experience.

- **`apps/web`**: Next.js application handling the _Presentation Layer_ (Public Site, Shooter Dashboard, Admin Panel).
- **`apps/api`**: Node.js/TypeScript application handling the _Business Logic Layer_ (Complex scoring algorithms, ranking calculations, secure payments).
- **`packages/*`**: Shared libraries to ensure consistency and type safety across the stack.

### Key Benefits

1.  **Shared Types:** Database models and DTOs are defined once in `packages/database` or `packages/types` and used by both Frontend and Backend.
2.  **Unified Design:** The UI library (`design-system`) lives in `packages/ui` and is consumed by the Next.js app.
3.  **Scalability:** New apps (e.g., Mobile App, Scoring Kiosk App) can be added to `apps/` without duplicating logic.

---

## 2. Root Directory Structure

```plaintext
/ (root)
├── .github/                 # CI/CD Workflows (Lint, Test, Deploy)
├── .vscode/                 # Shared workspace settings
├── apps/                    # Deployable applications
│   ├── web/                 # Next.js Frontend (Public + Dashboards)
│   └── api/                 # Node.js Backend API
├── packages/                # Shared internal libraries
│   ├── database/            # Prisma/Drizzle schema & migrations
│   ├── ui/                  # Design System (The tokens & components we built)
│   ├── config/              # Shared ESLint, TSConfig, Tailwind presets
│   └── shared-types/        # Zod Schemas & TypeScript interfaces (DTOs)
├── tools/                   # Build scripts & generators
├── docker-compose.yml       # Local dev environment (Postgres, Redis)
├── package.json             # Root dependencies & workspaces config
├── turbo.json               # Monorepo build pipeline config
└── README.md                # Project documentation entry point
```

---

## 3. Frontend Structure (`apps/web`)

**Tech:** Next.js (App Router), React, Tailwind CSS.
**Strategy:** distinct Layouts for Public vs. Dashboard areas.

```plaintext
apps/web/
├── src/
│   ├── app/                     # App Router (Routes & Layouts)
│   │   ├── (public)/            # Marketing Website (SEO optimized)
│   │   │   ├── layout.tsx       # Public Navbar/Footer
│   │   │   ├── page.tsx         # Home
│   │   │   ├── about/
│   │   │   └── global.css       # Imports 'packages/ui/variables.css'
│   │   │
│   │   ├── (auth)/              # Authentication Routes
│   │   │   ├── login/
│   │   │   └── register/
│   │   │
│   │   ├── (dashboard)/         # Secure Area (Requires Auth)
│   │   │   ├── layout.tsx       # Sidebar, AuthGuard, UserState
│   │   │   ├── shooter/         # Shooter Role Views
│   │   │   │   ├── profile/
│   │   │   │   └── my-scores/
│   │   │   └── admin/           # Admin Role Views
│   │   │       ├── users/
│   │   │       ├── competitions/
│   │   │       └── payments/
│   │   │
│   │   └── api/                 # Next.js API Routes (Server Actions proxy)
│   │
│   ├── components/              # Local components (not valid for shared UI)
│   │   ├── forms/
│   │   └── layout/
│   │
│   ├── features/                # Feature-based architecture
│   │   ├── scoring/             # Scoring specific UI logic
│   │   │   ├── ScoreCard.tsx
│   │   │   └── useScoreCalculator.ts
│   │   └── events/
│   │
│   └── lib/                     # Infrastructure
│       ├── api-client.ts        # Typed fetch wrapper for apps/api
│       └── utils.ts
│
├── public/                      # Static assets
└── next.config.js
```

---

## 4. Backend Structure (`apps/api`)

**Tech:** Node.js (Express/Fastify), TypeScript.
**Architecture:** Modular Monolith (Vertical Slices).

```plaintext
apps/api/
├── src/
│   ├── config/                  # Environment variables checks
│   ├── core/                    # Core Architecture
│   │   ├── middlewares/         # Error handling, Logging, Auth Guard
│   │   ├── database.ts          # Connection pool
│   │   └── app.ts               # App entry point
│   │
│   ├── modules/                 # VERTICAL SLICES (Domain Driven)
│   │   ├── auth/                # Authentication Domain
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   └── auth.routes.ts
│   │   │
│   │   ├── shooters/            # Shooter Management
│   │   │   ├── shooter.entity.ts
│   │   │   ├── shooter.service.ts   # Profile logic, handicap calc
│   │   │   └── shooter.controller.ts
│   │   │
│   │   ├── competitions/        # Event Management
│   │   │   ├── competition.model.ts
│   │   │   └── competition.service.ts
│   │   │
│   │   └── scores/              # The Core Domain
│   │       ├── scores.service.ts    # Ranking algorithms
│   │       ├── scores.validator.ts
│   │       └── scores.repository.ts
│   │
│   └── shared/                  # Shared helpers unique to backend
│       └── mailer/              # Email service (SendGrid/AWS SES)
│
├── tests/                       # Integration tests
└── package.json
```

---

## 5. Database & Shared logic (`packages/`)

### `packages/database`

Centralized database schema ensures the Frontend doesn't access DB directly, but the types are generated from here.

```plaintext
packages/database/
├── prisma/
│   ├── schema.prisma            # Single source of truth for DB
│   └── migrations/              # SQL migration history
├── src/
│   ├── seed.ts                  # Seed data for dev
│   └── index.ts                 # Exports the PrismaClient instance
└── package.json
```

### `packages/shared-types`

Ensures frontend and backend speak the same language.

```plaintext
packages/shared-types/
├── src/
│   ├── dtos/                    # Data Transfer Objects
│   │   ├── shooter.dto.ts
│   │   └── score.dto.ts
│   ├── enums/
│   │   └── roles.enum.ts        # 'ADMIN', 'SHOOTER', 'COACH'
│   └── api-responses.ts         # Standard API response shapes
└── package.json
```

---

## 6. Implementation Principles

### A. Separation of Concerns

- **Frontend** should contain _zero_ business logic related to ranking calculations or payment verification. It only displays data.
- **Backend** is the authority. It validates every request using Zod schemas from `packages/shared-types`.

### B. Security

1.  **RBAC (Role-Based Access Control):**
    - Middleware in `apps/api` checks JWT roles (`admin`, `shooter`).
    - Frontend Layouts in `(dashboard)/admin` check roles and redirect unauthorized access.
2.  **Edge-Ready:**
    - Deployment on Vercel (Frontend) and AWS/Render (Backend) supported.

### C. Scalability

- **Folder scalability:** New features (e.g., "AI Coach") become a new folder in `apps/api/src/modules/ai-coach` and `apps/web/src/features/ai-coach`.
- **Team scalability:** Backend team works in `apps/api`, Frontend in `apps/web`. No conflicts.

---
