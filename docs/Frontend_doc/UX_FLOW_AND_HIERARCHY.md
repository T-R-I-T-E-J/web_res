# UX Flows & Information Architecture Strategy

**Role:** Senior UX Architect
**Context:** Para Shooting Committee of India Platform
**Version:** 1.0

---

## 1. UX Flow Documentation

Detailed step-by-step user journeys for the three core personas. These flows prioritize clarity, accessibility, and task completion.

### A. Public User Flows (Informational)

#### 1. Content Discovery & Event Browsing

_Goal: A visitor wants to find details about an upcoming national championship._

- **Entry**: Landing Page (`/`)
- **Step 1**: User sees "Upcoming Events" prominently displayed in the Hero section or clicks "Championships" in the main navigation.
- **Step 2**: **Decision Point**:
  - _If specific event known_: Uses Search bar.
  - _If browsing_: Clicks "View Calendar" or specific event card.
- **Step 3**: Arrives at **Event Detail Page**. Reviews dates, venue, eligibility rules, and "Qualification Score" (MQS).
- **Step 4**: **Action**: Clicks "Circular" or "Start List" to download PDF.
- **Success**: File downloads successfully.
- **Alt Path**: User clicks "Register" -> System checks session -> Redirects to Login if guest.

#### 2. Checking Results & Rankings

_Goal: A coach/fan wants to see the latest rankings._

- **Entry**: Global Navigation -> "Results & Rankings"
- **Step 1**: User lands on **Rankings Hub**.
- **Step 2**: Selects Category (e.g., "10M Air Rifle - SH1").
- **Step 3**: List updates via AJAX (no page reload) to show current standings.
- **Step 4**: User clicks on a Shooter's Name.
- **Step 5**: Viewing **Public Shooter Profile** (Limited view: Name, State, Recent Medals).
- **Success**: Information retrieved without login barrier.

---

### B. Shooter / Athlete Flows (Authenticated)

#### 1. Onboarding & Profile Completion (Critical)

_Goal: A newly registered shooter needs to verify their identity to compete._

- **Entry**: Post-Registration -> Redirected to **Shooter Dashboard (`/shooter`)**.
- **State**: Dashboard shows "Profile Incomplete" alert (Red Banner).
- **Step 1**: Clicks "Complete Profile".
- **Step 2**: **Form Wizard**:
  - _Section A_: Personal Info (DOB, Address).
  - _Section B_: Medical/Para Classification (Upload Certificate).
  - _Section C_: Gun License Details (Upload Scan).
- **Step 3**: Clicks "Submit for Verification".
- **Step 4**: **Success State**: Status changes to "Under Review". Dashboard features remain locked until Admin approval.

#### 2. Event Registration & Payment

_Goal: Registering for an upcoming match._

- **Entry**: Dashboard -> "Upcoming Events".
- **Step 1**: User views list of eligible events (filtered by their classification).
- **Step 2**: Clicks "Register" on specific event.
- **Step 3**: **Eligibility Check (System)**: System verifies MQS (Minimum Qualification Score) automatically.
  - _Failure_: "You do not meet MQS requirements."
  - _Success_: Proceeds to Confirmation.
- **Step 4**: **Payment Gateway**: Selects payment method (Razorpay).
- **Step 5**: **Transaction**: Complete.
- **Step 6**: Redirected to "My Entries". Status: "Confirmed".
- **Success**: Confirmation Email received.

---

### C. Admin User Flows (Management)

#### 1. Shooter Verification

_Goal: Approving a new shooter's documents._

- **Entry**: Admin Dashboard -> "Overview". Value: "5 Pending Approvals".
- **Step 1**: Clicks "Approvals Queue".
- **Step 2**: Selects a pending user. Screen splits: Form Data (Left) vs Document Preview (Right).
- **Step 3**: **Action**:
  - _Option A_: **Approve** -> User becomes Active.
  - _Option B_: **Reject** -> Admin _must_ select a reason (e.g., "Blurry Document") from dropdown or type note.
- **Success**: Toast notification "User Updated". Email trigger sent to Shooter.

#### 2. Publishing Scores

_Goal: Updating the system with match results._

- **Entry**: Admin Dashboard -> "Scores & Results".
- **Step 1**: Selects Competition.
- **Step 2**: **Data Ingestion**:
  - _Option A_: Manual Entry (Grid view).
  - _Option B_: Upload CSV/Excel (Sius-Ascor format).
- **Step 3**: System validates data (e.g., checks for impossible scores).
- **Step 4**: **Review**: Preview generated ranking list.
- **Step 5**: Clicks "Publish".
- **Success**: Results go live on Public site immediately.

---

## 2. UX Flow Page Hierarchy (Information Architecture)

### A. Top-Level Navigation (Global)

**Behavior**: Sticky on scroll. Responsive (Hamburger on mobile).

1.  **Home** (Logo)
2.  **About Us** (Dropdown: History, Committee, Anti-Doping)
3.  **Championships** (Dropdown: Calendar, Results, Records)
4.  **News**
5.  **Shooters** (Public directory)
6.  **Contact**
7.  **Login / Register** (Prominent Button)
    - _Swaps to "My Dashboard" if logged in._

### B. Public Website Tree

- **Home** `/`
  - Hero (News/Event highlight)
  - Quick Links (Calendar, Rankings)
- **About** `/about`
  - Mission & Vision
  - Committee Members
  - Constitution & Policies
- **Championships** `/events`
  - **Calendar** (Grid/List view)
  - **Event Detail** `/events/[slug]`
    - Tabs: Overview, Schedule, Start List, Results
- **Results & Rankings** `/rankings`
  - Current National Rankings
  - Archive (Past Years)
- **Downloads** `/downloads`
  - Forms, Circulars, Rules

### C. Shooter Dashboard Tree (Private)

**Layout**: Sidebar Navigation (Collapsible).

- **Dashboard Home** `/shooter` (Overview Widget)
- **My Profile** `/shooter/profile`
  - Personal Details
  - Equipment Registry
  - Documents (ID, Medical)
- **My Scores** `/shooter/scores`
  - Performance Graph
  - Match History List
- **Competitions** `/shooter/events`
  - **Upcoming** (Registration available)
  - **My Entries** (Status, Admit Cards)
- **Payments** `/shooter/payments`
  - Transaction History
  - Invoices
- **Settings** `/shooter/settings`
  - Password Change
  - Notification Preferences

### D. Admin Dashboard Tree (Private)

**Layout**: High-density Sidebar. Darker theme to distinguish from User view.

- **Overview** `/admin` (Stats: Active Users, Revenue, Pending Tasks)
- **User Management** `/admin/users`
  - **All Users** (Search/Filter)
  - **Approvals Queue** (Badge with count)
  - **Roles & Permissions**
- **Competition Manager** `/admin/competitions`
  - Create New Event
  - Manage Entries (Start List generation)
- **Scores & Results** `/admin/scores`
  - Score Entry Interface
  - Ranking Algorithm Settings
- **Content (CMS)** `/admin/content`
  - Post News
  - Upload Circulars
- **Financials** `/admin/finance`
  - Payment Reconciliation
  - Reports

---

## 3. UX Design Principles & Patterns

### 1. Navigation Patterns

- **Breadcrumbs**: Mandatory on all pages except Home and Dashboard Overview.
  - _Format_: Home > Championships > Nationals 2025
- **Deep Linking**: All drawers/modals (e.g., Event Details) should have unique URLs to allow sharing.
- **Mobile Experience**:
  - **Public**: Hamburger menu.
  - **Dashboards**: Bottom Navigation Bar or "Off-canvas" sidebar for critical actions.

### 2. Accessibility (WCAG 2.1 AA)

- **Focus Management**: When a modal opens, focus moves to it. When closed, focus returns to the trigger button.
- **Skip Links**: "Skip to Main Content" link as the first tab target.
- **Data Tables**:
  - Shooting is data-heavy. Tables on mobile must use horizontal scroll or "Card View" fallback.
  - Sortable columns must have aria-sort attributes.

### 3. Role Separation (Cognitive Load)

- **Shooter View**: Optimistic, encourging, focuses on "My Journey". Use Green/Blue accents.
- **Admin View**: Critical, density-optimized, focuses on "Monitoring". Use Navy/Grey structure to reduce eye strain during long sessions.

### 4. Feedback Loops

- **Destructive Actions**: (Delete, Reject) require a double-confirmation modal.
- **Long Processes**: (Score calculation, Report generation) must show a Progress Bar, not just a spinner.
- **Empty States**: Never leave a blank page. If "No Upcoming Events", show text: "Season ended. Check back in January."

---
