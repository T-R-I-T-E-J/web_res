# Frontend Architecture & UX Strategy

**Role:** Senior Frontend Architect
**Scope:** Routing, UX Flows, Page Hierarchy, and Migration Strategy
**Tech Stack:** Next.js 14+ (App Router), TypeScript, Tailwind CSS

---

## 1. Frontend Routing Patterns

Our routing strategy prioritizes **Security**, **SEO**, and **User Experience**. We distinguish strictly between public content (search-indexable) and private dashboards (secure, client-rendered interactivity).

### A. Route Classification

| Route Type    | Access Control        | Rendering Strategy     | Caching      | Example URL             |
| :------------ | :-------------------- | :--------------------- | :----------- | :---------------------- |
| **Public**    | Open to all           | Server Component (RSC) | Static / ISR | `/`, `/news`, `/events` |
| **Auth**      | Public (Guest only)   | Client Component       | None         | `/login`, `/register`   |
| **Protected** | Authenticated Users   | Client/Server Mixed    | Dynamic      | `/dashboard`            |
| **RBAC**      | Role Specific (Admin) | Client/Server Mixed    | Dynamic      | `/admin/access-control` |

### B. Guarding Strategy (Middleware)

We do **not** rely solely on client-side redirects for security. We use Next.js Middleware (`middleware.ts`) to intercept requests at the edge.

- **Check 1:** Is route secure? → No Token? → Redirect to `/login`.
- **Check 2:** Is user logged in but visiting `/login`? → Redirect to `/dashboard`.
- **Check 3:** Role Verification. Is Shooter trying to access `/admin`? → Redirect to `/403-unauthorized`.

---

## 2. Route Group Implementation (App Router)

We leverage **Route Groups** (folders in parenthesis) to create distinct layouts without affecting the URL structure.

```plaintext
apps/web/src/app/
├── (public)/                # Marketing & Info Site
│   ├── layout.tsx           # Standard Navbar + Footer
│   ├── page.tsx             # Home ("/")
│   ├── about/               # ("/about")
│   └── events/              # ("/events")
│       └── [slug]/          # Event Details
│
├── (auth)/                  # Authentication
│   ├── layout.tsx           # Clean, centered layout (No Nav)
│   ├── login/               # ("/login")
│   ├── register/            # ("/register")
│   └── forgot-password/     # ("/forgot-password")
│
├── (dashboard)/             # Shared Authenticated Area
│   ├── layout.tsx           # AuthGuard + UserState Provider
│   │
│   ├── shooter/             # Shooter Role Group
│   │   ├── layout.tsx       # Shooter Sidebar
│   │   ├── page.tsx         # Dashboard Overview ("/shooter")
│   │   ├── my-scores/       # ("/shooter/my-scores")
│   │   └── upcoming/        # ("/shooter/upcoming")
│   │
│   └── admin/               # Admin Role Group
│       ├── layout.tsx       # Admin Sidebar (High density)
│       ├── page.tsx         # Admin Overview ("/admin")
│       ├── users/           # ("/admin/users")
│       └── scores/          # ("/admin/scores")
│
└── api/                     # Route Handlers
```

### Why this structure?

1.  **(public)**: Allows us to use a "Marketing Layout" (Hero banners, sticky nav) distinct from the dense "App Application Layout".
2.  **(auth)**: Removes distractions. No footer, no navigation links. Just the form.
3.  **Nested Layouts**: `(dashboard)/shooter/layout.tsx` ensures a Shooter _never_ sees Admin navigation items, even if they inspect the DOM. The layout simply doesn't render them.

---

## 3. UX Flow Documentation

### Flow A: Public Visitor (Discovery)

_Goal: Information retrieval and Registration._

1.  **Landing**: User arrives at `/`. Sees Hero Banner with "Latest Gold Medalist".
2.  **Browse**: Clicks "Events". Filters by "National".
3.  **Detail**: Clicks specific event. Reads "Rules" and "Qualification Score".
4.  **Action**: Clicks "Register".
5.  **Gate**: System detects guest status -> Redirects to `/login?redirect=/events/national-2025`.

### Flow B: Shooter (Daily Operations)

_Goal: Check ranking and log scores._

1.  **Login**: Enters credentials at `/login`.
2.  **Dashboard**: Lands on `/shooter`. Sees "Next Match: 2 Days" widget.
3.  **Action**: Clicks "My Scores".
4.  **Interaction**: Views history graph. Downloads PDF certificate of last match.
5.  **Navigation**: Uses sidebar to go to "Profile". Updates "Gun License Number".

### Flow C: Admin (Management)

_Goal: Verify scores and manage users._

1.  **Login**: Enters Admin credentials.
2.  **Admin Dashboard**: Lands on `/admin`. Sees "3 Pending User Approvals".
3.  **Task**: Clicks "Users". Filters by "Status: Pending".
4.  **Review**: Opens "User Detail Modal". Verifies ID proof.
5.  **Decision**: Clicks "Approve". Toast notification appears: "User Activated".

---

## 4. UX Flow Page Hierarchy

Visualizing the depth of navigation to prevent "deep linking" confusion.

- **Home** `/`

  - **About Us** `/about`
    - Committee Members
    - History
  - **Events** `/events`
    - Event Detail `[id]`
      - Start List
      - Results
  - **News** `/news`
  - **Contact** `/contact`

- **Shooter Portal** `/shooter`

  - **Overview** (Home)
  - **My Profile**
    - Personal Info
    - Equipment Details
  - **My Scores**
    - Historical Data
    - Rankings
  - **Competitions**
    - My Entries
    - Entry Forms

- **Admin Console** `/admin`
  - **Overview**
  - **User Management**
    - Shooters
    - Coaches
    - Admins
  - **Competition Management**
    - Create Event
    - Manage Entries
  - **Scorekeeping**
    - Verify Scores
    - Publish Results

---

## 5. Page Migration Guide

Standardizing the transition from Legacy (hypothetical PHP/HTML) to Modern Next.js.

| Legacy URL (Old)      | New Route (Next.js) | Naming Convention                  | SEO Action            |
| :-------------------- | :------------------ | :--------------------------------- | :-------------------- |
| `index.php`           | `/`                 | `page.tsx`                         | 301 Redirect          |
| `about_us.html`       | `/about`            | `about/page.tsx`                   | Update Meta Tags      |
| `login.php`           | `/login`            | `(auth)/login/page.tsx`            | No Index (Robots.txt) |
| `user_dashboard.php`  | `/shooter`          | `(dashboard)/shooter/page.tsx`     | No Index              |
| `event_list.php?id=5` | `/events/[id]`      | `events/[id]/page.tsx`             | Canonical Tag         |
| `admin/users.php`     | `/admin/users`      | `(dashboard)/admin/users/page.tsx` | No Index              |

**Key Migration Rule:** Ensure strict lowercase URLs with hyphens (kebab-case). No underscores (`_`) in public URLs.

---

## 6. Page Status Report

A living document to track the implementation of the UX architecture.

| Page / Component | Route                | Status         | Owner    | Notes                |
| :--------------- | :------------------- | :------------- | :------- | :------------------- |
| **Public**       |                      |                |          |                      |
| Home Page        | `/`                  | 🟡 In Progress | Frontend | Hero section pending |
| About Us         | `/about`             | 🔴 Not Started | Content  | Waiting for text     |
| Event List       | `/events`            | 🔴 Not Started | Frontend | Needs API            |
| **Auth**         |                      |                |          |                      |
| Login Form       | `/login`             | 🟢 Implemented | Security | JWT integration done |
| Register         | `/register`          | 🟡 In Progress | Frontend | Validation pending   |
| **Shooter**      |                      |                |          |                      |
| Dashboard        | `/shooter`           | 🔴 Not Started | Frontend | Widget design needed |
| My Scores        | `/shooter/my-scores` | 🔴 Not Started | Backend  | API blocked          |
| **Admin**        |                      |                |          |                      |
| User List        | `/admin/user`        | 🔴 Not Started | Frontend |                      |

_Legend: 🟢 Complete, 🟡 In Progress, 🔴 Not Started, ⚪ Deprecated_

---

## 7. Missing Pages Analysis (Gap Analysis)

We have identified critical missing pages often overlooked in sports platforms:

1.  **Accessibility Statement (`/accessibility`)**:

    - _Why:_ Critical for a Para-sports committee. Compliance requirement.
    - _Role:_ Public.

2.  **Anti-Doping Policy / Integrity (`/integrity`)**:

    - _Why:_ Mandatory for sports governance compliance.
    - _Role:_ Public.

3.  **Maintenance Mode / 503 Page**:

    - _Why:_ Graceful handling during server upgrades.
    - _Role:_ System.

4.  **"Onboarding" Wizard**:

    - _Why:_ After registration, a shooter needs to upload ID, Gun License, and Classification _before_ they can do anything. Providing a dedicated `/onboarding` flow reduces support tickets.
    - _Role:_ Shooter (First Time).

5.  **Audit Logs**:
    - _Why:_ Admins need to see _who_ changed a score.
    - _Role:_ Admin.

---
