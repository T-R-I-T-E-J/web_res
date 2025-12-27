# Database Schema - Complete DDL Reference

> Para Shooting Committee of India - Database Schema Documentation
> Version: 1.0 | Last Updated: December 2025

---

## Table of Contents

1. [Overview](#overview)
2. [Naming Conventions](#naming-conventions)
3. [Schema Domains](#schema-domains)
4. [Table Definitions](#table-definitions)
5. [Indexes](#indexes)
6. [Triggers & Functions](#triggers--functions)
7. [Views](#views)

---

## Overview

This document provides the complete Data Definition Language (DDL) specification for the Para Shooting Committee of India platform. The schema follows PostgreSQL best practices as defined in `rules/postgresql.mdc`.

### Database Configuration

| Setting | Value |
|---------|-------|
| Database Engine | PostgreSQL 15+ |
| Schema | `public` |
| Character Set | UTF-8 |
| Collation | en_US.UTF-8 |
| Timezone | UTC |

---

## Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Tables | snake_case, plural | `users`, `shooting_events` |
| Columns | snake_case, singular | `first_name`, `created_at` |
| Primary Keys | `id` (bigint identity) | `id bigint generated always as identity` |
| Foreign Keys | `{table_singular}_id` | `user_id`, `competition_id` |
| Indexes | `idx_{table}_{column(s)}` | `idx_users_email` |
| Unique Constraints | `uq_{table}_{column(s)}` | `uq_users_email` |
| Check Constraints | `chk_{table}_{condition}` | `chk_scores_value_positive` |

---

## Schema Domains

```
┌─────────────────────────────────────────────────────────────────┐
│                    PARA SHOOTING DATABASE                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │    AUTH      │  │   SHOOTERS   │  │ COMPETITIONS │          │
│  ├──────────────┤  ├──────────────┤  ├──────────────┤          │
│  │ users        │  │ shooters     │  │ venues       │          │
│  │ roles        │  │ disability_  │  │ event_       │          │
│  │ user_roles   │  │  categories  │  │  categories  │          │
│  │ user_sessions│  │ shooter_     │  │ shooting_    │          │
│  │              │  │  classifica- │  │  events      │          │
│  │              │  │  tions       │  │ competitions │          │
│  │              │  │ state_       │  │ competition_ │          │
│  │              │  │  associations│  │  events      │          │
│  │              │  │              │  │ competition_ │          │
│  │              │  │              │  │  entries     │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   SCORES     │  │   PAYMENTS   │  │   CONTENT    │          │
│  ├──────────────┤  ├──────────────┤  ├──────────────┤          │
│  │ scores       │  │ membership_  │  │ news_articles│          │
│  │ rankings     │  │  types       │  │ notifications│          │
│  │              │  │ memberships  │  │ document_    │          │
│  │              │  │ payments     │  │  categories  │          │
│  │              │  │ refunds      │  │ documents    │          │
│  │              │  │              │  │ contact_     │          │
│  │              │  │              │  │  messages    │          │
│  │              │  │              │  │ committee_   │          │
│  │              │  │              │  │  members     │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                  │
│  ┌──────────────┐                                               │
│  │    SYSTEM    │                                               │
│  ├──────────────┤                                               │
│  │ audit_logs   │                                               │
│  │ scheduled_   │                                               │
│  │  jobs        │                                               │
│  └──────────────┘                                               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Table Definitions

### Domain 1: Authentication & Users

#### Table: `users`

Base user accounts for all platform users.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `bigint` | `generated always as identity primary key` | Internal primary key |
| `public_id` | `uuid` | `not null default gen_random_uuid() unique` | External API identifier |
| `email` | `varchar(255)` | `not null unique` | Login email address |
| `password_hash` | `varchar(255)` | `not null` | Bcrypt hashed password |
| `first_name` | `varchar(100)` | `not null` | User's first name |
| `last_name` | `varchar(100)` | `not null` | User's last name |
| `phone` | `varchar(20)` | | Contact phone number |
| `avatar_url` | `text` | | Profile picture URL |
| `email_verified_at` | `timestamptz` | | Email verification timestamp |
| `is_active` | `boolean` | `not null default true` | Account active status |
| `last_login_at` | `timestamptz` | | Last successful login |
| `created_at` | `timestamptz` | `not null default now()` | Record creation time |
| `updated_at` | `timestamptz` | `not null default now()` | Last modification time |
| `deleted_at` | `timestamptz` | | Soft delete timestamp |

```sql
create table public.users (
    id bigint generated always as identity primary key,
    public_id uuid not null default gen_random_uuid() unique,
    email varchar(255) not null unique,
    password_hash varchar(255) not null,
    first_name varchar(100) not null,
    last_name varchar(100) not null,
    phone varchar(20),
    avatar_url text,
    email_verified_at timestamptz,
    is_active boolean not null default true,
    last_login_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    deleted_at timestamptz
);

comment on table public.users is 'Base user accounts for authentication and profile information. All platform users have an entry here.';
```

---

#### Table: `roles`

Role definitions for RBAC (Role-Based Access Control).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `bigint` | `generated always as identity primary key` | Internal primary key |
| `name` | `varchar(50)` | `not null unique` | Role identifier |
| `display_name` | `varchar(100)` | `not null` | Human-readable name |
| `description` | `text` | | Role description |
| `permissions` | `jsonb` | `not null default '{}'` | Permission flags |
| `is_system` | `boolean` | `not null default false` | System role (non-deletable) |
| `created_at` | `timestamptz` | `not null default now()` | Record creation time |

```sql
create table public.roles (
    id bigint generated always as identity primary key,
    name varchar(50) not null unique,
    display_name varchar(100) not null,
    description text,
    permissions jsonb not null default '{}',
    is_system boolean not null default false,
    created_at timestamptz not null default now()
);

comment on table public.roles is 'Role definitions for RBAC. System roles include: admin, shooter, coach, official.';
```

**Default Roles:**

| Name | Display Name | Description |
|------|--------------|-------------|
| `admin` | Administrator | Full system access |
| `shooter` | Shooter | Registered para-shooter |
| `coach` | Coach | Team coach with limited access |
| `official` | Official | Competition official |
| `viewer` | Viewer | Read-only public access |

---

#### Table: `user_roles`

Many-to-many relationship between users and roles.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `bigint` | `generated always as identity primary key` | Internal primary key |
| `user_id` | `bigint` | `not null references users(id) on delete cascade` | User reference |
| `role_id` | `bigint` | `not null references roles(id) on delete cascade` | Role reference |
| `assigned_by` | `bigint` | `references users(id)` | Admin who assigned role |
| `assigned_at` | `timestamptz` | `not null default now()` | Assignment timestamp |
| `expires_at` | `timestamptz` | | Optional expiration |

```sql
create table public.user_roles (
    id bigint generated always as identity primary key,
    user_id bigint not null references public.users(id) on delete cascade,
    role_id bigint not null references public.roles(id) on delete cascade,
    assigned_by bigint references public.users(id),
    assigned_at timestamptz not null default now(),
    expires_at timestamptz,
    unique(user_id, role_id)
);

comment on table public.user_roles is 'Junction table for user-role assignments. Supports temporary role assignments via expires_at.';
```

---

#### Table: `user_sessions`

Active user sessions for JWT management.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `bigint` | `generated always as identity primary key` | Internal primary key |
| `user_id` | `bigint` | `not null references users(id) on delete cascade` | User reference |
| `token_hash` | `varchar(255)` | `not null unique` | Hashed refresh token |
| `device_info` | `jsonb` | | Device/browser information |
| `ip_address` | `inet` | | Client IP address |
| `user_agent` | `text` | | Browser user agent |
| `last_active_at` | `timestamptz` | `not null default now()` | Last activity timestamp |
| `expires_at` | `timestamptz` | `not null` | Session expiration |
| `created_at` | `timestamptz` | `not null default now()` | Session creation time |

```sql
create table public.user_sessions (
    id bigint generated always as identity primary key,
    user_id bigint not null references public.users(id) on delete cascade,
    token_hash varchar(255) not null unique,
    device_info jsonb,
    ip_address inet,
    user_agent text,
    last_active_at timestamptz not null default now(),
    expires_at timestamptz not null,
    created_at timestamptz not null default now()
);

comment on table public.user_sessions is 'Active user sessions for JWT refresh token management. Sessions older than 30 days are auto-purged.';
```

---

### Domain 2: Shooters & Classification

#### Table: `state_associations`

Member state/unit associations affiliated with Para Shooting.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `bigint` | `generated always as identity primary key` | Internal primary key |
| `code` | `varchar(10)` | `not null unique` | State code (e.g., MH, DL) |
| `name` | `varchar(200)` | `not null` | Full association name |
| `state` | `varchar(100)` | `not null` | State/territory name |
| `secretary_name` | `varchar(200)` | | Current secretary |
| `secretary_email` | `varchar(255)` | | Secretary email |
| `secretary_phone` | `varchar(20)` | | Secretary phone |
| `address` | `text` | | Registered address |
| `is_active` | `boolean` | `not null default true` | Active membership |
| `affiliated_since` | `date` | | Affiliation date |
| `created_at` | `timestamptz` | `not null default now()` | Record creation time |
| `updated_at` | `timestamptz` | `not null default now()` | Last modification time |

```sql
create table public.state_associations (
    id bigint generated always as identity primary key,
    code varchar(10) not null unique,
    name varchar(200) not null,
    state varchar(100) not null,
    secretary_name varchar(200),
    secretary_email varchar(255),
    secretary_phone varchar(20),
    address text,
    is_active boolean not null default true,
    affiliated_since date,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

comment on table public.state_associations is 'State/unit rifle associations affiliated with Para Shooting Committee of India.';
```

---

#### Table: `disability_categories`

WSPS (World Para Shooting) sport classification categories.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `bigint` | `generated always as identity primary key` | Internal primary key |
| `code` | `varchar(10)` | `not null unique` | Classification code |
| `name` | `varchar(100)` | `not null` | Full classification name |
| `description` | `text` | `not null` | Detailed description |
| `event_type` | `varchar(20)` | `not null` | RIFLE, PISTOL, or BOTH |
| `min_impairment` | `text` | | Minimum eligible impairment |
| `equipment_allowed` | `jsonb` | | Allowed adaptive equipment |
| `is_active` | `boolean` | `not null default true` | Currently in use |
| `created_at` | `timestamptz` | `not null default now()` | Record creation time |

```sql
create table public.disability_categories (
    id bigint generated always as identity primary key,
    code varchar(10) not null unique,
    name varchar(100) not null,
    description text not null,
    event_type varchar(20) not null check (event_type in ('RIFLE', 'PISTOL', 'BOTH')),
    min_impairment text,
    equipment_allowed jsonb,
    is_active boolean not null default true,
    created_at timestamptz not null default now()
);

comment on table public.disability_categories is 'World Para Shooting (WSPS) sport classification categories for para-athletes.';
```

**WSPS Sport Classes:**

| Code | Name | Event Type | Description |
|------|------|------------|-------------|
| `SH1` | SH1 - Pistol/Rifle | BOTH | Athletes who do not require a shooting stand |
| `SH2` | SH2 - Rifle | RIFLE | Athletes who require a shooting stand |
| `VI1` | VI1 - Visually Impaired | RIFLE | B1 - Totally blind |
| `VI2` | VI2 - Visually Impaired | RIFLE | B2 - Partially sighted (severe) |
| `VI3` | VI3 - Visually Impaired | RIFLE | B3 - Partially sighted (moderate) |

---

#### Table: `shooters`

Para-shooter profiles with detailed information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `bigint` | `generated always as identity primary key` | Internal primary key |
| `user_id` | `bigint` | `not null unique references users(id)` | Linked user account |
| `shooter_id` | `varchar(20)` | `not null unique` | Official shooter ID (PSCI-XXXX) |
| `issf_id` | `varchar(20)` | `unique` | ISSF license number |
| `date_of_birth` | `date` | `not null` | Date of birth |
| `gender` | `varchar(10)` | `not null check (gender in ('male', 'female', 'other'))` | Gender |
| `nationality` | `varchar(100)` | `not null default 'Indian'` | Nationality |
| `state_association_id` | `bigint` | `references state_associations(id)` | Affiliated state unit |
| `blood_group` | `varchar(5)` | | Blood group |
| `emergency_contact_name` | `varchar(200)` | | Emergency contact |
| `emergency_contact_phone` | `varchar(20)` | | Emergency phone |
| `coach_name` | `varchar(200)` | | Current coach |
| `club_name` | `varchar(200)` | | Club affiliation |
| `bio` | `text` | | Shooter biography |
| `achievements` | `jsonb` | `default '[]'` | List of achievements |
| `profile_complete` | `boolean` | `not null default false` | Profile completion status |
| `verified_at` | `timestamptz` | | Verification timestamp |
| `verified_by` | `bigint` | `references users(id)` | Verifying admin |
| `created_at` | `timestamptz` | `not null default now()` | Record creation time |
| `updated_at` | `timestamptz` | `not null default now()` | Last modification time |

```sql
create table public.shooters (
    id bigint generated always as identity primary key,
    user_id bigint not null unique references public.users(id),
    shooter_id varchar(20) not null unique,
    issf_id varchar(20) unique,
    date_of_birth date not null,
    gender varchar(10) not null check (gender in ('male', 'female', 'other')),
    nationality varchar(100) not null default 'Indian',
    state_association_id bigint references public.state_associations(id),
    blood_group varchar(5),
    emergency_contact_name varchar(200),
    emergency_contact_phone varchar(20),
    coach_name varchar(200),
    club_name varchar(200),
    bio text,
    achievements jsonb default '[]',
    profile_complete boolean not null default false,
    verified_at timestamptz,
    verified_by bigint references public.users(id),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

comment on table public.shooters is 'Para-shooter profiles with personal information, affiliations, and achievements.';
```

---

#### Table: `shooter_classifications`

Shooter's WSPS classification records with history.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `bigint` | `generated always as identity primary key` | Internal primary key |
| `shooter_id` | `bigint` | `not null references shooters(id)` | Shooter reference |
| `disability_category_id` | `bigint` | `not null references disability_categories(id)` | Classification category |
| `classification_status` | `varchar(20)` | `not null` | NEW, REVIEW, CONFIRMED, FIXED |
| `classification_date` | `date` | `not null` | Date of classification |
| `valid_until` | `date` | | Validity expiration |
| `classifier_name` | `varchar(200)` | | Classifying official |
| `classification_venue` | `varchar(200)` | | Where classified |
| `medical_documents_url` | `text` | | Supporting documents |
| `notes` | `text` | | Additional notes |
| `is_current` | `boolean` | `not null default true` | Current active classification |
| `created_at` | `timestamptz` | `not null default now()` | Record creation time |
| `updated_at` | `timestamptz` | `not null default now()` | Last modification time |

```sql
create table public.shooter_classifications (
    id bigint generated always as identity primary key,
    shooter_id bigint not null references public.shooters(id),
    disability_category_id bigint not null references public.disability_categories(id),
    classification_status varchar(20) not null check (
        classification_status in ('NEW', 'REVIEW', 'CONFIRMED', 'FIXED')
    ),
    classification_date date not null,
    valid_until date,
    classifier_name varchar(200),
    classification_venue varchar(200),
    medical_documents_url text,
    notes text,
    is_current boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

comment on table public.shooter_classifications is 'WSPS classification records for shooters. Maintains history with is_current flag.';
```

---

### Domain 3: Competitions & Events

#### Table: `venues`

Shooting ranges and competition venues.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `bigint` | `generated always as identity primary key` | Internal primary key |
| `name` | `varchar(200)` | `not null` | Venue name |
| `code` | `varchar(20)` | `unique` | Venue code |
| `address` | `text` | `not null` | Full address |
| `city` | `varchar(100)` | `not null` | City |
| `state` | `varchar(100)` | `not null` | State |
| `country` | `varchar(100)` | `not null default 'India'` | Country |
| `pin_code` | `varchar(10)` | | Postal code |
| `latitude` | `decimal(10,8)` | | GPS latitude |
| `longitude` | `decimal(11,8)` | | GPS longitude |
| `facilities` | `jsonb` | `default '{}'` | Available facilities |
| `capacity` | `integer` | | Maximum capacity |
| `contact_name` | `varchar(200)` | | Contact person |
| `contact_phone` | `varchar(20)` | | Contact phone |
| `contact_email` | `varchar(255)` | | Contact email |
| `is_active` | `boolean` | `not null default true` | Venue active status |
| `created_at` | `timestamptz` | `not null default now()` | Record creation time |
| `updated_at` | `timestamptz` | `not null default now()` | Last modification time |

```sql
create table public.venues (
    id bigint generated always as identity primary key,
    name varchar(200) not null,
    code varchar(20) unique,
    address text not null,
    city varchar(100) not null,
    state varchar(100) not null,
    country varchar(100) not null default 'India',
    pin_code varchar(10),
    latitude decimal(10,8),
    longitude decimal(11,8),
    facilities jsonb default '{}',
    capacity integer,
    contact_name varchar(200),
    contact_phone varchar(20),
    contact_email varchar(255),
    is_active boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

comment on table public.venues is 'Shooting ranges and competition venues with location and facility details.';
```

---

#### Table: `event_categories`

High-level event categories (Rifle, Pistol, Shotgun).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `bigint` | `generated always as identity primary key` | Internal primary key |
| `name` | `varchar(50)` | `not null unique` | Category name |
| `code` | `varchar(10)` | `not null unique` | Short code (R, P, S) |
| `description` | `text` | | Category description |
| `icon_url` | `text` | | Category icon |
| `sort_order` | `integer` | `not null default 0` | Display order |
| `is_active` | `boolean` | `not null default true` | Active status |
| `created_at` | `timestamptz` | `not null default now()` | Record creation time |

```sql
create table public.event_categories (
    id bigint generated always as identity primary key,
    name varchar(50) not null unique,
    code varchar(10) not null unique,
    description text,
    icon_url text,
    sort_order integer not null default 0,
    is_active boolean not null default true,
    created_at timestamptz not null default now()
);

comment on table public.event_categories is 'High-level shooting event categories: Rifle, Pistol, Shotgun.';
```

---

#### Table: `shooting_events`

Specific shooting event definitions.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `bigint` | `generated always as identity primary key` | Internal primary key |
| `event_category_id` | `bigint` | `not null references event_categories(id)` | Category reference |
| `name` | `varchar(100)` | `not null` | Event name |
| `code` | `varchar(20)` | `not null unique` | Event code (R1, P1, etc.) |
| `distance` | `varchar(20)` | `not null` | Distance (10m, 25m, 50m) |
| `shots_qualification` | `integer` | `not null` | Shots in qualification |
| `shots_final` | `integer` | | Shots in final |
| `max_score_qualification` | `decimal(7,1)` | `not null` | Max qualification score |
| `max_score_final` | `decimal(7,1)` | | Max final score |
| `time_limit_minutes` | `integer` | | Time limit in minutes |
| `gender` | `varchar(10)` | `check (gender in ('men', 'women', 'mixed'))` | Gender category |
| `disability_categories` | `jsonb` | `default '[]'` | Eligible WSPS classes |
| `is_paralympic` | `boolean` | `not null default false` | Paralympic event |
| `is_wsps` | `boolean` | `not null default false` | WSPS recognized |
| `rules_url` | `text` | | Link to event rules |
| `is_active` | `boolean` | `not null default true` | Active status |
| `created_at` | `timestamptz` | `not null default now()` | Record creation time |
| `updated_at` | `timestamptz` | `not null default now()` | Last modification time |

```sql
create table public.shooting_events (
    id bigint generated always as identity primary key,
    event_category_id bigint not null references public.event_categories(id),
    name varchar(100) not null,
    code varchar(20) not null unique,
    distance varchar(20) not null,
    shots_qualification integer not null,
    shots_final integer,
    max_score_qualification decimal(7,1) not null,
    max_score_final decimal(7,1),
    time_limit_minutes integer,
    gender varchar(10) check (gender in ('men', 'women', 'mixed')),
    disability_categories jsonb default '[]',
    is_paralympic boolean not null default false,
    is_wsps boolean not null default false,
    rules_url text,
    is_active boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

comment on table public.shooting_events is 'Specific shooting event definitions with scoring parameters and eligibility.';
```

**Standard Para-Shooting Events:**

| Code | Name | Distance | Shots (Q/F) | Max Score |
|------|------|----------|-------------|-----------|
| `R1` | 10m Air Rifle Standing SH1 | 10m | 60/24 | 654.5 |
| `R2` | 10m Air Rifle Prone SH1 | 10m | 60/24 | 654.5 |
| `R3` | 10m Air Rifle Prone SH2 | 10m | 60/24 | 654.5 |
| `R4` | 10m Air Rifle Standing SH2 | 10m | 60/24 | 654.5 |
| `R5` | 10m Air Rifle Prone Mixed SH2 | 10m | 60/24 | 654.5 |
| `R6` | 50m Rifle Prone SH1 | 50m | 60/- | 654.5 |
| `R7` | 50m Rifle 3 Position SH1 | 50m | 120/- | 1185.5 |
| `P1` | 10m Air Pistol SH1 | 10m | 60/24 | 246.1 |
| `P2` | 25m Pistol SH1 | 25m | 30/30 | 594.0 |
| `P3` | 25m Pistol Mixed SH1 | 25m | 30/30 | 594.0 |
| `P4` | 50m Pistol SH1 | 50m | 60/- | 580.0 |
| `V1` | 10m Air Rifle Standing VI | 10m | 60/24 | 654.5 |

---

#### Table: `competitions`

Championships and tournament events.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `bigint` | `generated always as identity primary key` | Internal primary key |
| `public_id` | `uuid` | `not null default gen_random_uuid() unique` | External identifier |
| `name` | `varchar(200)` | `not null` | Competition name |
| `code` | `varchar(30)` | `unique` | Competition code |
| `competition_type` | `varchar(30)` | `not null` | Type of competition |
| `level` | `varchar(20)` | `not null` | INTERNATIONAL, NATIONAL, STATE, CLUB |
| `venue_id` | `bigint` | `references venues(id)` | Venue reference |
| `start_date` | `date` | `not null` | Start date |
| `end_date` | `date` | `not null` | End date |
| `registration_opens` | `timestamptz` | | Registration open date |
| `registration_closes` | `timestamptz` | | Registration deadline |
| `entry_fee` | `decimal(10,2)` | `default 0` | Entry fee in INR |
| `max_participants` | `integer` | | Participant limit |
| `description` | `text` | | Competition description |
| `rules_document_url` | `text` | | Rules document link |
| `schedule_document_url` | `text` | | Schedule document link |
| `status` | `varchar(20)` | `not null default 'draft'` | Competition status |
| `is_wsps_ranked` | `boolean` | `not null default false` | WSPS ranking event |
| `is_record_eligible` | `boolean` | `not null default true` | Records can be set |
| `organizer_name` | `varchar(200)` | | Organizing body |
| `organizer_contact` | `jsonb` | | Organizer contact info |
| `results_published_at` | `timestamptz` | | Results publication time |
| `created_by` | `bigint` | `references users(id)` | Creator user |
| `created_at` | `timestamptz` | `not null default now()` | Record creation time |
| `updated_at` | `timestamptz` | `not null default now()` | Last modification time |

```sql
create table public.competitions (
    id bigint generated always as identity primary key,
    public_id uuid not null default gen_random_uuid() unique,
    name varchar(200) not null,
    code varchar(30) unique,
    competition_type varchar(30) not null check (
        competition_type in ('CHAMPIONSHIP', 'WORLD_CUP', 'GRAND_PRIX', 'OPEN', 'SELECTION_TRIAL', 'LEAGUE')
    ),
    level varchar(20) not null check (
        level in ('INTERNATIONAL', 'NATIONAL', 'STATE', 'ZONAL', 'CLUB')
    ),
    venue_id bigint references public.venues(id),
    start_date date not null,
    end_date date not null,
    registration_opens timestamptz,
    registration_closes timestamptz,
    entry_fee decimal(10,2) default 0,
    max_participants integer,
    description text,
    rules_document_url text,
    schedule_document_url text,
    status varchar(20) not null default 'draft' check (
        status in ('draft', 'upcoming', 'registration_open', 'registration_closed', 'ongoing', 'completed', 'cancelled')
    ),
    is_wsps_ranked boolean not null default false,
    is_record_eligible boolean not null default true,
    organizer_name varchar(200),
    organizer_contact jsonb,
    results_published_at timestamptz,
    created_by bigint references public.users(id),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    check (end_date >= start_date)
);

comment on table public.competitions is 'Championships, tournaments, and competition events with scheduling and registration details.';
```

---

#### Table: `competition_events`

Events scheduled within a competition.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `bigint` | `generated always as identity primary key` | Internal primary key |
| `competition_id` | `bigint` | `not null references competitions(id)` | Competition reference |
| `shooting_event_id` | `bigint` | `not null references shooting_events(id)` | Event type reference |
| `scheduled_date` | `date` | `not null` | Event date |
| `scheduled_time` | `time` | | Start time |
| `qualification_end_time` | `time` | | Qualification end |
| `final_time` | `time` | | Final start time |
| `max_entries` | `integer` | | Entry limit |
| `entry_fee_override` | `decimal(10,2)` | | Override competition fee |
| `status` | `varchar(20)` | `not null default 'scheduled'` | Event status |
| `results_finalized_at` | `timestamptz` | | Results finalization |
| `created_at` | `timestamptz` | `not null default now()` | Record creation time |
| `updated_at` | `timestamptz` | `not null default now()` | Last modification time |

```sql
create table public.competition_events (
    id bigint generated always as identity primary key,
    competition_id bigint not null references public.competitions(id) on delete cascade,
    shooting_event_id bigint not null references public.shooting_events(id),
    scheduled_date date not null,
    scheduled_time time,
    qualification_end_time time,
    final_time time,
    max_entries integer,
    entry_fee_override decimal(10,2),
    status varchar(20) not null default 'scheduled' check (
        status in ('scheduled', 'ongoing', 'qualification_complete', 'final_ongoing', 'completed', 'cancelled')
    ),
    results_finalized_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    unique(competition_id, shooting_event_id)
);

comment on table public.competition_events is 'Individual shooting events within a competition with scheduling details.';
```

---

#### Table: `competition_entries`

Shooter registrations for competition events.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `bigint` | `generated always as identity primary key` | Internal primary key |
| `public_id` | `uuid` | `not null default gen_random_uuid() unique` | External identifier |
| `competition_event_id` | `bigint` | `not null references competition_events(id)` | Event reference |
| `shooter_id` | `bigint` | `not null references shooters(id)` | Shooter reference |
| `bib_number` | `varchar(10)` | | Assigned bib number |
| `relay_number` | `integer` | | Relay assignment |
| `firing_point` | `varchar(10)` | | Firing point assignment |
| `entry_status` | `varchar(20)` | `not null default 'pending'` | Entry status |
| `payment_status` | `varchar(20)` | `not null default 'pending'` | Payment status |
| `payment_id` | `bigint` | `references payments(id)` | Payment reference |
| `entry_fee_paid` | `decimal(10,2)` | | Fee amount paid |
| `registered_at` | `timestamptz` | `not null default now()` | Registration time |
| `confirmed_at` | `timestamptz` | | Confirmation time |
| `withdrawn_at` | `timestamptz` | | Withdrawal time |
| `withdrawal_reason` | `text` | | Reason for withdrawal |
| `notes` | `text` | | Admin notes |
| `created_at` | `timestamptz` | `not null default now()` | Record creation time |
| `updated_at` | `timestamptz` | `not null default now()` | Last modification time |

```sql
create table public.competition_entries (
    id bigint generated always as identity primary key,
    public_id uuid not null default gen_random_uuid() unique,
    competition_event_id bigint not null references public.competition_events(id),
    shooter_id bigint not null references public.shooters(id),
    bib_number varchar(10),
    relay_number integer,
    firing_point varchar(10),
    entry_status varchar(20) not null default 'pending' check (
        entry_status in ('pending', 'confirmed', 'waitlisted', 'withdrawn', 'disqualified', 'dns', 'dnf')
    ),
    payment_status varchar(20) not null default 'pending' check (
        payment_status in ('pending', 'paid', 'waived', 'refunded')
    ),
    payment_id bigint,
    entry_fee_paid decimal(10,2),
    registered_at timestamptz not null default now(),
    confirmed_at timestamptz,
    withdrawn_at timestamptz,
    withdrawal_reason text,
    notes text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    unique(competition_event_id, shooter_id)
);

comment on table public.competition_entries is 'Shooter registrations for competition events with payment and status tracking.';
```

---

### Domain 4: Scores & Rankings

#### Table: `scores`

Individual shooter scores in competition events.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `bigint` | `generated always as identity primary key` | Internal primary key |
| `competition_entry_id` | `bigint` | `not null references competition_entries(id)` | Entry reference |
| `stage` | `varchar(20)` | `not null` | QUALIFICATION, FINAL, SHOOTOFF |
| `series_scores` | `jsonb` | `not null default '[]'` | Individual series scores |
| `inner_tens` | `integer` | `default 0` | Inner 10s count |
| `total_score` | `decimal(7,1)` | `not null` | Total score |
| `rank_in_stage` | `integer` | | Rank in this stage |
| `qualified_for_final` | `boolean` | `default false` | Qualified for final |
| `is_record` | `boolean` | `default false` | Record-breaking score |
| `record_type` | `varchar(30)` | | WR, AR, NR, CR type |
| `equipment_check_passed` | `boolean` | `default true` | Equipment check status |
| `protest_filed` | `boolean` | `default false` | Protest status |
| `protest_resolved_at` | `timestamptz` | | Protest resolution time |
| `verified_by` | `bigint` | `references users(id)` | Verifying official |
| `verified_at` | `timestamptz` | | Verification time |
| `created_at` | `timestamptz` | `not null default now()` | Record creation time |
| `updated_at` | `timestamptz` | `not null default now()` | Last modification time |

```sql
create table public.scores (
    id bigint generated always as identity primary key,
    competition_entry_id bigint not null references public.competition_entries(id),
    stage varchar(20) not null check (stage in ('QUALIFICATION', 'FINAL', 'SHOOTOFF')),
    series_scores jsonb not null default '[]',
    inner_tens integer default 0,
    total_score decimal(7,1) not null check (total_score >= 0),
    rank_in_stage integer,
    qualified_for_final boolean default false,
    is_record boolean default false,
    record_type varchar(30) check (
        record_type in ('WORLD_RECORD', 'ASIAN_RECORD', 'NATIONAL_RECORD', 'COMPETITION_RECORD', 'PERSONAL_BEST')
    ),
    equipment_check_passed boolean default true,
    protest_filed boolean default false,
    protest_resolved_at timestamptz,
    verified_by bigint references public.users(id),
    verified_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    unique(competition_entry_id, stage)
);

comment on table public.scores is 'Individual shooter scores with detailed series breakdown, records, and verification status.';
```

**Series Scores JSON Structure:**
```json
{
  "series": [
    { "number": 1, "shots": [10.5, 10.3, 10.1, 10.4, 10.2, 10.6, 10.0, 10.3, 10.4, 10.2], "total": 103.0 },
    { "number": 2, "shots": [10.1, 10.4, 10.3, 10.5, 10.2, 10.4, 10.1, 10.3, 10.2, 10.5], "total": 103.0 }
  ],
  "sighters": [9.8, 10.2, 10.0]
}
```

---

#### Table: `rankings`

National and international rankings by event.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `bigint` | `generated always as identity primary key` | Internal primary key |
| `shooter_id` | `bigint` | `not null references shooters(id)` | Shooter reference |
| `shooting_event_id` | `bigint` | `not null references shooting_events(id)` | Event reference |
| `ranking_type` | `varchar(20)` | `not null` | NATIONAL, WORLD, ASIAN |
| `rank` | `integer` | `not null` | Current rank |
| `previous_rank` | `integer` | | Previous rank |
| `ranking_points` | `decimal(10,2)` | `not null default 0` | Ranking points |
| `best_score` | `decimal(7,1)` | | Personal best score |
| `competitions_counted` | `integer` | `default 0` | Competitions in ranking |
| `last_competition_date` | `date` | | Last competition date |
| `valid_from` | `date` | `not null` | Ranking validity start |
| `valid_until` | `date` | | Ranking validity end |
| `is_current` | `boolean` | `not null default true` | Current ranking |
| `created_at` | `timestamptz` | `not null default now()` | Record creation time |
| `updated_at` | `timestamptz` | `not null default now()` | Last modification time |

```sql
create table public.rankings (
    id bigint generated always as identity primary key,
    shooter_id bigint not null references public.shooters(id),
    shooting_event_id bigint not null references public.shooting_events(id),
    ranking_type varchar(20) not null check (ranking_type in ('NATIONAL', 'WORLD', 'ASIAN')),
    rank integer not null check (rank > 0),
    previous_rank integer,
    ranking_points decimal(10,2) not null default 0,
    best_score decimal(7,1),
    competitions_counted integer default 0,
    last_competition_date date,
    valid_from date not null,
    valid_until date,
    is_current boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    unique(shooter_id, shooting_event_id, ranking_type, valid_from)
);

comment on table public.rankings is 'National and international rankings by event with historical tracking.';
```

---

### Domain 5: Memberships & Payments

#### Table: `membership_types`

Types of memberships offered.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `bigint` | `generated always as identity primary key` | Internal primary key |
| `name` | `varchar(50)` | `not null unique` | Membership type name |
| `code` | `varchar(20)` | `not null unique` | Type code |
| `description` | `text` | | Type description |
| `duration_months` | `integer` | | Duration (null = lifetime) |
| `price` | `decimal(10,2)` | `not null` | Price in INR |
| `benefits` | `jsonb` | `default '[]'` | List of benefits |
| `is_active` | `boolean` | `not null default true` | Active status |
| `created_at` | `timestamptz` | `not null default now()` | Record creation time |

```sql
create table public.membership_types (
    id bigint generated always as identity primary key,
    name varchar(50) not null unique,
    code varchar(20) not null unique,
    description text,
    duration_months integer,
    price decimal(10,2) not null check (price >= 0),
    benefits jsonb default '[]',
    is_active boolean not null default true,
    created_at timestamptz not null default now()
);

comment on table public.membership_types is 'Membership type definitions with pricing and benefits.';
```

**Membership Types:**

| Code | Name | Duration | Price (INR) |
|------|------|----------|-------------|
| `LIFE` | Life Membership | Lifetime | 25,000 |
| `ANNUAL` | Annual Membership | 12 months | 2,500 |
| `INSTITUTIONAL` | Institutional | 12 months | 10,000 |
| `HONORARY` | Honorary | Lifetime | 0 |

---

#### Table: `memberships`

User membership records.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `bigint` | `generated always as identity primary key` | Internal primary key |
| `public_id` | `uuid` | `not null default gen_random_uuid() unique` | External identifier |
| `user_id` | `bigint` | `not null references users(id)` | User reference |
| `membership_type_id` | `bigint` | `not null references membership_types(id)` | Type reference |
| `membership_number` | `varchar(30)` | `unique` | Membership number |
| `start_date` | `date` | `not null` | Start date |
| `end_date` | `date` | | End date (null = lifetime) |
| `status` | `varchar(20)` | `not null default 'pending'` | Membership status |
| `amount_paid` | `decimal(10,2)` | `not null` | Amount paid |
| `payment_id` | `bigint` | | Payment reference |
| `approved_by` | `bigint` | `references users(id)` | Approving admin |
| `approved_at` | `timestamptz` | | Approval timestamp |
| `notes` | `text` | | Admin notes |
| `created_at` | `timestamptz` | `not null default now()` | Record creation time |
| `updated_at` | `timestamptz` | `not null default now()` | Last modification time |

```sql
create table public.memberships (
    id bigint generated always as identity primary key,
    public_id uuid not null default gen_random_uuid() unique,
    user_id bigint not null references public.users(id),
    membership_type_id bigint not null references public.membership_types(id),
    membership_number varchar(30) unique,
    start_date date not null,
    end_date date,
    status varchar(20) not null default 'pending' check (
        status in ('pending', 'active', 'expired', 'cancelled', 'suspended')
    ),
    amount_paid decimal(10,2) not null,
    payment_id bigint,
    approved_by bigint references public.users(id),
    approved_at timestamptz,
    notes text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

comment on table public.memberships is 'User membership records with status and payment tracking.';
```

---

#### Table: `payments`

Payment transactions (Razorpay integration).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `bigint` | `generated always as identity primary key` | Internal primary key |
| `public_id` | `uuid` | `not null default gen_random_uuid() unique` | External identifier |
| `user_id` | `bigint` | `not null references users(id)` | Payer reference |
| `payment_type` | `varchar(30)` | `not null` | MEMBERSHIP, ENTRY_FEE, etc. |
| `amount` | `decimal(10,2)` | `not null` | Amount in INR |
| `currency` | `varchar(3)` | `not null default 'INR'` | Currency code |
| `status` | `varchar(20)` | `not null default 'pending'` | Payment status |
| `razorpay_order_id` | `varchar(50)` | `unique` | Razorpay order ID |
| `razorpay_payment_id` | `varchar(50)` | `unique` | Razorpay payment ID |
| `razorpay_signature` | `text` | | Payment signature |
| `payment_method` | `varchar(30)` | | UPI, CARD, NETBANKING, etc. |
| `description` | `text` | | Payment description |
| `metadata` | `jsonb` | `default '{}'` | Additional metadata |
| `paid_at` | `timestamptz` | | Payment completion time |
| `failed_at` | `timestamptz` | | Failure timestamp |
| `failure_reason` | `text` | | Failure reason |
| `receipt_url` | `text` | | Receipt download URL |
| `invoice_number` | `varchar(30)` | `unique` | Invoice number |
| `created_at` | `timestamptz` | `not null default now()` | Record creation time |
| `updated_at` | `timestamptz` | `not null default now()` | Last modification time |

```sql
create table public.payments (
    id bigint generated always as identity primary key,
    public_id uuid not null default gen_random_uuid() unique,
    user_id bigint not null references public.users(id),
    payment_type varchar(30) not null check (
        payment_type in ('MEMBERSHIP', 'ENTRY_FEE', 'FINE', 'DONATION', 'OTHER')
    ),
    amount decimal(10,2) not null check (amount > 0),
    currency varchar(3) not null default 'INR',
    status varchar(20) not null default 'pending' check (
        status in ('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded', 'partially_refunded')
    ),
    razorpay_order_id varchar(50) unique,
    razorpay_payment_id varchar(50) unique,
    razorpay_signature text,
    payment_method varchar(30),
    description text,
    metadata jsonb default '{}',
    paid_at timestamptz,
    failed_at timestamptz,
    failure_reason text,
    receipt_url text,
    invoice_number varchar(30) unique,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

comment on table public.payments is 'Payment transactions with Razorpay integration for memberships and entry fees.';
```

---

#### Table: `refunds`

Refund records for payments.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `bigint` | `generated always as identity primary key` | Internal primary key |
| `payment_id` | `bigint` | `not null references payments(id)` | Original payment |
| `amount` | `decimal(10,2)` | `not null` | Refund amount |
| `status` | `varchar(20)` | `not null default 'pending'` | Refund status |
| `razorpay_refund_id` | `varchar(50)` | `unique` | Razorpay refund ID |
| `reason` | `text` | `not null` | Refund reason |
| `initiated_by` | `bigint` | `not null references users(id)` | Admin who initiated |
| `processed_at` | `timestamptz` | | Processing timestamp |
| `notes` | `text` | | Admin notes |
| `created_at` | `timestamptz` | `not null default now()` | Record creation time |
| `updated_at` | `timestamptz` | `not null default now()` | Last modification time |

```sql
create table public.refunds (
    id bigint generated always as identity primary key,
    payment_id bigint not null references public.payments(id),
    amount decimal(10,2) not null check (amount > 0),
    status varchar(20) not null default 'pending' check (
        status in ('pending', 'processing', 'completed', 'failed')
    ),
    razorpay_refund_id varchar(50) unique,
    reason text not null,
    initiated_by bigint not null references public.users(id),
    processed_at timestamptz,
    notes text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

comment on table public.refunds is 'Refund records for payment reversals with Razorpay integration.';
```

---

### Domain 6: Content Management

#### Table: `news_articles`

News and announcements.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `bigint` | `generated always as identity primary key` | Internal primary key |
| `public_id` | `uuid` | `not null default gen_random_uuid() unique` | External identifier |
| `title` | `varchar(255)` | `not null` | Article title |
| `slug` | `varchar(255)` | `not null unique` | URL slug |
| `excerpt` | `text` | | Short excerpt |
| `content` | `text` | `not null` | Full content (HTML/Markdown) |
| `featured_image_url` | `text` | | Featured image |
| `category` | `varchar(50)` | `not null` | Article category |
| `tags` | `jsonb` | `default '[]'` | Article tags |
| `author_id` | `bigint` | `not null references users(id)` | Author user |
| `status` | `varchar(20)` | `not null default 'draft'` | Article status |
| `is_featured` | `boolean` | `default false` | Featured article |
| `is_pinned` | `boolean` | `default false` | Pinned to top |
| `view_count` | `integer` | `default 0` | View counter |
| `published_at` | `timestamptz` | | Publication time |
| `created_at` | `timestamptz` | `not null default now()` | Record creation time |
| `updated_at` | `timestamptz` | `not null default now()` | Last modification time |
| `deleted_at` | `timestamptz` | | Soft delete timestamp |

```sql
create table public.news_articles (
    id bigint generated always as identity primary key,
    public_id uuid not null default gen_random_uuid() unique,
    title varchar(255) not null,
    slug varchar(255) not null unique,
    excerpt text,
    content text not null,
    featured_image_url text,
    category varchar(50) not null check (
        category in ('NEWS', 'ANNOUNCEMENT', 'RESULT', 'ACHIEVEMENT', 'EVENT', 'PRESS_RELEASE')
    ),
    tags jsonb default '[]',
    author_id bigint not null references public.users(id),
    status varchar(20) not null default 'draft' check (
        status in ('draft', 'pending_review', 'published', 'archived')
    ),
    is_featured boolean default false,
    is_pinned boolean default false,
    view_count integer default 0,
    published_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    deleted_at timestamptz
);

comment on table public.news_articles is 'News articles, announcements, and press releases for the public website.';
```

---

#### Table: `notifications`

System notifications for users.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `bigint` | `generated always as identity primary key` | Internal primary key |
| `user_id` | `bigint` | `not null references users(id)` | Recipient user |
| `type` | `varchar(50)` | `not null` | Notification type |
| `title` | `varchar(255)` | `not null` | Notification title |
| `message` | `text` | `not null` | Notification message |
| `action_url` | `text` | | Action link |
| `metadata` | `jsonb` | `default '{}'` | Additional data |
| `is_read` | `boolean` | `default false` | Read status |
| `read_at` | `timestamptz` | | Read timestamp |
| `created_at` | `timestamptz` | `not null default now()` | Record creation time |

```sql
create table public.notifications (
    id bigint generated always as identity primary key,
    user_id bigint not null references public.users(id) on delete cascade,
    type varchar(50) not null check (
        type in ('SYSTEM', 'COMPETITION', 'PAYMENT', 'RESULT', 'MEMBERSHIP', 'REMINDER', 'ALERT')
    ),
    title varchar(255) not null,
    message text not null,
    action_url text,
    metadata jsonb default '{}',
    is_read boolean default false,
    read_at timestamptz,
    created_at timestamptz not null default now()
);

comment on table public.notifications is 'System notifications for users including competition updates, payments, and alerts.';
```

---

#### Table: `document_categories`

Categories for downloadable documents.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `bigint` | `generated always as identity primary key` | Internal primary key |
| `name` | `varchar(100)` | `not null unique` | Category name |
| `slug` | `varchar(100)` | `not null unique` | URL slug |
| `description` | `text` | | Category description |
| `icon` | `varchar(50)` | | Icon identifier |
| `sort_order` | `integer` | `default 0` | Display order |
| `is_active` | `boolean` | `default true` | Active status |
| `created_at` | `timestamptz` | `not null default now()` | Record creation time |

```sql
create table public.document_categories (
    id bigint generated always as identity primary key,
    name varchar(100) not null unique,
    slug varchar(100) not null unique,
    description text,
    icon varchar(50),
    sort_order integer default 0,
    is_active boolean default true,
    created_at timestamptz not null default now()
);

comment on table public.document_categories is 'Categories for organizing downloadable documents (Forms, Rules, Guidelines).';
```

---

#### Table: `documents`

Downloadable documents and files.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `bigint` | `generated always as identity primary key` | Internal primary key |
| `category_id` | `bigint` | `not null references document_categories(id)` | Category reference |
| `title` | `varchar(255)` | `not null` | Document title |
| `description` | `text` | | Document description |
| `file_url` | `text` | `not null` | Download URL |
| `file_name` | `varchar(255)` | `not null` | Original filename |
| `file_size` | `bigint` | | File size in bytes |
| `file_type` | `varchar(50)` | | MIME type |
| `version` | `varchar(20)` | | Document version |
| `is_public` | `boolean` | `default true` | Public visibility |
| `download_count` | `integer` | `default 0` | Download counter |
| `uploaded_by` | `bigint` | `references users(id)` | Uploader user |
| `valid_from` | `date` | | Validity start |
| `valid_until` | `date` | | Validity end |
| `is_active` | `boolean` | `default true` | Active status |
| `created_at` | `timestamptz` | `not null default now()` | Record creation time |
| `updated_at` | `timestamptz` | `not null default now()` | Last modification time |

```sql
create table public.documents (
    id bigint generated always as identity primary key,
    category_id bigint not null references public.document_categories(id),
    title varchar(255) not null,
    description text,
    file_url text not null,
    file_name varchar(255) not null,
    file_size bigint,
    file_type varchar(50),
    version varchar(20),
    is_public boolean default true,
    download_count integer default 0,
    uploaded_by bigint references public.users(id),
    valid_from date,
    valid_until date,
    is_active boolean default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

comment on table public.documents is 'Downloadable documents including forms, rules, and guidelines.';
```

---

#### Table: `contact_messages`

Contact form submissions.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `bigint` | `generated always as identity primary key` | Internal primary key |
| `name` | `varchar(200)` | `not null` | Sender name |
| `email` | `varchar(255)` | `not null` | Sender email |
| `phone` | `varchar(20)` | | Sender phone |
| `subject` | `varchar(255)` | `not null` | Message subject |
| `message` | `text` | `not null` | Message content |
| `category` | `varchar(50)` | | Message category |
| `status` | `varchar(20)` | `default 'new'` | Processing status |
| `assigned_to` | `bigint` | `references users(id)` | Assigned staff |
| `response` | `text` | | Staff response |
| `responded_at` | `timestamptz` | | Response timestamp |
| `responded_by` | `bigint` | `references users(id)` | Responding staff |
| `ip_address` | `inet` | | Sender IP |
| `created_at` | `timestamptz` | `not null default now()` | Submission time |
| `updated_at` | `timestamptz` | `not null default now()` | Last modification time |

```sql
create table public.contact_messages (
    id bigint generated always as identity primary key,
    name varchar(200) not null,
    email varchar(255) not null,
    phone varchar(20),
    subject varchar(255) not null,
    message text not null,
    category varchar(50),
    status varchar(20) default 'new' check (
        status in ('new', 'in_progress', 'responded', 'closed', 'spam')
    ),
    assigned_to bigint references public.users(id),
    response text,
    responded_at timestamptz,
    responded_by bigint references public.users(id),
    ip_address inet,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

comment on table public.contact_messages is 'Contact form submissions from the public website.';
```

---

#### Table: `committee_members`

Executive committee member profiles.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `bigint` | `generated always as identity primary key` | Internal primary key |
| `name` | `varchar(200)` | `not null` | Full name |
| `designation` | `varchar(100)` | `not null` | Position/Title |
| `photo_url` | `text` | | Photo URL |
| `bio` | `text` | | Biography |
| `email` | `varchar(255)` | | Contact email |
| `phone` | `varchar(20)` | | Contact phone |
| `term_start` | `date` | | Term start date |
| `term_end` | `date` | | Term end date |
| `committee_type` | `varchar(50)` | `not null` | Committee type |
| `sort_order` | `integer` | `default 0` | Display order |
| `is_active` | `boolean` | `default true` | Active status |
| `created_at` | `timestamptz` | `not null default now()` | Record creation time |
| `updated_at` | `timestamptz` | `not null default now()` | Last modification time |

```sql
create table public.committee_members (
    id bigint generated always as identity primary key,
    name varchar(200) not null,
    designation varchar(100) not null,
    photo_url text,
    bio text,
    email varchar(255),
    phone varchar(20),
    term_start date,
    term_end date,
    committee_type varchar(50) not null check (
        committee_type in ('EXECUTIVE', 'TECHNICAL', 'SELECTION', 'DISCIPLINARY', 'FINANCE')
    ),
    sort_order integer default 0,
    is_active boolean default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

comment on table public.committee_members is 'Executive and technical committee member profiles for the About Us page.';
```

---

### Domain 7: System Tables

#### Table: `audit_logs`

Audit trail for all data changes.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `bigint` | `generated always as identity primary key` | Internal primary key |
| `user_id` | `bigint` | `references users(id)` | Acting user |
| `action` | `varchar(50)` | `not null` | Action type |
| `table_name` | `varchar(100)` | `not null` | Affected table |
| `record_id` | `bigint` | | Affected record ID |
| `old_values` | `jsonb` | | Previous values |
| `new_values` | `jsonb` | | New values |
| `ip_address` | `inet` | | Client IP |
| `user_agent` | `text` | | Browser user agent |
| `request_id` | `uuid` | | Request correlation ID |
| `created_at` | `timestamptz` | `not null default now()` | Event timestamp |

```sql
create table public.audit_logs (
    id bigint generated always as identity primary key,
    user_id bigint references public.users(id),
    action varchar(50) not null check (
        action in ('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'PASSWORD_CHANGE', 'ROLE_CHANGE', 'EXPORT', 'BULK_UPDATE')
    ),
    table_name varchar(100) not null,
    record_id bigint,
    old_values jsonb,
    new_values jsonb,
    ip_address inet,
    user_agent text,
    request_id uuid,
    created_at timestamptz not null default now()
);

comment on table public.audit_logs is 'Comprehensive audit trail for compliance and security monitoring.';
```

---

#### Table: `scheduled_jobs`

Background job scheduling and tracking.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `bigint` | `generated always as identity primary key` | Internal primary key |
| `job_name` | `varchar(100)` | `not null` | Job identifier |
| `job_type` | `varchar(50)` | `not null` | Job type |
| `schedule` | `varchar(50)` | | Cron expression |
| `last_run_at` | `timestamptz` | | Last execution time |
| `last_run_status` | `varchar(20)` | | Last run result |
| `last_run_duration_ms` | `integer` | | Last run duration |
| `last_error` | `text` | | Last error message |
| `next_run_at` | `timestamptz` | | Next scheduled run |
| `is_enabled` | `boolean` | `default true` | Job enabled |
| `metadata` | `jsonb` | `default '{}'` | Job configuration |
| `created_at` | `timestamptz` | `not null default now()` | Record creation time |
| `updated_at` | `timestamptz` | `not null default now()` | Last modification time |

```sql
create table public.scheduled_jobs (
    id bigint generated always as identity primary key,
    job_name varchar(100) not null unique,
    job_type varchar(50) not null check (
        job_type in ('CLEANUP', 'RANKING_UPDATE', 'EMAIL_DIGEST', 'BACKUP', 'REPORT', 'SYNC')
    ),
    schedule varchar(50),
    last_run_at timestamptz,
    last_run_status varchar(20) check (
        last_run_status in ('success', 'failed', 'running', 'skipped')
    ),
    last_run_duration_ms integer,
    last_error text,
    next_run_at timestamptz,
    is_enabled boolean default true,
    metadata jsonb default '{}',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

comment on table public.scheduled_jobs is 'Background job scheduling and execution tracking.';
```

---

## Indexes

### Performance Indexes

```sql
-- Users
create index idx_users_email on public.users(email);
create index idx_users_public_id on public.users(public_id);
create index idx_users_deleted_at on public.users(deleted_at) where deleted_at is null;

-- Shooters
create index idx_shooters_user_id on public.shooters(user_id);
create index idx_shooters_shooter_id on public.shooters(shooter_id);
create index idx_shooters_state_association on public.shooters(state_association_id);

-- Shooter Classifications
create index idx_shooter_classifications_shooter on public.shooter_classifications(shooter_id);
create index idx_shooter_classifications_current on public.shooter_classifications(shooter_id, is_current) where is_current = true;

-- Competitions
create index idx_competitions_dates on public.competitions(start_date, end_date);
create index idx_competitions_status on public.competitions(status);
create index idx_competitions_level on public.competitions(level);

-- Competition Entries
create index idx_competition_entries_shooter on public.competition_entries(shooter_id);
create index idx_competition_entries_event on public.competition_entries(competition_event_id);
create index idx_competition_entries_status on public.competition_entries(entry_status);

-- Scores
create index idx_scores_entry on public.scores(competition_entry_id);
create index idx_scores_stage on public.scores(stage);

-- Rankings
create index idx_rankings_shooter_event on public.rankings(shooter_id, shooting_event_id);
create index idx_rankings_current on public.rankings(is_current) where is_current = true;

-- Payments
create index idx_payments_user on public.payments(user_id);
create index idx_payments_status on public.payments(status);
create index idx_payments_razorpay_order on public.payments(razorpay_order_id);

-- Memberships
create index idx_memberships_user on public.memberships(user_id);
create index idx_memberships_status on public.memberships(status);

-- News Articles
create index idx_news_articles_status on public.news_articles(status);
create index idx_news_articles_published on public.news_articles(published_at) where status = 'published';
create index idx_news_articles_slug on public.news_articles(slug);

-- Notifications
create index idx_notifications_user_unread on public.notifications(user_id, is_read) where is_read = false;

-- Audit Logs
create index idx_audit_logs_user on public.audit_logs(user_id);
create index idx_audit_logs_table_record on public.audit_logs(table_name, record_id);
create index idx_audit_logs_created on public.audit_logs(created_at);
```

---

## Triggers & Functions

### Updated At Trigger

```sql
-- Function to update updated_at timestamp
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Apply to all tables with updated_at
create trigger update_users_updated_at before update on public.users
    for each row execute function public.update_updated_at_column();

create trigger update_shooters_updated_at before update on public.shooters
    for each row execute function public.update_updated_at_column();

create trigger update_competitions_updated_at before update on public.competitions
    for each row execute function public.update_updated_at_column();

-- ... (apply to all tables with updated_at column)
```

### Audit Log Trigger

```sql
-- Function to create audit log entries
create or replace function public.audit_log_changes()
returns trigger as $$
begin
    if (tg_op = 'DELETE') then
        insert into public.audit_logs (action, table_name, record_id, old_values)
        values ('DELETE', tg_table_name, old.id, to_jsonb(old));
        return old;
    elsif (tg_op = 'UPDATE') then
        insert into public.audit_logs (action, table_name, record_id, old_values, new_values)
        values ('UPDATE', tg_table_name, new.id, to_jsonb(old), to_jsonb(new));
        return new;
    elsif (tg_op = 'INSERT') then
        insert into public.audit_logs (action, table_name, record_id, new_values)
        values ('CREATE', tg_table_name, new.id, to_jsonb(new));
        return new;
    end if;
    return null;
end;
$$ language plpgsql;
```

---

## Views

### Active Shooters View

```sql
create or replace view public.v_active_shooters as
select 
    s.id,
    s.shooter_id,
    u.first_name,
    u.last_name,
    u.email,
    s.date_of_birth,
    s.gender,
    sa.name as state_association,
    dc.code as classification_code,
    dc.name as classification_name,
    sc.classification_status
from public.shooters s
join public.users u on s.user_id = u.id
left join public.state_associations sa on s.state_association_id = sa.id
left join public.shooter_classifications sc on s.id = sc.shooter_id and sc.is_current = true
left join public.disability_categories dc on sc.disability_category_id = dc.id
where u.is_active = true and u.deleted_at is null;

comment on view public.v_active_shooters is 'Active shooters with their current classification and state association.';
```

### Upcoming Competitions View

```sql
create or replace view public.v_upcoming_competitions as
select 
    c.id,
    c.public_id,
    c.name,
    c.competition_type,
    c.level,
    v.name as venue_name,
    v.city,
    v.state,
    c.start_date,
    c.end_date,
    c.registration_closes,
    c.entry_fee,
    c.status,
    count(ce.id) as total_events
from public.competitions c
left join public.venues v on c.venue_id = v.id
left join public.competition_events ce on c.id = ce.competition_id
where c.start_date >= current_date
  and c.status not in ('cancelled', 'completed')
group by c.id, v.name, v.city, v.state
order by c.start_date;

comment on view public.v_upcoming_competitions is 'Upcoming competitions with venue and event count.';
```

### Shooter Rankings View

```sql
create or replace view public.v_current_rankings as
select 
    r.id,
    s.shooter_id,
    u.first_name || ' ' || u.last_name as shooter_name,
    se.name as event_name,
    se.code as event_code,
    r.ranking_type,
    r.rank,
    r.previous_rank,
    r.ranking_points,
    r.best_score,
    r.valid_from,
    case 
        when r.previous_rank is null then 'NEW'
        when r.rank < r.previous_rank then 'UP'
        when r.rank > r.previous_rank then 'DOWN'
        else 'SAME'
    end as rank_change
from public.rankings r
join public.shooters s on r.shooter_id = s.id
join public.users u on s.user_id = u.id
join public.shooting_events se on r.shooting_event_id = se.id
where r.is_current = true
order by r.ranking_type, se.code, r.rank;

comment on view public.v_current_rankings is 'Current rankings with rank change indicators.';
```

---

## Summary

| Domain | Tables | Description |
|--------|--------|-------------|
| Authentication | 4 | Users, roles, sessions |
| Shooters | 4 | Profiles, classifications, associations |
| Competitions | 5 | Venues, events, entries |
| Scores | 2 | Scores, rankings |
| Payments | 4 | Memberships, payments, refunds |
| Content | 6 | News, documents, contacts |
| System | 2 | Audit logs, scheduled jobs |
| **Total** | **27** | Complete platform schema |

