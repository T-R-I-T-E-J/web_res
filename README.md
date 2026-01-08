# Para Shooting Committee of India - Digital Platform

Welcome to the official source code repository for the Para Shooting Committee of India's digital platform. This project is a comprehensive full-stack web application designed to manage the committee's public presence, shooter operations, competitions, and administrative functions.

## 🚀 Quick Start

### Current Running Services

- **Frontend:** http://localhost:3000 (Next.js 14 + React 18)
- **Backend API:** http://localhost:4000/api/v1 (NestJS 11 + TypeScript)
- **Database:** localhost:5432 (PostgreSQL 16)
- **Redis:** localhost:6379 (Redis 7)
- **pgAdmin:** http://localhost:8081 (admin@psci.in / admin123)

### First Time Setup

For detailed setup instructions and default admin credentials, see:
**[📖 Setup Guide](./docs/SETUP_GUIDE.md)**

### Start Development

```bash
# Start database
docker-compose up -d

# Start backend (in one terminal)
cd apps/api
npm run start:dev

# Start frontend (in another terminal)
cd apps/web
npm run dev
```

## 🏗️ Project Architecture

This project follows a **Monorepo Architecture** to ensure detailed separation of concerns while maximizing code reuse and scalability.

### Directory Structure

```plaintext
/
├── apps/                    # Deployable Applications
│   ├── web/                 # Next.js Frontend (Public Site + Dashboard)
│   │   └── public/          # Current static prototype & assets
│   └── api/                 # Node.js/TypeScript Backend API
│
├── packages/                # Shared Libraries
│   ├── database/            # Database Schema (Prisma) & Migrations
│   ├── ui/                  # Design System Components
│   └── shared-types/        # Shared TypeScript Interfaces & DTOs
│
├── docs/                    # Architectural Documentation
│   ├── DESIGN_SYSTEM.md     # Brand Identity, Tokens, & UI Guidelines
│   └── PROJECT_ARCHITECTURE.md # Detailed Architectural Blueprint
│
├── rules/                   # Coding Standards & Best Practices
│   ├── postgresql.mdc       # SQL Naming & Design Rules
│   ├── cti-schema-design.md # DB Primary Keys & Column Patterns
│   └── ui-ux-best-practices.mdc # UX & Accessibility Guidelines
│
└── README.md                # Project Entry Point
```

## 🚀 Getting Started

### Prerequisites

- Node.js (LTS recommended)
- Git

### Current Status

The project is currently in the **Migration Phase**.

- **Legacy/Static Code**: Located in `apps/web/public`. This contains the initial HTML/CSS implementation of the new Design System.
- **Governance**: Strict rules for database and UI implementation are defined in the `rules/` directory.
- **Recent Fixes**: See [ISSUES_SOLVED_README.md](./ISSUES_SOLVED_README.md) for details on the Static File 404 fix and documentation cleanup.

## 📚 Documentation

Detailed guides to understand the system's design and architecture.

- **[Design System](./docs/DESIGN_SYSTEM.md)**<br>
  The single source of truth for Color Palette, Typography, Accessibility (WCAG 2.1), and token usage.

- **[Project Architecture](./docs/PROJECT_ARCHITECTURE.md)**<br>
  Deep dive into the Monorepo structure, Vertical Slice architecture for the backend, and tech stack decisions.

## 📏 Rules & Standards

Mandatory guidelines for all contributors.

- **[PostgreSQL Rules](./rules/postgresql.mdc)**<br>
  Naming conventions, SQL formatting, and best practices for the database layer.

- **[Database Schema Patterns](./rules/cti-schema-design.md)**<br>
  Reference implementation for Primary Keys (`BIGSERIAL` + `UUID`), Column Types, and constraints.

- **[UI/UX Best Practices](./rules/ui-ux-design-best-practices.mdc)**<br>
  Checklist for ensuring a consistent, accessible, and professional user experience.

## 🛠️ Tech Stack (Planned)

- **Frontend**: Next.js 14+ (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Node.js + TypeScript (NestJS or Express)
- **Database**: PostgreSQL
- **Authentication**: JWT + RBAC
- **Payments**: Razorpay
- **DevOps**: Docker, CI/CD Pipelines

---

_Para Shooting Committee of India &copy; 2025_
