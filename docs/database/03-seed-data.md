# Database Seed Data

> Para Shooting Committee of India - Initial Data Population
> Version: 1.0 | Last Updated: December 2025

---

## Table of Contents

1. [Overview](#overview)
2. [Seed Data Categories](#seed-data-categories)
3. [Roles & Permissions](#roles--permissions)
4. [Disability Categories (WSPS)](#disability-categories-wsps)
5. [Event Categories](#event-categories)
6. [Shooting Events](#shooting-events)
7. [State Associations](#state-associations)
8. [Membership Types](#membership-types)
9. [Document Categories](#document-categories)
10. [System Configuration](#system-configuration)

---

## Overview

This document defines the initial seed data required to bootstrap the Para Shooting database. Seed data includes lookup tables, reference data, and system configuration that must be present before the application can function.

### Seed Data Execution Order

```
┌─────────────────────────────────────────────────────────────┐
│                    SEED DATA ORDER                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. roles                    (No dependencies)               │
│  2. disability_categories    (No dependencies)               │
│  3. event_categories         (No dependencies)               │
│  4. shooting_events          (Depends on: event_categories)  │
│  5. state_associations       (No dependencies)               │
│  6. membership_types         (No dependencies)               │
│  7. document_categories      (No dependencies)               │
│  8. scheduled_jobs           (No dependencies)               │
│  9. admin_user               (Depends on: roles)             │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Seed Data Categories

| Category | Table | Records | Critical |
|----------|-------|---------|----------|
| Authentication | `roles` | 5 | ✓ |
| Classification | `disability_categories` | 5 | ✓ |
| Events | `event_categories` | 3 | ✓ |
| Events | `shooting_events` | 15+ | ✓ |
| Organization | `state_associations` | 35+ | ✓ |
| Membership | `membership_types` | 4 | ✓ |
| Content | `document_categories` | 5 | ✓ |
| System | `scheduled_jobs` | 6 | ○ |

---

## Roles & Permissions

### Role Definitions

| Role | Display Name | System | Description |
|------|--------------|--------|-------------|
| `admin` | Administrator | ✓ | Full system access, user management, all settings |
| `shooter` | Shooter | ✓ | Registered para-shooter with dashboard access |
| `coach` | Coach | ✓ | Team coach with shooter management access |
| `official` | Official | ✓ | Competition official with scoring access |
| `viewer` | Viewer | ✓ | Read-only public access |

### Permission Structure

```json
{
  "admin": {
    "users": ["create", "read", "update", "delete"],
    "shooters": ["create", "read", "update", "delete", "verify"],
    "competitions": ["create", "read", "update", "delete", "publish"],
    "scores": ["create", "read", "update", "delete", "verify"],
    "payments": ["read", "refund"],
    "content": ["create", "read", "update", "delete", "publish"],
    "settings": ["read", "update"]
  },
  "shooter": {
    "profile": ["read", "update"],
    "competitions": ["read", "register"],
    "scores": ["read"],
    "payments": ["create", "read"],
    "documents": ["read", "download"]
  },
  "coach": {
    "shooters": ["read"],
    "competitions": ["read"],
    "scores": ["read"],
    "documents": ["read", "download"]
  },
  "official": {
    "competitions": ["read"],
    "scores": ["create", "read", "update"],
    "shooters": ["read"]
  },
  "viewer": {
    "news": ["read"],
    "competitions": ["read"],
    "rankings": ["read"],
    "documents": ["read"]
  }
}
```

### SQL Seed

```sql
-- Roles seed data
insert into public.roles (name, display_name, description, permissions, is_system) values
(
    'admin',
    'Administrator',
    'Full system access including user management, competition administration, and all settings.',
    '{
        "users": ["create", "read", "update", "delete"],
        "shooters": ["create", "read", "update", "delete", "verify"],
        "competitions": ["create", "read", "update", "delete", "publish"],
        "scores": ["create", "read", "update", "delete", "verify"],
        "payments": ["read", "refund"],
        "content": ["create", "read", "update", "delete", "publish"],
        "settings": ["read", "update"]
    }'::jsonb,
    true
),
(
    'shooter',
    'Shooter',
    'Registered para-shooter with access to personal dashboard, competition registration, and score viewing.',
    '{
        "profile": ["read", "update"],
        "competitions": ["read", "register"],
        "scores": ["read"],
        "payments": ["create", "read"],
        "documents": ["read", "download"]
    }'::jsonb,
    true
),
(
    'coach',
    'Coach',
    'Team coach with access to shooter information and competition details.',
    '{
        "shooters": ["read"],
        "competitions": ["read"],
        "scores": ["read"],
        "documents": ["read", "download"]
    }'::jsonb,
    true
),
(
    'official',
    'Official',
    'Competition official with access to scoring and shooter verification.',
    '{
        "competitions": ["read"],
        "scores": ["create", "read", "update"],
        "shooters": ["read"]
    }'::jsonb,
    true
),
(
    'viewer',
    'Viewer',
    'Read-only access to public information.',
    '{
        "news": ["read"],
        "competitions": ["read"],
        "rankings": ["read"],
        "documents": ["read"]
    }'::jsonb,
    true
);
```

---

## Disability Categories (WSPS)

### WSPS Sport Classification System

| Code | Name | Event Type | Min Impairment | Description |
|------|------|------------|----------------|-------------|
| `SH1` | SH1 - Pistol/Rifle | BOTH | Limb impairment | Athletes with impairment in legs and/or shooting arm, but sufficient arm function to support a firearm without a stand |
| `SH2` | SH2 - Rifle | RIFLE | Upper limb impairment | Athletes with impairment affecting upper limbs who require a shooting stand to support the weight of the rifle |
| `VI1` | VI1 - Blind | RIFLE | Total blindness (B1) | Athletes who are totally blind or have minimal light perception |
| `VI2` | VI2 - Partially Sighted | RIFLE | Severe vision (B2) | Athletes with severe visual impairment - visual acuity ≤ 2/60 |
| `VI3` | VI3 - Partially Sighted | RIFLE | Moderate vision (B3) | Athletes with moderate visual impairment - visual acuity ≤ 6/60 |

### Equipment Allowances

| Class | Shooting Stand | Orthosis | Sighting Equipment |
|-------|----------------|----------|-------------------|
| SH1 | Not allowed | Allowed | Standard sights |
| SH2 | Required | Allowed | Standard sights |
| VI1 | Allowed | Allowed | Audio sighting device |
| VI2 | Allowed | Allowed | Audio sighting device |
| VI3 | Allowed | Allowed | Audio sighting device |

### SQL Seed

```sql
-- Disability categories (WSPS classification) seed data
insert into public.disability_categories (code, name, description, event_type, min_impairment, equipment_allowed, is_active) values
(
    'SH1',
    'SH1 - Pistol/Rifle',
    'Athletes with impairment in legs and/or shooting arm, but with sufficient arm function to support a firearm independently without a shooting stand. Includes athletes with paralysis, limb deficiency, or other physical impairments affecting lower body mobility.',
    'BOTH',
    'Loss of muscle strength, limb deficiency, impaired passive range of movement, or leg length difference',
    '{"shooting_stand": false, "orthosis": true, "wheelchair": true, "back_support": true}'::jsonb,
    true
),
(
    'SH2',
    'SH2 - Rifle',
    'Athletes with impairment affecting upper limbs who require a shooting stand to support the weight of the rifle. Includes athletes with significant upper body impairments that prevent them from holding a rifle unsupported.',
    'RIFLE',
    'Upper limb deficiency, impaired muscle power in arms, or coordination impairment affecting rifle handling',
    '{"shooting_stand": true, "orthosis": true, "wheelchair": true, "mouth_stick": true}'::jsonb,
    true
),
(
    'VI1',
    'VI1 - Visually Impaired (B1)',
    'Athletes who are totally blind - from no light perception in either eye to some light perception but inability to recognize the shape of a hand at any distance or in any direction. Uses audio sighting equipment.',
    'RIFLE',
    'No light perception (NLP) to light perception only - cannot recognize hand shape at any distance',
    '{"audio_sighting": true, "shooting_stand": true, "guide": true, "tactile_markers": true}'::jsonb,
    true
),
(
    'VI2',
    'VI2 - Visually Impaired (B2)',
    'Athletes with severe visual impairment - able to recognize the shape of a hand but with visual acuity of 2/60 or less, or visual field of less than 5 degrees. Uses audio sighting equipment.',
    'RIFLE',
    'Visual acuity ≤ 2/60 and/or visual field < 5 degrees',
    '{"audio_sighting": true, "shooting_stand": true, "guide": true, "magnification": false}'::jsonb,
    true
),
(
    'VI3',
    'VI3 - Visually Impaired (B3)',
    'Athletes with moderate visual impairment - visual acuity ranging from 2/60 to 6/60, or visual field of 5 to 20 degrees. Uses audio sighting equipment.',
    'RIFLE',
    'Visual acuity 2/60 to 6/60 and/or visual field 5-20 degrees',
    '{"audio_sighting": true, "shooting_stand": true, "guide": true, "magnification": false}'::jsonb,
    true
);
```

---

## Event Categories

### Categories

| Code | Name | Description | Icon |
|------|------|-------------|------|
| `R` | Rifle | All rifle shooting events including air rifle and small-bore rifle | 🎯 |
| `P` | Pistol | All pistol shooting events including air pistol and sport pistol | 🔫 |
| `S` | Shotgun | All shotgun events including trap, skeet, and double trap | 💥 |

### SQL Seed

```sql
-- Event categories seed data
insert into public.event_categories (name, code, description, icon_url, sort_order, is_active) values
(
    'Rifle',
    'R',
    'Rifle shooting events including 10m Air Rifle and 50m Rifle disciplines. Includes standing, prone, and 3-position events.',
    '/icons/rifle.svg',
    1,
    true
),
(
    'Pistol',
    'P',
    'Pistol shooting events including 10m Air Pistol, 25m Pistol, and 50m Pistol disciplines. Includes precision and rapid-fire events.',
    '/icons/pistol.svg',
    2,
    true
),
(
    'Shotgun',
    'S',
    'Shotgun shooting events including Trap, Skeet, and Double Trap disciplines. Note: Shotgun events have limited para-shooting participation.',
    '/icons/shotgun.svg',
    3,
    true
);
```

---

## Shooting Events

### Paralympic & WSPS Events

| Code | Name | Category | Distance | Shots Q/F | Max Score | Paralympic | WSPS Classes |
|------|------|----------|----------|-----------|-----------|------------|--------------|
| `R1` | 10m Air Rifle Standing SH1 | Rifle | 10m | 60/24 | 654.5 | ✓ | SH1 |
| `R2` | 10m Air Rifle Prone SH1 | Rifle | 10m | 60/24 | 654.5 | ✓ | SH1 |
| `R3` | 10m Air Rifle Prone SH2 | Rifle | 10m | 60/24 | 654.5 | ✓ | SH2 |
| `R4` | 10m Air Rifle Standing SH2 | Rifle | 10m | 60/24 | 654.5 | ✓ | SH2 |
| `R5` | 10m Air Rifle Prone Mixed SH2 | Rifle | 10m | 60/24 | 654.5 | ✓ | SH2 |
| `R6` | 50m Rifle Prone SH1 | Rifle | 50m | 60/- | 654.5 | ○ | SH1 |
| `R7` | 50m Rifle 3 Positions SH1 | Rifle | 50m | 120/- | 1185.5 | ○ | SH1 |
| `R8` | 10m Air Rifle Standing VI | Rifle | 10m | 60/24 | 654.5 | ○ | VI1, VI2, VI3 |
| `P1` | 10m Air Pistol SH1 | Pistol | 10m | 60/24 | 246.1 | ✓ | SH1 |
| `P2` | 25m Pistol SH1 | Pistol | 25m | 30+30/- | 594.0 | ✓ | SH1 |
| `P3` | 25m Pistol Mixed SH1 | Pistol | 25m | 30+30/- | 594.0 | ○ | SH1 |
| `P4` | 50m Pistol SH1 | Pistol | 50m | 60/- | 580.0 | ○ | SH1 |

### Event Details

#### R1 - 10m Air Rifle Standing SH1

| Parameter | Value |
|-----------|-------|
| Full Name | 10m Air Rifle Standing SH1 |
| Category | Rifle |
| Distance | 10 meters |
| Qualification | 60 shots in 75 minutes |
| Final | 24 shots (elimination format) |
| Max Qualification Score | 654.5 |
| Gender | Men / Women (separate) |
| Paralympic | Yes |
| WSPS Classes | SH1 |
| Target | 10-ring air rifle target |

### SQL Seed

```sql
-- Shooting events seed data
insert into public.shooting_events (
    event_category_id, name, code, distance, 
    shots_qualification, shots_final, 
    max_score_qualification, max_score_final,
    time_limit_minutes, gender, disability_categories,
    is_paralympic, is_wsps, is_active
) values
-- Rifle Events (SH1)
(
    (select id from public.event_categories where code = 'R'),
    '10m Air Rifle Standing SH1',
    'R1',
    '10m',
    60, 24,
    654.5, 261.2,
    75, null,
    '["SH1"]'::jsonb,
    true, true, true
),
(
    (select id from public.event_categories where code = 'R'),
    '10m Air Rifle Prone SH1',
    'R2',
    '10m',
    60, 24,
    654.5, 261.2,
    50, null,
    '["SH1"]'::jsonb,
    true, true, true
),
-- Rifle Events (SH2)
(
    (select id from public.event_categories where code = 'R'),
    '10m Air Rifle Prone SH2',
    'R3',
    '10m',
    60, 24,
    654.5, 261.2,
    50, null,
    '["SH2"]'::jsonb,
    true, true, true
),
(
    (select id from public.event_categories where code = 'R'),
    '10m Air Rifle Standing SH2',
    'R4',
    '10m',
    60, 24,
    654.5, 261.2,
    75, null,
    '["SH2"]'::jsonb,
    true, true, true
),
(
    (select id from public.event_categories where code = 'R'),
    '10m Air Rifle Prone Mixed SH2',
    'R5',
    '10m',
    60, 24,
    654.5, 261.2,
    50, 'mixed',
    '["SH2"]'::jsonb,
    true, true, true
),
-- 50m Rifle Events
(
    (select id from public.event_categories where code = 'R'),
    '50m Rifle Prone SH1',
    'R6',
    '50m',
    60, null,
    654.5, null,
    75, null,
    '["SH1"]'::jsonb,
    false, true, true
),
(
    (select id from public.event_categories where code = 'R'),
    '50m Rifle 3 Positions SH1',
    'R7',
    '50m',
    120, null,
    1185.5, null,
    150, null,
    '["SH1"]'::jsonb,
    false, true, true
),
-- Visually Impaired Events
(
    (select id from public.event_categories where code = 'R'),
    '10m Air Rifle Standing VI',
    'R8',
    '10m',
    60, 24,
    654.5, 261.2,
    75, null,
    '["VI1", "VI2", "VI3"]'::jsonb,
    false, true, true
),
-- Pistol Events
(
    (select id from public.event_categories where code = 'P'),
    '10m Air Pistol SH1',
    'P1',
    '10m',
    60, 24,
    246.1, 246.1,
    75, null,
    '["SH1"]'::jsonb,
    true, true, true
),
(
    (select id from public.event_categories where code = 'P'),
    '25m Pistol SH1',
    'P2',
    '25m',
    60, null,
    594.0, null,
    null, null,
    '["SH1"]'::jsonb,
    true, true, true
),
(
    (select id from public.event_categories where code = 'P'),
    '25m Pistol Mixed SH1',
    'P3',
    '25m',
    60, null,
    594.0, null,
    null, 'mixed',
    '["SH1"]'::jsonb,
    false, true, true
),
(
    (select id from public.event_categories where code = 'P'),
    '50m Pistol SH1',
    'P4',
    '50m',
    60, null,
    580.0, null,
    90, null,
    '["SH1"]'::jsonb,
    false, true, true
);
```

---

## State Associations

### Affiliated State Units

| Code | State | Full Name |
|------|-------|-----------|
| AN | Andaman & Nicobar | Andaman & Nicobar Rifle Association |
| AP | Andhra Pradesh | Andhra Pradesh State Rifle Association |
| AR | Arunachal Pradesh | Arunachal Pradesh Rifle Association |
| AS | Assam | Assam State Rifle Association |
| BR | Bihar | Bihar State Rifle Association |
| CG | Chhattisgarh | Chhattisgarh State Rifle Association |
| CH | Chandigarh | Chandigarh State Rifle Association |
| DD | Dadra & Nagar Haveli | Dadra & Nagar Haveli Rifle Association |
| DL | Delhi | Delhi State Rifle Association |
| GA | Goa | Goa State Rifle Association |
| GJ | Gujarat | Gujarat State Rifle Association |
| HP | Himachal Pradesh | Himachal Pradesh State Rifle Association |
| HR | Haryana | Haryana State Rifle Association |
| JH | Jharkhand | Jharkhand State Rifle Association |
| JK | Jammu & Kashmir | Jammu & Kashmir State Rifle Association |
| KA | Karnataka | Karnataka State Rifle Association |
| KL | Kerala | Kerala State Rifle Association |
| LA | Ladakh | Ladakh Rifle Association |
| MH | Maharashtra | Maharashtra State Rifle Association |
| ML | Meghalaya | Meghalaya State Rifle Association |
| MN | Manipur | Manipur State Rifle Association |
| MP | Madhya Pradesh | Madhya Pradesh State Rifle Association |
| MZ | Mizoram | Mizoram State Rifle Association |
| NL | Nagaland | Nagaland State Rifle Association |
| OD | Odisha | Odisha State Rifle Association |
| PB | Punjab | Punjab State Rifle Association |
| PY | Puducherry | Puducherry Rifle Association |
| RJ | Rajasthan | Rajasthan State Rifle Association |
| SK | Sikkim | Sikkim State Rifle Association |
| TN | Tamil Nadu | Tamil Nadu State Rifle Association |
| TS | Telangana | Telangana State Rifle Association |
| TR | Tripura | Tripura State Rifle Association |
| UK | Uttarakhand | Uttarakhand State Rifle Association |
| UP | Uttar Pradesh | Uttar Pradesh State Rifle Association |
| WB | West Bengal | West Bengal State Rifle Association |

### SQL Seed

```sql
-- State associations seed data
insert into public.state_associations (code, name, state, is_active) values
('AN', 'Andaman & Nicobar Rifle Association', 'Andaman & Nicobar Islands', true),
('AP', 'Andhra Pradesh State Rifle Association', 'Andhra Pradesh', true),
('AR', 'Arunachal Pradesh Rifle Association', 'Arunachal Pradesh', true),
('AS', 'Assam State Rifle Association', 'Assam', true),
('BR', 'Bihar State Rifle Association', 'Bihar', true),
('CG', 'Chhattisgarh State Rifle Association', 'Chhattisgarh', true),
('CH', 'Chandigarh State Rifle Association', 'Chandigarh', true),
('DD', 'Dadra & Nagar Haveli Rifle Association', 'Dadra & Nagar Haveli', true),
('DL', 'Delhi State Rifle Association', 'Delhi', true),
('GA', 'Goa State Rifle Association', 'Goa', true),
('GJ', 'Gujarat State Rifle Association', 'Gujarat', true),
('HP', 'Himachal Pradesh State Rifle Association', 'Himachal Pradesh', true),
('HR', 'Haryana State Rifle Association', 'Haryana', true),
('JH', 'Jharkhand State Rifle Association', 'Jharkhand', true),
('JK', 'Jammu & Kashmir State Rifle Association', 'Jammu & Kashmir', true),
('KA', 'Karnataka State Rifle Association', 'Karnataka', true),
('KL', 'Kerala State Rifle Association', 'Kerala', true),
('LA', 'Ladakh Rifle Association', 'Ladakh', true),
('MH', 'Maharashtra State Rifle Association', 'Maharashtra', true),
('ML', 'Meghalaya State Rifle Association', 'Meghalaya', true),
('MN', 'Manipur State Rifle Association', 'Manipur', true),
('MP', 'Madhya Pradesh State Rifle Association', 'Madhya Pradesh', true),
('MZ', 'Mizoram State Rifle Association', 'Mizoram', true),
('NL', 'Nagaland State Rifle Association', 'Nagaland', true),
('OD', 'Odisha State Rifle Association', 'Odisha', true),
('PB', 'Punjab State Rifle Association', 'Punjab', true),
('PY', 'Puducherry Rifle Association', 'Puducherry', true),
('RJ', 'Rajasthan State Rifle Association', 'Rajasthan', true),
('SK', 'Sikkim State Rifle Association', 'Sikkim', true),
('TN', 'Tamil Nadu State Rifle Association', 'Tamil Nadu', true),
('TS', 'Telangana State Rifle Association', 'Telangana', true),
('TR', 'Tripura State Rifle Association', 'Tripura', true),
('UK', 'Uttarakhand State Rifle Association', 'Uttarakhand', true),
('UP', 'Uttar Pradesh State Rifle Association', 'Uttar Pradesh', true),
('WB', 'West Bengal State Rifle Association', 'West Bengal', true);
```

---

## Membership Types

### Available Memberships

| Code | Name | Duration | Price (INR) | Benefits |
|------|------|----------|-------------|----------|
| `LIFE` | Life Membership | Lifetime | ₹25,000 | Full access, voting rights, all events |
| `ANNUAL` | Annual Membership | 12 months | ₹2,500 | Full access for one year |
| `INSTITUTIONAL` | Institutional Membership | 12 months | ₹10,000 | For clubs and organizations |
| `HONORARY` | Honorary Membership | Lifetime | ₹0 | For distinguished persons |

### SQL Seed

```sql
-- Membership types seed data
insert into public.membership_types (name, code, description, duration_months, price, benefits, is_active) values
(
    'Life Membership',
    'LIFE',
    'Lifetime membership with full privileges including voting rights in elections and priority access to all events.',
    null,
    25000.00,
    '[
        "Lifetime validity",
        "Voting rights in elections",
        "Priority event registration",
        "Official membership card",
        "Newsletter subscription",
        "Discounted entry fees"
    ]'::jsonb,
    true
),
(
    'Annual Membership',
    'ANNUAL',
    'Annual membership with full access to shooter dashboard, event registration, and member benefits.',
    12,
    2500.00,
    '[
        "12 months validity",
        "Dashboard access",
        "Event registration",
        "Official membership card",
        "Newsletter subscription"
    ]'::jsonb,
    true
),
(
    'Institutional Membership',
    'INSTITUTIONAL',
    'Annual membership for clubs, academies, and shooting ranges with multiple user access.',
    12,
    10000.00,
    '[
        "12 months validity",
        "Up to 10 user accounts",
        "Event registration for members",
        "Official membership certificate",
        "Newsletter subscription",
        "Listing in club directory"
    ]'::jsonb,
    true
),
(
    'Honorary Membership',
    'HONORARY',
    'Complimentary lifetime membership granted to distinguished persons and Arjuna/Padma awardees.',
    null,
    0.00,
    '[
        "Lifetime validity",
        "Full privileges",
        "VIP access at events",
        "Special recognition"
    ]'::jsonb,
    true
);
```

---

## Document Categories

### Categories

| Slug | Name | Description | Icon |
|------|------|-------------|------|
| `forms` | Forms | Application forms for registration, licensing, and membership | 📝 |
| `rules` | Rules & Regulations | Competition rules, ISSF rules, and committee guidelines | 📜 |
| `circulars` | Circulars & Notices | Official circulars, announcements, and notices | 📢 |
| `results` | Results & Rankings | Competition results and official rankings | 🏆 |
| `reports` | Annual Reports | Annual reports and financial statements | 📊 |

### SQL Seed

```sql
-- Document categories seed data
insert into public.document_categories (name, slug, description, icon, sort_order, is_active) values
(
    'Forms',
    'forms',
    'Application forms for registration, ISSF ID, membership applications, import/export permits, and other official forms.',
    'file-text',
    1,
    true
),
(
    'Rules & Regulations',
    'rules',
    'Competition rules, ISSF rule books, WSPS technical rules, anti-doping regulations, and committee guidelines.',
    'book-open',
    2,
    true
),
(
    'Circulars & Notices',
    'circulars',
    'Official circulars, notifications, announcements, and important notices from the committee.',
    'bell',
    3,
    true
),
(
    'Results & Rankings',
    'results',
    'Competition results, official rankings, score sheets, and performance records.',
    'trophy',
    4,
    true
),
(
    'Annual Reports',
    'reports',
    'Annual reports, financial statements, audit reports, and activity summaries.',
    'bar-chart-2',
    5,
    true
);
```

---

## System Configuration

### Scheduled Jobs

| Job Name | Type | Schedule | Description |
|----------|------|----------|-------------|
| `cleanup_expired_sessions` | CLEANUP | `0 2 * * *` | Remove expired user sessions daily |
| `cleanup_old_notifications` | CLEANUP | `0 3 * * 0` | Remove notifications older than 90 days weekly |
| `update_rankings` | RANKING_UPDATE | `0 4 * * 1` | Recalculate rankings weekly |
| `send_email_digest` | EMAIL_DIGEST | `0 8 * * 1` | Send weekly email digest |
| `backup_database` | BACKUP | `0 1 * * *` | Daily database backup |
| `generate_reports` | REPORT | `0 5 1 * *` | Generate monthly reports |

### SQL Seed

```sql
-- Scheduled jobs seed data
insert into public.scheduled_jobs (job_name, job_type, schedule, is_enabled, metadata) values
(
    'cleanup_expired_sessions',
    'CLEANUP',
    '0 2 * * *',
    true,
    '{"target_table": "user_sessions", "condition": "expires_at < now()", "retention_days": 30}'::jsonb
),
(
    'cleanup_old_notifications',
    'CLEANUP',
    '0 3 * * 0',
    true,
    '{"target_table": "notifications", "retention_days": 90}'::jsonb
),
(
    'update_rankings',
    'RANKING_UPDATE',
    '0 4 * * 1',
    true,
    '{"events": "all", "ranking_types": ["NATIONAL"]}'::jsonb
),
(
    'send_email_digest',
    'EMAIL_DIGEST',
    '0 8 * * 1',
    true,
    '{"template": "weekly_digest", "recipients": "all_active_users"}'::jsonb
),
(
    'backup_database',
    'BACKUP',
    '0 1 * * *',
    true,
    '{"type": "full", "compression": "gzip", "retention_days": 30}'::jsonb
),
(
    'generate_reports',
    'REPORT',
    '0 5 1 * *',
    true,
    '{"reports": ["monthly_summary", "financial_summary"], "format": "pdf"}'::jsonb
);
```

---

## Complete Seed Script

### Execution Order

```sql
-- Para Shooting Database Seed Script
-- Execute in order after schema creation

\echo 'Starting seed data population...'

-- 1. Roles (no dependencies)
\echo 'Seeding roles...'
\i seed/01_roles.sql

-- 2. Disability categories (no dependencies)
\echo 'Seeding disability categories...'
\i seed/02_disability_categories.sql

-- 3. Event categories (no dependencies)
\echo 'Seeding event categories...'
\i seed/03_event_categories.sql

-- 4. Shooting events (depends on event_categories)
\echo 'Seeding shooting events...'
\i seed/04_shooting_events.sql

-- 5. State associations (no dependencies)
\echo 'Seeding state associations...'
\i seed/05_state_associations.sql

-- 6. Membership types (no dependencies)
\echo 'Seeding membership types...'
\i seed/06_membership_types.sql

-- 7. Document categories (no dependencies)
\echo 'Seeding document categories...'
\i seed/07_document_categories.sql

-- 8. Scheduled jobs (no dependencies)
\echo 'Seeding scheduled jobs...'
\i seed/08_scheduled_jobs.sql

\echo 'Seed data population complete!'

-- Verify seed counts
select 'roles' as table_name, count(*) as row_count from public.roles
union all select 'disability_categories', count(*) from public.disability_categories
union all select 'event_categories', count(*) from public.event_categories
union all select 'shooting_events', count(*) from public.shooting_events
union all select 'state_associations', count(*) from public.state_associations
union all select 'membership_types', count(*) from public.membership_types
union all select 'document_categories', count(*) from public.document_categories
union all select 'scheduled_jobs', count(*) from public.scheduled_jobs;
```

