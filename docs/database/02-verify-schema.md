# Database Schema Verification Script

> Para Shooting Committee of India - Schema Verification Documentation
> Version: 1.0 | Last Updated: December 2025

---

## Table of Contents

1. [Overview](#overview)
2. [Verification Categories](#verification-categories)
3. [Table Existence Checks](#table-existence-checks)
4. [Constraint Verification](#constraint-verification)
5. [Index Verification](#index-verification)
6. [Trigger Verification](#trigger-verification)
7. [Data Integrity Checks](#data-integrity-checks)
8. [Performance Checks](#performance-checks)
9. [Verification Report](#verification-report)

---

## Overview

This document provides the verification script specification for confirming the Para Shooting database schema is correctly deployed. The script validates all tables, constraints, indexes, triggers, and views are in place.

### Purpose

| Goal | Description |
|------|-------------|
| **Deployment Validation** | Confirm schema is correctly applied after migrations |
| **CI/CD Integration** | Automated checks in deployment pipeline |
| **Environment Parity** | Ensure dev/staging/prod have identical schemas |
| **Audit Compliance** | Document database structure for compliance |

---

## Verification Categories

```
┌─────────────────────────────────────────────────────────────┐
│                VERIFICATION CATEGORIES                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────┐  ┌─────────────────┐                   │
│  │ 1. TABLES       │  │ 2. CONSTRAINTS  │                   │
│  │   - Existence   │  │   - Primary Keys│                   │
│  │   - Columns     │  │   - Foreign Keys│                   │
│  │   - Data Types  │  │   - Unique      │                   │
│  │   - Defaults    │  │   - Check       │                   │
│  └─────────────────┘  └─────────────────┘                   │
│                                                              │
│  ┌─────────────────┐  ┌─────────────────┐                   │
│  │ 3. INDEXES      │  │ 4. TRIGGERS     │                   │
│  │   - Performance │  │   - updated_at  │                   │
│  │   - Unique      │  │   - audit_log   │                   │
│  │   - Partial     │  │   - Custom      │                   │
│  └─────────────────┘  └─────────────────┘                   │
│                                                              │
│  ┌─────────────────┐  ┌─────────────────┐                   │
│  │ 5. VIEWS        │  │ 6. FUNCTIONS    │                   │
│  │   - Definition  │  │   - Existence   │                   │
│  │   - Permissions │  │   - Parameters  │                   │
│  └─────────────────┘  └─────────────────┘                   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Table Existence Checks

### Expected Tables

| Domain | Table Name | Required |
|--------|------------|----------|
| **Auth** | `users` | ✓ |
| **Auth** | `roles` | ✓ |
| **Auth** | `user_roles` | ✓ |
| **Auth** | `user_sessions` | ✓ |
| **Shooters** | `state_associations` | ✓ |
| **Shooters** | `disability_categories` | ✓ |
| **Shooters** | `shooters` | ✓ |
| **Shooters** | `shooter_classifications` | ✓ |
| **Competitions** | `venues` | ✓ |
| **Competitions** | `event_categories` | ✓ |
| **Competitions** | `shooting_events` | ✓ |
| **Competitions** | `competitions` | ✓ |
| **Competitions** | `competition_events` | ✓ |
| **Competitions** | `competition_entries` | ✓ |
| **Scores** | `scores` | ✓ |
| **Scores** | `rankings` | ✓ |
| **Payments** | `membership_types` | ✓ |
| **Payments** | `memberships` | ✓ |
| **Payments** | `payments` | ✓ |
| **Payments** | `refunds` | ✓ |
| **Content** | `news_articles` | ✓ |
| **Content** | `notifications` | ✓ |
| **Content** | `document_categories` | ✓ |
| **Content** | `documents` | ✓ |
| **Content** | `contact_messages` | ✓ |
| **Content** | `committee_members` | ✓ |
| **System** | `audit_logs` | ✓ |
| **System** | `scheduled_jobs` | ✓ |

### Verification SQL

```sql
-- Check all required tables exist
do $$
declare
    required_tables text[] := array[
        'users', 'roles', 'user_roles', 'user_sessions',
        'state_associations', 'disability_categories', 'shooters', 'shooter_classifications',
        'venues', 'event_categories', 'shooting_events', 'competitions', 'competition_events', 'competition_entries',
        'scores', 'rankings',
        'membership_types', 'memberships', 'payments', 'refunds',
        'news_articles', 'notifications', 'document_categories', 'documents', 'contact_messages', 'committee_members',
        'audit_logs', 'scheduled_jobs'
    ];
    missing_tables text[] := '{}';
    tbl text;
begin
    foreach tbl in array required_tables loop
        if not exists (
            select 1 from information_schema.tables 
            where table_schema = 'public' and table_name = tbl
        ) then
            missing_tables := array_append(missing_tables, tbl);
        end if;
    end loop;
    
    if array_length(missing_tables, 1) > 0 then
        raise exception 'Missing tables: %', array_to_string(missing_tables, ', ');
    else
        raise notice 'SUCCESS: All % required tables exist', array_length(required_tables, 1);
    end if;
end $$;
```

---

## Constraint Verification

### Primary Key Constraints

| Table | Constraint Name | Column |
|-------|-----------------|--------|
| `users` | `users_pkey` | `id` |
| `roles` | `roles_pkey` | `id` |
| `shooters` | `shooters_pkey` | `id` |
| `competitions` | `competitions_pkey` | `id` |
| `scores` | `scores_pkey` | `id` |
| `payments` | `payments_pkey` | `id` |

```sql
-- Verify all primary keys exist
select 
    tc.table_name,
    tc.constraint_name,
    kcu.column_name,
    case when tc.constraint_name is not null then '✓' else '✗' end as status
from information_schema.table_constraints tc
join information_schema.key_column_usage kcu 
    on tc.constraint_name = kcu.constraint_name
where tc.table_schema = 'public'
    and tc.constraint_type = 'PRIMARY KEY'
order by tc.table_name;
```

### Foreign Key Constraints

| Table | Constraint | References |
|-------|------------|------------|
| `user_roles` | `user_roles_user_id_fkey` | `users(id)` |
| `user_roles` | `user_roles_role_id_fkey` | `roles(id)` |
| `shooters` | `shooters_user_id_fkey` | `users(id)` |
| `shooters` | `shooters_state_association_id_fkey` | `state_associations(id)` |
| `shooter_classifications` | `shooter_classifications_shooter_id_fkey` | `shooters(id)` |
| `shooter_classifications` | `shooter_classifications_disability_category_id_fkey` | `disability_categories(id)` |
| `shooting_events` | `shooting_events_event_category_id_fkey` | `event_categories(id)` |
| `competitions` | `competitions_venue_id_fkey` | `venues(id)` |
| `competition_events` | `competition_events_competition_id_fkey` | `competitions(id)` |
| `competition_events` | `competition_events_shooting_event_id_fkey` | `shooting_events(id)` |
| `competition_entries` | `competition_entries_competition_event_id_fkey` | `competition_events(id)` |
| `competition_entries` | `competition_entries_shooter_id_fkey` | `shooters(id)` |
| `scores` | `scores_competition_entry_id_fkey` | `competition_entries(id)` |
| `rankings` | `rankings_shooter_id_fkey` | `shooters(id)` |
| `rankings` | `rankings_shooting_event_id_fkey` | `shooting_events(id)` |
| `memberships` | `memberships_user_id_fkey` | `users(id)` |
| `memberships` | `memberships_membership_type_id_fkey` | `membership_types(id)` |
| `payments` | `payments_user_id_fkey` | `users(id)` |
| `refunds` | `refunds_payment_id_fkey` | `payments(id)` |
| `news_articles` | `news_articles_author_id_fkey` | `users(id)` |
| `notifications` | `notifications_user_id_fkey` | `users(id)` |
| `documents` | `documents_category_id_fkey` | `document_categories(id)` |
| `audit_logs` | `audit_logs_user_id_fkey` | `users(id)` |

```sql
-- Verify all foreign keys exist
select 
    tc.table_name,
    tc.constraint_name,
    ccu.table_name as references_table,
    ccu.column_name as references_column
from information_schema.table_constraints tc
join information_schema.constraint_column_usage ccu 
    on tc.constraint_name = ccu.constraint_name
where tc.table_schema = 'public'
    and tc.constraint_type = 'FOREIGN KEY'
order by tc.table_name, tc.constraint_name;
```

### Unique Constraints

| Table | Constraint | Columns |
|-------|------------|---------|
| `users` | `users_email_key` | `email` |
| `users` | `users_public_id_key` | `public_id` |
| `roles` | `roles_name_key` | `name` |
| `shooters` | `shooters_user_id_key` | `user_id` |
| `shooters` | `shooters_shooter_id_key` | `shooter_id` |
| `shooters` | `shooters_issf_id_key` | `issf_id` |
| `disability_categories` | `disability_categories_code_key` | `code` |
| `state_associations` | `state_associations_code_key` | `code` |
| `event_categories` | `event_categories_name_key` | `name` |
| `event_categories` | `event_categories_code_key` | `code` |
| `shooting_events` | `shooting_events_code_key` | `code` |
| `competitions` | `competitions_public_id_key` | `public_id` |
| `competitions` | `competitions_code_key` | `code` |
| `competition_events` | `competition_events_competition_id_shooting_event_id_key` | `competition_id, shooting_event_id` |
| `competition_entries` | `competition_entries_competition_event_id_shooter_id_key` | `competition_event_id, shooter_id` |
| `scores` | `scores_competition_entry_id_stage_key` | `competition_entry_id, stage` |
| `payments` | `payments_razorpay_order_id_key` | `razorpay_order_id` |
| `payments` | `payments_razorpay_payment_id_key` | `razorpay_payment_id` |
| `news_articles` | `news_articles_slug_key` | `slug` |

```sql
-- Verify all unique constraints exist
select 
    tc.table_name,
    tc.constraint_name,
    string_agg(kcu.column_name, ', ' order by kcu.ordinal_position) as columns
from information_schema.table_constraints tc
join information_schema.key_column_usage kcu 
    on tc.constraint_name = kcu.constraint_name
where tc.table_schema = 'public'
    and tc.constraint_type = 'UNIQUE'
group by tc.table_name, tc.constraint_name
order by tc.table_name;
```

### Check Constraints

| Table | Constraint | Condition |
|-------|------------|-----------|
| `users` | `users_email_format` | `email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'` |
| `shooters` | `shooters_gender_check` | `gender in ('male', 'female', 'other')` |
| `disability_categories` | `disability_categories_event_type_check` | `event_type in ('RIFLE', 'PISTOL', 'BOTH')` |
| `shooter_classifications` | `shooter_classifications_status_check` | `classification_status in ('NEW', 'REVIEW', 'CONFIRMED', 'FIXED')` |
| `competitions` | `competitions_type_check` | `competition_type in (...)` |
| `competitions` | `competitions_level_check` | `level in (...)` |
| `competitions` | `competitions_status_check` | `status in (...)` |
| `competitions` | `competitions_date_check` | `end_date >= start_date` |
| `competition_events` | `competition_events_status_check` | `status in (...)` |
| `competition_entries` | `competition_entries_entry_status_check` | `entry_status in (...)` |
| `competition_entries` | `competition_entries_payment_status_check` | `payment_status in (...)` |
| `scores` | `scores_stage_check` | `stage in ('QUALIFICATION', 'FINAL', 'SHOOTOFF')` |
| `scores` | `scores_total_score_check` | `total_score >= 0` |
| `rankings` | `rankings_type_check` | `ranking_type in ('NATIONAL', 'WORLD', 'ASIAN')` |
| `rankings` | `rankings_rank_check` | `rank > 0` |
| `payments` | `payments_type_check` | `payment_type in (...)` |
| `payments` | `payments_status_check` | `status in (...)` |
| `payments` | `payments_amount_check` | `amount > 0` |
| `memberships` | `memberships_status_check` | `status in (...)` |
| `refunds` | `refunds_status_check` | `status in (...)` |
| `refunds` | `refunds_amount_check` | `amount > 0` |
| `news_articles` | `news_articles_category_check` | `category in (...)` |
| `news_articles` | `news_articles_status_check` | `status in (...)` |
| `notifications` | `notifications_type_check` | `type in (...)` |
| `contact_messages` | `contact_messages_status_check` | `status in (...)` |
| `committee_members` | `committee_members_type_check` | `committee_type in (...)` |
| `audit_logs` | `audit_logs_action_check` | `action in (...)` |
| `scheduled_jobs` | `scheduled_jobs_type_check` | `job_type in (...)` |

```sql
-- Verify all check constraints exist
select 
    tc.table_name,
    tc.constraint_name,
    cc.check_clause
from information_schema.table_constraints tc
join information_schema.check_constraints cc 
    on tc.constraint_name = cc.constraint_name
where tc.table_schema = 'public'
    and tc.constraint_type = 'CHECK'
    and tc.constraint_name not like '%_not_null'
order by tc.table_name, tc.constraint_name;
```

---

## Index Verification

### Required Indexes

| Table | Index Name | Columns | Type |
|-------|------------|---------|------|
| `users` | `idx_users_email` | `email` | BTREE |
| `users` | `idx_users_public_id` | `public_id` | BTREE |
| `users` | `idx_users_deleted_at` | `deleted_at` | PARTIAL |
| `shooters` | `idx_shooters_user_id` | `user_id` | BTREE |
| `shooters` | `idx_shooters_shooter_id` | `shooter_id` | BTREE |
| `shooters` | `idx_shooters_state_association` | `state_association_id` | BTREE |
| `shooter_classifications` | `idx_shooter_classifications_shooter` | `shooter_id` | BTREE |
| `shooter_classifications` | `idx_shooter_classifications_current` | `shooter_id, is_current` | PARTIAL |
| `competitions` | `idx_competitions_dates` | `start_date, end_date` | BTREE |
| `competitions` | `idx_competitions_status` | `status` | BTREE |
| `competitions` | `idx_competitions_level` | `level` | BTREE |
| `competition_entries` | `idx_competition_entries_shooter` | `shooter_id` | BTREE |
| `competition_entries` | `idx_competition_entries_event` | `competition_event_id` | BTREE |
| `competition_entries` | `idx_competition_entries_status` | `entry_status` | BTREE |
| `scores` | `idx_scores_entry` | `competition_entry_id` | BTREE |
| `scores` | `idx_scores_stage` | `stage` | BTREE |
| `rankings` | `idx_rankings_shooter_event` | `shooter_id, shooting_event_id` | BTREE |
| `rankings` | `idx_rankings_current` | `is_current` | PARTIAL |
| `payments` | `idx_payments_user` | `user_id` | BTREE |
| `payments` | `idx_payments_status` | `status` | BTREE |
| `payments` | `idx_payments_razorpay_order` | `razorpay_order_id` | BTREE |
| `memberships` | `idx_memberships_user` | `user_id` | BTREE |
| `memberships` | `idx_memberships_status` | `status` | BTREE |
| `news_articles` | `idx_news_articles_status` | `status` | BTREE |
| `news_articles` | `idx_news_articles_published` | `published_at` | PARTIAL |
| `news_articles` | `idx_news_articles_slug` | `slug` | BTREE |
| `notifications` | `idx_notifications_user_unread` | `user_id, is_read` | PARTIAL |
| `audit_logs` | `idx_audit_logs_user` | `user_id` | BTREE |
| `audit_logs` | `idx_audit_logs_table_record` | `table_name, record_id` | BTREE |
| `audit_logs` | `idx_audit_logs_created` | `created_at` | BTREE |

```sql
-- Verify all required indexes exist
select 
    schemaname,
    tablename,
    indexname,
    indexdef
from pg_indexes
where schemaname = 'public'
order by tablename, indexname;
```

### Index Verification Script

```sql
-- Check all required indexes exist
do $$
declare
    required_indexes text[] := array[
        'idx_users_email',
        'idx_users_public_id',
        'idx_users_deleted_at',
        'idx_shooters_user_id',
        'idx_shooters_shooter_id',
        'idx_competitions_dates',
        'idx_competitions_status',
        'idx_competition_entries_shooter',
        'idx_scores_entry',
        'idx_rankings_shooter_event',
        'idx_payments_user',
        'idx_payments_status',
        'idx_memberships_user',
        'idx_news_articles_status',
        'idx_notifications_user_unread',
        'idx_audit_logs_user',
        'idx_audit_logs_created'
    ];
    missing_indexes text[] := '{}';
    idx text;
begin
    foreach idx in array required_indexes loop
        if not exists (
            select 1 from pg_indexes 
            where schemaname = 'public' and indexname = idx
        ) then
            missing_indexes := array_append(missing_indexes, idx);
        end if;
    end loop;
    
    if array_length(missing_indexes, 1) > 0 then
        raise warning 'Missing indexes: %', array_to_string(missing_indexes, ', ');
    else
        raise notice 'SUCCESS: All % required indexes exist', array_length(required_indexes, 1);
    end if;
end $$;
```

---

## Trigger Verification

### Required Triggers

| Table | Trigger Name | Function | Event |
|-------|--------------|----------|-------|
| `users` | `update_users_updated_at` | `update_updated_at_column()` | BEFORE UPDATE |
| `shooters` | `update_shooters_updated_at` | `update_updated_at_column()` | BEFORE UPDATE |
| `shooter_classifications` | `update_shooter_classifications_updated_at` | `update_updated_at_column()` | BEFORE UPDATE |
| `state_associations` | `update_state_associations_updated_at` | `update_updated_at_column()` | BEFORE UPDATE |
| `venues` | `update_venues_updated_at` | `update_updated_at_column()` | BEFORE UPDATE |
| `shooting_events` | `update_shooting_events_updated_at` | `update_updated_at_column()` | BEFORE UPDATE |
| `competitions` | `update_competitions_updated_at` | `update_updated_at_column()` | BEFORE UPDATE |
| `competition_events` | `update_competition_events_updated_at` | `update_updated_at_column()` | BEFORE UPDATE |
| `competition_entries` | `update_competition_entries_updated_at` | `update_updated_at_column()` | BEFORE UPDATE |
| `scores` | `update_scores_updated_at` | `update_updated_at_column()` | BEFORE UPDATE |
| `rankings` | `update_rankings_updated_at` | `update_updated_at_column()` | BEFORE UPDATE |
| `memberships` | `update_memberships_updated_at` | `update_updated_at_column()` | BEFORE UPDATE |
| `payments` | `update_payments_updated_at` | `update_updated_at_column()` | BEFORE UPDATE |
| `refunds` | `update_refunds_updated_at` | `update_updated_at_column()` | BEFORE UPDATE |
| `news_articles` | `update_news_articles_updated_at` | `update_updated_at_column()` | BEFORE UPDATE |
| `documents` | `update_documents_updated_at` | `update_updated_at_column()` | BEFORE UPDATE |
| `contact_messages` | `update_contact_messages_updated_at` | `update_updated_at_column()` | BEFORE UPDATE |
| `committee_members` | `update_committee_members_updated_at` | `update_updated_at_column()` | BEFORE UPDATE |
| `scheduled_jobs` | `update_scheduled_jobs_updated_at` | `update_updated_at_column()` | BEFORE UPDATE |

```sql
-- Verify all triggers exist
select 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
from information_schema.triggers
where trigger_schema = 'public'
order by event_object_table, trigger_name;
```

### Trigger Function Verification

```sql
-- Verify trigger functions exist
select 
    routine_name,
    routine_type,
    data_type as return_type
from information_schema.routines
where routine_schema = 'public'
    and routine_type = 'FUNCTION'
order by routine_name;
```

---

## Data Integrity Checks

### Orphan Record Detection

```sql
-- Check for orphan shooters (no linked user)
select count(*) as orphan_shooters
from public.shooters s
left join public.users u on s.user_id = u.id
where u.id is null;

-- Check for orphan competition entries (no linked shooter)
select count(*) as orphan_entries
from public.competition_entries ce
left join public.shooters s on ce.shooter_id = s.id
where s.id is null;

-- Check for orphan scores (no linked entry)
select count(*) as orphan_scores
from public.scores sc
left join public.competition_entries ce on sc.competition_entry_id = ce.id
where ce.id is null;

-- Check for orphan payments (no linked user)
select count(*) as orphan_payments
from public.payments p
left join public.users u on p.user_id = u.id
where u.id is null;
```

### Data Consistency Checks

```sql
-- Check competition date consistency
select 
    id, name, start_date, end_date,
    'End date before start date' as issue
from public.competitions
where end_date < start_date;

-- Check for negative scores
select 
    id, competition_entry_id, total_score,
    'Negative score' as issue
from public.scores
where total_score < 0;

-- Check for invalid rankings
select 
    id, shooter_id, rank,
    'Invalid rank (zero or negative)' as issue
from public.rankings
where rank <= 0;

-- Check for payment amount consistency
select 
    id, amount,
    'Invalid amount (zero or negative)' as issue
from public.payments
where amount <= 0;

-- Check for future created_at timestamps
select 
    'users' as table_name, count(*) as future_records
from public.users where created_at > now()
union all
select 'shooters', count(*) from public.shooters where created_at > now()
union all
select 'competitions', count(*) from public.competitions where created_at > now()
union all
select 'payments', count(*) from public.payments where created_at > now();
```

---

## Performance Checks

### Table Statistics

```sql
-- Get table sizes and row counts
select 
    relname as table_name,
    n_live_tup as estimated_rows,
    pg_size_pretty(pg_total_relation_size(relid)) as total_size,
    pg_size_pretty(pg_relation_size(relid)) as table_size,
    pg_size_pretty(pg_indexes_size(relid)) as indexes_size
from pg_stat_user_tables
where schemaname = 'public'
order by pg_total_relation_size(relid) desc;
```

### Index Usage Statistics

```sql
-- Check index usage
select 
    schemaname,
    relname as table_name,
    indexrelname as index_name,
    idx_scan as index_scans,
    idx_tup_read as tuples_read,
    idx_tup_fetch as tuples_fetched
from pg_stat_user_indexes
where schemaname = 'public'
order by idx_scan desc;
```

### Unused Indexes

```sql
-- Find unused indexes (candidates for removal)
select 
    schemaname,
    relname as table_name,
    indexrelname as index_name,
    pg_size_pretty(pg_relation_size(indexrelid)) as index_size
from pg_stat_user_indexes
where schemaname = 'public'
    and idx_scan = 0
    and indexrelname not like '%_pkey'
order by pg_relation_size(indexrelid) desc;
```

---

## Verification Report

### Complete Verification Script

```sql
-- PARA SHOOTING DATABASE SCHEMA VERIFICATION REPORT
-- Run this script after deployment to verify schema integrity

\echo '=================================================='
\echo 'PARA SHOOTING DATABASE SCHEMA VERIFICATION REPORT'
\echo '=================================================='
\echo ''

-- 1. TABLE COUNT
\echo '1. TABLE VERIFICATION'
\echo '---------------------'
select 
    count(*) as total_tables,
    case when count(*) = 28 then 'PASS' else 'FAIL' end as status
from information_schema.tables 
where table_schema = 'public' and table_type = 'BASE TABLE';

-- 2. CONSTRAINT COUNT
\echo ''
\echo '2. CONSTRAINT VERIFICATION'
\echo '--------------------------'
select 
    constraint_type,
    count(*) as count
from information_schema.table_constraints
where table_schema = 'public'
group by constraint_type
order by constraint_type;

-- 3. INDEX COUNT
\echo ''
\echo '3. INDEX VERIFICATION'
\echo '---------------------'
select count(*) as total_indexes
from pg_indexes
where schemaname = 'public';

-- 4. TRIGGER COUNT
\echo ''
\echo '4. TRIGGER VERIFICATION'
\echo '-----------------------'
select count(*) as total_triggers
from information_schema.triggers
where trigger_schema = 'public';

-- 5. FUNCTION COUNT
\echo ''
\echo '5. FUNCTION VERIFICATION'
\echo '------------------------'
select count(*) as total_functions
from information_schema.routines
where routine_schema = 'public' and routine_type = 'FUNCTION';

-- 6. VIEW COUNT
\echo ''
\echo '6. VIEW VERIFICATION'
\echo '--------------------'
select count(*) as total_views
from information_schema.views
where table_schema = 'public';

-- 7. DATA INTEGRITY
\echo ''
\echo '7. DATA INTEGRITY CHECK'
\echo '-----------------------'
select 
    'Orphan Records' as check_type,
    case when (
        select count(*) from public.shooters s 
        left join public.users u on s.user_id = u.id 
        where u.id is null
    ) = 0 then 'PASS' else 'FAIL' end as status;

-- 8. SUMMARY
\echo ''
\echo '=================================================='
\echo 'VERIFICATION COMPLETE'
\echo '=================================================='
```

### Expected Results Summary

| Check | Expected | Status |
|-------|----------|--------|
| Total Tables | 28 | ✓ |
| Primary Keys | 28 | ✓ |
| Foreign Keys | ~25 | ✓ |
| Unique Constraints | ~20 | ✓ |
| Check Constraints | ~30 | ✓ |
| Indexes | ~30 | ✓ |
| Triggers | ~19 | ✓ |
| Functions | ~2 | ✓ |
| Views | ~3 | ✓ |
| Data Integrity | No orphans | ✓ |

---

## Automated CI/CD Integration

### GitHub Actions Example

```yaml
name: Database Schema Verification

on:
  push:
    paths:
      - 'packages/database/**'

jobs:
  verify-schema:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_DB: para_shooting_test
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v4
      
      - name: Apply Schema
        run: |
          PGPASSWORD=test psql -h localhost -U test -d para_shooting_test \
            -f packages/database/schema.sql
      
      - name: Run Verification
        run: |
          PGPASSWORD=test psql -h localhost -U test -d para_shooting_test \
            -f packages/database/verify-schema.sql
```

---

## Troubleshooting

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Missing table | Migration not run | Run `schema.sql` again |
| Missing constraint | Constraint creation failed | Check for data violations |
| Missing index | Index creation timeout | Create index with `CONCURRENTLY` |
| Trigger not firing | Wrong trigger timing | Verify `BEFORE`/`AFTER` setting |
| Function not found | Function not created | Check function syntax |

### Recovery Commands

```sql
-- Recreate missing constraint
alter table public.users 
add constraint users_email_key unique (email);

-- Recreate missing index
create index concurrently idx_users_email 
on public.users(email);

-- Recreate trigger
create trigger update_users_updated_at 
before update on public.users
for each row execute function public.update_updated_at_column();
```

