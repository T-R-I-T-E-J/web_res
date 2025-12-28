# Frontend Master Guide

**Date**: 2025-12-28
**Stack**: Next.js (App Router), TailwindCSS, TypeScript

---

## 1. Architecture

### Folder Structure (`apps/web/src/app`)

- **(public)**: Public-facing pages (Home, About, Results).
  - Uses `PublicLayout` (Navbar, Footer).
- **(dashboard)**: Protected Admin/User Dashboard.
  - Uses `DashboardLayout` (Sidebar, Header).
  - **admin/**: Admin specific routes (Scores, Users).
  - **user/**: Shooter specific routes (Profile, History).

### Component Strategy

- **Atomic Components**: Reusable UI elements (`Button`, `Card`, `Input`).
- **Feature Components**: Business logic specific (`ResultUploadForm`, `UserList`).
- **Layout Components**: Page wrappers (`Sidebar`, `DashboardHeader`).

---

## 2. Design System

### Aesthetic Principles

- **Theme**: "Government Professional" (Clean, high contrast, authoritative).
- **Typography**: Inter / Sans-serif.
- **Colors**:
  - Primary: Deep Blue/Purple.
  - Neutral: Grays for backgrounds/text.
  - Functional: Green (Success), Red (Error), Amber (Warning).

### Tailwind Configuration

- Custom tokens defined in `tailwind.config.ts`.
- Usage: `text-primary`, `bg-neutral-100`, `rounded-card`.

---

## 3. UX Flows

### Admin: Results Management

1.  **Login**: Access `/admin` via keycloak/JWT.
2.  **Dashboard**: View Overview (Stats).
3.  **Manage Results**: Navigate to `/admin/scores`.
    - **Upload**: Complete Form -> Submit -> Feedback.
    - **Delete**: Click trash icon -> Confirm -> Refresh.

### Public: View Results

1.  **Navigate**: Go to `/results`.
2.  **Browse**: View list of Years/Competitions.
3.  **Download**: Click PDF icon to view result file.

---

## 4. Key Libraries & Tools

- **Lucide React**: Iconography.
- **Clsx / Tailwind-Merge**: Dynamic class handling.
- **React Hook Form**: (Planned) Form handling.
- **Zod**: (Planned) Client-side validation scheme.
