-- Auto-generated Master Database Initialization Script
-- Generated: 2025-12-28
-- Source: docs/database/*.md and 02-refinements.sql
--
-- NOSONAR SUPPRESSIONS:
-- This file contains PostgreSQL DDL (Data Definition Language) for schema initialization.
-- The following SonarQube rules are suppressed as they are designed for PL/SQL procedural
-- code and do not apply to PostgreSQL DDL/DML:
--
-- plsql:S1192 - String literal duplication
--   - ENUM type definitions must explicitly list values; no constant sharing is possible
--   - INSERT statements must use actual data values
--   - Table/column names are referenced multiple times by design (foreign keys, indexes)
--
-- plsql:StringLiteralDuplication - Duplicate string literals
--   - Same rationale as S1192
--
-- plsql:IllegalCharacterInLiteral - Newline characters in string literals
--   - Multi-line text content in INSERT statements is intentional for readability
--   - PostgreSQL supports multi-line string literals
--
-- These patterns are correct and follow PostgreSQL best practices.
--
-- SONAR_ISSUE_OFF:plsql:S1192
-- SONAR_ISSUE_OFF:plsql:StringLiteralDuplication
-- SONAR_ISSUE_OFF:plsql:IllegalCharacterInLiteral
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;
-- Create ENUM types to avoid duplicated string literals
-- Note: Some values (e.g., 'pending', 'completed', 'cancelled') appear in multiple ENUMs.
-- This is intentional - each ENUM represents a different domain concept and PostgreSQL
-- ENUMs are strongly typed (values cannot be interchanged between different ENUM types).
-- NOSONAR: String literal duplication in ENUM definitions is required in PostgreSQL DDL.
-- Unlike procedural code, SQL DDL does not support constants that can be shared across
-- separate ENUM type definitions. Each ENUM must explicitly list its values.
create type public.event_type_enum as enum ('RIFLE', 'PISTOL', 'BOTH');
create type public.competition_status_enum as enum (
    'draft',
    'upcoming',
    'registration_open',
    'registration_closed',
    'ongoing',
    'completed',
    'cancelled'
);
create type public.competition_event_status_enum as enum (
    'scheduled',
    'ongoing',
    'qualification_complete',
    'final_ongoing',
    'completed',
    'cancelled'
);
create type public.entry_status_enum as enum (
    'pending',
    'confirmed',
    'waitlisted',
    'withdrawn',
    'disqualified',
    'dns',
    'dnf'
);
create type public.payment_status_enum as enum ('pending', 'paid', 'waived', 'refunded');
create type public.classification_status_enum as enum ('NEW', 'REVIEW', 'CONFIRMED', 'FIXED');
create type public.news_status_enum as enum (
    'draft',
    'pending_review',
    'published',
    'archived'
);
create type public.contact_status_enum as enum (
    'new',
    'in_progress',
    'responded',
    'closed',
    'spam'
);
create type public.membership_status_enum as enum (
    'pending',
    'active',
    'expired',
    'cancelled',
    'suspended'
);
create type public.transaction_status_enum as enum (
    'pending',
    'processing',
    'completed',
    'failed',
    'cancelled',
    'refunded',
    'partially_refunded'
);
create type public.refund_status_enum as enum ('pending', 'processing', 'completed', 'failed');
-- Block 1 ========================================
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
-- Block 2 ========================================
create table public.roles (
    id bigint generated always as identity primary key,
    name varchar(50) not null unique,
    display_name varchar(100) not null,
    description text,
    permissions jsonb not null default '{}',
    is_system boolean not null default false,
    parent_id bigint references public.roles(id),
    level integer not null default 0,
    created_at timestamptz not null default now()
);
comment on table public.roles is 'Role definitions for RBAC. System roles include: admin, shooter, coach, official.';
-- Block 3 ========================================
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
-- Block 4 ========================================
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
-- Block 5 ========================================
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
-- Block 6 ========================================
create table public.disability_categories (
    id bigint generated always as identity primary key,
    code varchar(10) not null unique,
    name varchar(100) not null,
    description text not null,
    event_type public.event_type_enum not null,
    min_impairment text,
    equipment_allowed jsonb,
    is_active boolean not null default true,
    created_at timestamptz not null default now()
);
comment on table public.disability_categories is 'World Para Shooting (WSPS) sport classification categories for para-athletes.';
-- Block 7 ========================================
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
-- Auto-generate Shooter ID (PSCI-XXXX)
create sequence public.shooter_id_seq start 1001;
create or replace function public.generate_shooter_id() returns trigger as $$ begin new.shooter_id := 'PSCI-' || nextval('public.shooter_id_seq');
return new;
end;
$$ language plpgsql;
create trigger set_shooter_id before
insert on public.shooters for each row
    when (new.shooter_id is null) execute function public.generate_shooter_id();
-- Block 8 ========================================
create table public.shooter_classifications (
    id bigint generated always as identity primary key,
    shooter_id bigint not null references public.shooters(id),
    disability_category_id bigint not null references public.disability_categories(id),
    classification_status public.classification_status_enum not null,
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
-- Block 9 ========================================
create table public.venues (
    id bigint generated always as identity primary key,
    name varchar(200) not null,
    code varchar(20) unique,
    address text not null,
    city varchar(100) not null,
    state varchar(100) not null,
    country varchar(100) not null default 'India',
    pin_code varchar(10),
    latitude decimal(10, 8),
    longitude decimal(11, 8),
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
-- Block 10 ========================================
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
-- Block 11 ========================================
create table public.shooting_events (
    id bigint generated always as identity primary key,
    event_category_id bigint not null references public.event_categories(id),
    name varchar(100) not null,
    code varchar(20) not null unique,
    distance varchar(20) not null,
    shots_qualification integer not null,
    shots_final integer,
    max_score_qualification decimal(7, 1) not null,
    max_score_final decimal(7, 1),
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
-- Block 12 ========================================
create table public.competitions (
    id bigint generated always as identity primary key,
    public_id uuid not null default gen_random_uuid() unique,
    name varchar(200) not null,
    code varchar(30) unique,
    competition_type varchar(30) not null check (
        competition_type in (
            'CHAMPIONSHIP',
            'WORLD_CUP',
            'GRAND_PRIX',
            'OPEN',
            'SELECTION_TRIAL',
            'LEAGUE'
        )
    ),
    level varchar(20) not null check (
        level in (
            'INTERNATIONAL',
            'NATIONAL',
            'STATE',
            'ZONAL',
            'CLUB'
        )
    ),
    venue_id bigint references public.venues(id),
    start_date date not null,
    end_date date not null,
    registration_opens timestamptz,
    registration_closes timestamptz,
    entry_fee decimal(10, 2) default 0,
    max_participants integer,
    description text,
    rules_document_url text,
    schedule_document_url text,
    status public.competition_status_enum not null default 'draft',
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
-- Block 13 ========================================
create table public.competition_events (
    id bigint generated always as identity primary key,
    competition_id bigint not null references public.competitions(id) on delete cascade,
    shooting_event_id bigint not null references public.shooting_events(id),
    scheduled_date date not null,
    scheduled_time time,
    qualification_end_time time,
    final_time time,
    max_entries integer,
    entry_fee_override decimal(10, 2),
    status public.competition_event_status_enum not null default 'scheduled',
    results_finalized_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    unique(competition_id, shooting_event_id)
);
comment on table public.competition_events is 'Individual shooting events within a competition with scheduling details.';
-- Block 14 ========================================
create table public.event_relays (
    id bigint generated always as identity primary key,
    competition_event_id bigint not null references public.competition_events(id) on delete cascade,
    relay_number integer not null check (relay_number > 0),
    scheduled_date date not null,
    start_time time not null,
    end_time time not null,
    reporting_time time,
    created_at timestamptz not null default now(),
    unique(competition_event_id, relay_number)
);
comment on table public.event_relays is 'Specific relays and time slots for competition events.';
-- Block 15 ========================================
create table public.competition_entries (
    id bigint generated always as identity primary key,
    public_id uuid not null default gen_random_uuid() unique,
    competition_event_id bigint not null references public.competition_events(id),
    event_relay_id bigint references public.event_relays(id),
    shooter_id bigint not null references public.shooters(id),
    bib_number varchar(10),
    firing_point varchar(10),
    entry_status public.entry_status_enum not null default 'pending',
    payment_status public.payment_status_enum not null default 'pending',
    payment_id bigint,
    entry_fee_paid decimal(10, 2),
    registered_at timestamptz not null default now(),
    confirmed_at timestamptz,
    withdrawn_at timestamptz,
    withdrawal_reason text,
    notes text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    unique(competition_event_id, shooter_id),
    unique(event_relay_id, firing_point)
);
comment on table public.competition_entries is 'Shooter registrations for competition events with payment and status tracking.';
-- Block 16 ========================================
create table public.scores (
    id bigint generated always as identity primary key,
    competition_entry_id bigint not null references public.competition_entries(id),
    stage varchar(20) not null check (stage in ('QUALIFICATION', 'FINAL', 'SHOOTOFF')),
    series_scores jsonb not null default '[]',
    inner_tens integer default 0,
    total_score decimal(7, 1) not null check (total_score >= 0),
    rank_in_stage integer,
    qualified_for_final boolean default false,
    is_record boolean default false,
    record_type varchar(30) check (
        record_type in (
            'WORLD_RECORD',
            'ASIAN_RECORD',
            'NATIONAL_RECORD',
            'COMPETITION_RECORD',
            'PERSONAL_BEST'
        )
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
-- Block 17 ========================================
create table public.rankings (
    id bigint generated always as identity primary key,
    shooter_id bigint not null references public.shooters(id),
    shooting_event_id bigint not null references public.shooting_events(id),
    ranking_type varchar(20) not null check (ranking_type in ('NATIONAL', 'WORLD', 'ASIAN')),
    rank integer not null check (rank > 0),
    previous_rank integer,
    ranking_points decimal(10, 2) not null default 0,
    best_score decimal(7, 1),
    competitions_counted integer default 0,
    last_competition_date date,
    valid_from date not null,
    valid_until date,
    is_current boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    unique(
        shooter_id,
        shooting_event_id,
        ranking_type,
        valid_from
    )
);
comment on table public.rankings is 'National and international rankings by event with historical tracking.';
-- Block 18 ========================================
create table public.membership_types (
    id bigint generated always as identity primary key,
    name varchar(50) not null unique,
    code varchar(20) not null unique,
    description text,
    duration_months integer,
    price decimal(10, 2) not null check (price >= 0),
    benefits jsonb default '[]',
    is_active boolean not null default true,
    created_at timestamptz not null default now()
);
comment on table public.membership_types is 'Membership type definitions with pricing and benefits.';
-- Block 19 ========================================
create table public.memberships (
    id bigint generated always as identity primary key,
    public_id uuid not null default gen_random_uuid() unique,
    user_id bigint not null references public.users(id),
    membership_type_id bigint not null references public.membership_types(id),
    membership_number varchar(30) unique,
    start_date date not null,
    end_date date,
    status public.membership_status_enum not null default 'pending',
    amount_paid decimal(10, 2) not null,
    payment_id bigint,
    approved_by bigint references public.users(id),
    approved_at timestamptz,
    notes text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);
comment on table public.memberships is 'User membership records with status and payment tracking.';
-- Block 20 ========================================
create table public.payments (
    id bigint generated always as identity primary key,
    public_id uuid not null default gen_random_uuid() unique,
    user_id bigint not null references public.users(id) on delete restrict,
    payment_type varchar(30) not null check (
        payment_type in (
            'MEMBERSHIP',
            'ENTRY_FEE',
            'FINE',
            'DONATION',
            'OTHER'
        )
    ),
    amount decimal(10, 2) not null check (amount > 0),
    currency varchar(3) not null default 'INR',
    status public.transaction_status_enum not null default 'pending',
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
-- Block 21 ========================================
create table public.refunds (
    id bigint generated always as identity primary key,
    payment_id bigint not null references public.payments(id),
    amount decimal(10, 2) not null check (amount > 0),
    status public.refund_status_enum not null default 'pending',
    razorpay_refund_id varchar(50) unique,
    reason text not null,
    initiated_by bigint not null references public.users(id),
    processed_at timestamptz,
    notes text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);
comment on table public.refunds is 'Refund records for payment reversals with Razorpay integration.';
-- Block 22 ========================================
create table public.news_articles (
    id bigint generated always as identity primary key,
    public_id uuid not null default gen_random_uuid() unique,
    title varchar(255) not null,
    slug varchar(255) not null unique,
    excerpt text,
    content text not null,
    featured_image_url text,
    category varchar(50) not null check (
        category in (
            'NEWS',
            'ANNOUNCEMENT',
            'RESULT',
            'ACHIEVEMENT',
            'EVENT',
            'PRESS_RELEASE'
        )
    ),
    tags jsonb default '[]',
    author_id bigint not null references public.users(id),
    status public.news_status_enum not null default 'draft',
    is_featured boolean default false,
    is_pinned boolean default false,
    view_count integer default 0,
    published_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    deleted_at timestamptz
);
comment on table public.news_articles is 'News articles, announcements, and press releases for the public website.';
-- Block 23 ========================================
create table public.notifications (
    id bigint generated always as identity primary key,
    user_id bigint not null references public.users(id) on delete cascade,
    type varchar(50) not null check (
        type in (
            'SYSTEM',
            'COMPETITION',
            'PAYMENT',
            'RESULT',
            'MEMBERSHIP',
            'REMINDER',
            'ALERT'
        )
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
-- Block 24 ========================================
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
-- Block 25 ========================================
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
-- Block 26 ========================================
create table public.contact_messages (
    id bigint generated always as identity primary key,
    name varchar(200) not null,
    email varchar(255) not null,
    phone varchar(20),
    subject varchar(255) not null,
    message text not null,
    category varchar(50),
    status public.contact_status_enum default 'new',
    assigned_to bigint references public.users(id),
    response text,
    responded_at timestamptz,
    responded_by bigint references public.users(id),
    ip_address inet,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);
comment on table public.contact_messages is 'Contact form submissions from the public website.';
-- Block 27 ========================================
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
        committee_type in (
            'EXECUTIVE',
            'TECHNICAL',
            'SELECTION',
            'DISCIPLINARY',
            'FINANCE'
        )
    ),
    sort_order integer default 0,
    is_active boolean default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);
comment on table public.committee_members is 'Executive and technical committee member profiles for the About Us page.';
-- Block 28 ========================================
create table public.audit_logs (
    id bigint generated always as identity primary key,
    user_id bigint references public.users(id),
    action varchar(50) not null check (
        action in (
            'CREATE',
            'UPDATE',
            'DELETE',
            'LOGIN',
            'LOGOUT',
            'PASSWORD_CHANGE',
            'ROLE_CHANGE',
            'EXPORT',
            'BULK_UPDATE'
        )
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
-- Block 29 ========================================
create table public.scheduled_jobs (
    id bigint generated always as identity primary key,
    job_name varchar(100) not null unique,
    job_type varchar(50) not null check (
        job_type in (
            'CLEANUP',
            'RANKING_UPDATE',
            'EMAIL_DIGEST',
            'BACKUP',
            'REPORT',
            'SYNC'
        )
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
-- Block 30 ========================================
-- Users
create index idx_users_email on public.users(email);
create index idx_users_public_id on public.users(public_id);
create index idx_users_deleted_at on public.users(deleted_at)
where deleted_at is null;
-- Shooters
create index idx_shooters_user_id on public.shooters(user_id);
create index idx_shooters_shooter_id on public.shooters(shooter_id);
create index idx_shooters_state_association on public.shooters(state_association_id);
-- Shooter Classifications
create index idx_shooter_classifications_shooter on public.shooter_classifications(shooter_id);
create index idx_shooter_classifications_current on public.shooter_classifications(shooter_id, is_current)
where is_current = true;
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
create index idx_rankings_current on public.rankings(is_current)
where is_current = true;
-- Payments
create index idx_payments_user on public.payments(user_id);
create index idx_payments_status on public.payments(status);
create index idx_payments_razorpay_order on public.payments(razorpay_order_id);
-- Memberships
create index idx_memberships_user on public.memberships(user_id);
create index idx_memberships_status on public.memberships(status);
-- News Articles
create index idx_news_articles_status on public.news_articles(status);
create index idx_news_articles_published on public.news_articles(published_at)
where status = 'published';
create index idx_news_articles_slug on public.news_articles(slug);
-- Notifications
create index idx_notifications_user_unread on public.notifications(user_id, is_read)
where is_read = false;
-- Audit Logs
create index idx_audit_logs_user on public.audit_logs(user_id);
create index idx_audit_logs_table_record on public.audit_logs(table_name, record_id);
create index idx_audit_logs_created on public.audit_logs(created_at);
-- Block 31 ========================================
-- Function to update updated_at timestamp
create or replace function public.update_updated_at_column() returns trigger as $$ begin new.updated_at = now();
return new;
end;
$$ language plpgsql;
-- Apply to all tables with updated_at
create trigger update_users_updated_at before
update on public.users for each row execute function public.update_updated_at_column();
create trigger update_shooters_updated_at before
update on public.shooters for each row execute function public.update_updated_at_column();
create trigger update_competitions_updated_at before
update on public.competitions for each row execute function public.update_updated_at_column();
-- ... (apply to all tables with updated_at column)
-- Apply Audit Log Triggers
create trigger audit_users_changes
after
insert
    or
update
    or delete on public.users for each row execute function public.audit_log_changes();
create trigger audit_shooters_changes
after
insert
    or
update
    or delete on public.shooters for each row execute function public.audit_log_changes();
create trigger audit_competitions_changes
after
insert
    or
update
    or delete on public.competitions for each row execute function public.audit_log_changes();
create trigger audit_payments_changes
after
insert
    or
update
    or delete on public.payments for each row execute function public.audit_log_changes();
create trigger audit_scores_changes
after
insert
    or
update
    or delete on public.scores for each row execute function public.audit_log_changes();
-- Block 32 ========================================
-- Function to create audit log entries
create or replace function public.audit_log_changes() returns trigger as $$ begin if (tg_op = 'DELETE') then
insert into public.audit_logs (action, table_name, record_id, old_values)
values ('DELETE', tg_table_name, old.id, to_jsonb(old));
return old;
elsif (tg_op = 'UPDATE') then
insert into public.audit_logs (
        action,
        table_name,
        record_id,
        old_values,
        new_values
    )
values (
        'UPDATE',
        tg_table_name,
        new.id,
        to_jsonb(old),
        to_jsonb(new)
    );
return new;
elsif (tg_op = 'INSERT') then
insert into public.audit_logs (action, table_name, record_id, new_values)
values ('CREATE', tg_table_name, new.id, to_jsonb(new));
return new;
end if;
return null;
end;
$$ language plpgsql;
-- Block 33 ========================================
create or replace view public.v_active_shooters as
select s.id,
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
    left join public.shooter_classifications sc on s.id = sc.shooter_id
    and sc.is_current = true
    left join public.disability_categories dc on sc.disability_category_id = dc.id
where u.is_active = true
    and u.deleted_at is null;
comment on view public.v_active_shooters is 'Active shooters with their current classification and state association.';
-- Block 34 ========================================
create or replace view public.v_upcoming_competitions as
select c.id,
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
group by c.id,
    v.name,
    v.city,
    v.state
order by c.start_date;
comment on view public.v_upcoming_competitions is 'Upcoming competitions with venue and event count.';
-- Block 35 ========================================
create or replace view public.v_current_rankings as
select r.id,
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
order by r.ranking_type,
    se.code,
    r.rank;
comment on view public.v_current_rankings is 'Current rankings with rank change indicators.';
-- Block 36 ========================================
create index idx_audit_logs_user on audit_logs(user_id);
create index idx_audit_logs_table_record on audit_logs(table_name, record_id);
create index idx_audit_logs_action on audit_logs(action);
create index idx_audit_logs_created on audit_logs(created_at);
create index idx_audit_logs_request on audit_logs(request_id);
-- Block 37 ========================================
-- Audit trigger function
create or replace function audit_log_trigger() returns trigger as $$
declare audit_user_id bigint;
audit_ip inet;
audit_request_id uuid;
begin -- Get context from session variables (set by application)
audit_user_id := nullif(current_setting('app.current_user_id', true), '')::bigint;
audit_ip := nullif(current_setting('app.client_ip', true), '')::inet;
audit_request_id := nullif(current_setting('app.request_id', true), '')::uuid;
if (tg_op = 'DELETE') then
insert into audit_logs (
        user_id,
        action,
        table_name,
        record_id,
        old_values,
        ip_address,
        request_id
    )
values (
        audit_user_id,
        'DELETE',
        tg_table_name,
        old.id,
        to_jsonb(old),
        audit_ip,
        audit_request_id
    );
return old;
elsif (tg_op = 'UPDATE') then -- Only log if values actually changed
if to_jsonb(old) is distinct
from to_jsonb(new) then
insert into audit_logs (
        user_id,
        action,
        table_name,
        record_id,
        old_values,
        new_values,
        ip_address,
        request_id
    )
values (
        audit_user_id,
        'UPDATE',
        tg_table_name,
        new.id,
        to_jsonb(old),
        to_jsonb(new),
        audit_ip,
        audit_request_id
    );
end if;
return new;
elsif (tg_op = 'INSERT') then
insert into audit_logs (
        user_id,
        action,
        table_name,
        record_id,
        new_values,
        ip_address,
        request_id
    )
values (
        audit_user_id,
        'CREATE',
        tg_table_name,
        new.id,
        to_jsonb(new),
        audit_ip,
        audit_request_id
    );
return new;
end if;
return null;
end;
$$ language plpgsql;
-- Apply to tables
create trigger audit_users
after
insert
    or
update
    or delete on users for each row execute function audit_log_trigger();
create trigger audit_shooters
after
insert
    or
update
    or delete on shooters for each row execute function audit_log_trigger();
create trigger audit_scores
after
insert
    or
update
    or delete on scores for each row execute function audit_log_trigger();
create trigger audit_payments
after
insert
    or
update
    or delete on payments for each row execute function audit_log_trigger();
-- Block 38 ========================================
-- Export all audit logs for a user (GDPR request)
select created_at,
    action,
    table_name,
    record_id,
    ip_address,
    -- Exclude sensitive new_values/old_values
    case
        when action = 'LOGIN' then new_values
        else null
    end as details
from audit_logs
where user_id = $1
order by created_at desc;
-- Block 39 ========================================
-- Anonymize user in audit logs (Right to Erasure)
update audit_logs
set ip_address = null,
    user_agent = null,
    old_values = old_values - 'email' - 'phone' - 'firstName' - 'lastName',
    new_values = new_values - 'email' - 'phone' - 'firstName' - 'lastName'
where user_id = $1;
-- Note: Keep the audit record but remove PII;
-- Block 40 ========================================
-- Who modified this score and when?
select al.created_at,
    al.action,
    u.email as modified_by,
    al.old_values->>'total_score' as old_score,
    al.new_values->>'total_score' as new_score,
    al.ip_address
from audit_logs al
    left join users u on al.user_id = u.id
where al.table_name = 'scores'
    and al.record_id = 12345
order by al.created_at desc;
-- Block 41 ========================================
-- All actions by a user in the last 24 hours
select created_at,
    action,
    table_name,
    record_id,
    ip_address
from audit_logs
where user_id = $1
    and created_at >= now() - interval '24 hours'
order by created_at desc;
-- Block 42 ========================================
-- Failed login attempts from suspicious IPs
select ip_address,
    count(*) as attempts,
    min(created_at) as first_attempt,
    max(created_at) as last_attempt
from audit_logs
where action = 'LOGIN'
    and new_values->>'success' = 'false'
    and created_at >= now() - interval '1 hour'
group by ip_address
having count(*) >= 5
order by attempts desc;
-- Block 43 ========================================
-- Daily change summary by table
select date(created_at) as date,
    table_name,
    action,
    count(*) as count
from audit_logs
where created_at >= current_date - interval '7 days'
group by date(created_at),
    table_name,
    action
order by date desc,
    table_name,
    action;
-- Block 44 ========================================
-- Archive old audit logs to cold storage
create table audit_logs_archive (like audit_logs including all);
-- Move records older than 2 years to archive
insert into audit_logs_archive
select *
from audit_logs
where created_at < now() - interval '2 years'
    and table_name not in ('payments', 'refunds', 'scores');
-- Delete archived records from main table
delete from audit_logs
where created_at < now() - interval '2 years'
    and table_name not in ('payments', 'refunds', 'scores');
-- Vacuum to reclaim space
vacuum analyze audit_logs;
-- Block 45 ========================================
-- Migration: 02-refinements.sql
-- Description: Applies schema review improvements (Shooter ID, Event Relays, Constraints)
-- Author: Antigravity
-- Date: 2025-12-27
BEGIN;
-- 1. Shooter ID Auto-Generation
CREATE SEQUENCE IF NOT EXISTS public.shooter_id_seq START 1001;
CREATE OR REPLACE FUNCTION public.generate_shooter_id() RETURNS TRIGGER AS $$ BEGIN NEW.shooter_id := 'PSCI-' || nextval('public.shooter_id_seq');
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS set_shooter_id ON public.shooters;
CREATE TRIGGER set_shooter_id BEFORE
INSERT ON public.shooters FOR EACH ROW
    WHEN (NEW.shooter_id IS NULL) EXECUTE FUNCTION public.generate_shooter_id();
-- 2. Event Relays Normalization
CREATE TABLE IF NOT EXISTS public.event_relays (
    id bigint generated always as identity primary key,
    competition_event_id bigint not null references public.competition_events(id) on delete cascade,
    relay_number integer not null check (relay_number > 0),
    scheduled_date date not null,
    start_time time not null,
    end_time time not null,
    reporting_time time,
    created_at timestamptz not null default now(),
    unique(competition_event_id, relay_number)
);
COMMENT ON TABLE public.event_relays IS 'Specific relays and time slots for competition events.';
-- 3. Update Competition Entries to use Event Relays
-- Note: This assumes we are migrating a schema where these columns might need adjustment.
-- Since this is a Setup script for a new DB, we assume the table might be dropped/recreated or altered.
-- Here we provide ALTER statements for an existing table case:
ALTER TABLE public.competition_entries
ADD COLUMN IF NOT EXISTS event_relay_id bigint REFERENCES public.event_relays(id);
-- If data exists, one would need to migrate relay_number to event_relays first.
-- For now, we drop the old column if it exists and no data is lost (Development Phase):
ALTER TABLE public.competition_entries DROP COLUMN IF EXISTS relay_number;
-- 4. Apply Strict Constraints
ALTER TABLE public.competition_entries DROP CONSTRAINT IF EXISTS competition_entries_competition_event_id_relay_number_firin_key;
-- specific name might vary
-- Add the new constraint (Event Relay + Firing Point must be unique)
ALTER TABLE public.competition_entries
ADD CONSTRAINT uq_entry_relay_point UNIQUE (event_relay_id, firing_point);
-- 5. Safety: Prevent Deleting Users with Payments
ALTER TABLE public.payments DROP CONSTRAINT IF EXISTS payments_user_id_fkey,
    ADD CONSTRAINT payments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE RESTRICT;
-- 6. Audit Triggers (Ensure they are applied)
DROP TRIGGER IF EXISTS audit_users_changes ON public.users;
CREATE TRIGGER audit_users_changes
AFTER
INSERT
    OR
UPDATE
    OR DELETE ON public.users FOR EACH ROW EXECUTE FUNCTION public.audit_log_changes();
DROP TRIGGER IF EXISTS audit_shooters_changes ON public.shooters;
CREATE TRIGGER audit_shooters_changes
AFTER
INSERT
    OR
UPDATE
    OR DELETE ON public.shooters FOR EACH ROW EXECUTE FUNCTION public.audit_log_changes();
DROP TRIGGER IF EXISTS audit_competitions_changes ON public.competitions;
CREATE TRIGGER audit_competitions_changes
AFTER
INSERT
    OR
UPDATE
    OR DELETE ON public.competitions FOR EACH ROW EXECUTE FUNCTION public.audit_log_changes();
DROP TRIGGER IF EXISTS audit_payments_changes ON public.payments;
CREATE TRIGGER audit_payments_changes
AFTER
INSERT
    OR
UPDATE
    OR DELETE ON public.payments FOR EACH ROW EXECUTE FUNCTION public.audit_log_changes();
DROP TRIGGER IF EXISTS audit_scores_changes ON public.scores;
CREATE TRIGGER audit_scores_changes
AFTER
INSERT
    OR
UPDATE
    OR DELETE ON public.scores FOR EACH ROW EXECUTE FUNCTION public.audit_log_changes();
COMMIT;
-- Block 46 ========================================
-- Roles seed data
insert into public.roles (
        name,
        display_name,
        description,
        permissions,
        is_system
    )
values (
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
-- Block 47 ========================================
-- Disability categories (WSPS classification) seed data
insert into public.disability_categories (
        code,
        name,
        description,
        event_type,
        min_impairment,
        equipment_allowed,
        is_active
    )
values (
        'SH1',
        'SH1 - Pistol/Rifle',
        'Athletes with impairment in legs and/or shooting arm, but with sufficient arm function to support a firearm independently without a shooting stand. Includes athletes with paralysis, limb deficiency, or other physical impairments affecting lower body mobility.',
        'BOTH'::public.event_type_enum,
        'Loss of muscle strength, limb deficiency, impaired passive range of movement, or leg length difference',
        '{"shooting_stand": false, "orthosis": true, "wheelchair": true, "back_support": true}'::jsonb,
        true
    ),
    (
        'SH2',
        'SH2 - Rifle',
        'Athletes with impairment affecting upper limbs who require a shooting stand to support the weight of the rifle. Includes athletes with significant upper body impairments that prevent them from holding a rifle unsupported.',
        'RIFLE'::public.event_type_enum,
        'Upper limb deficiency, impaired muscle power in arms, or coordination impairment affecting rifle handling',
        '{"shooting_stand": true, "orthosis": true, "wheelchair": true, "mouth_stick": true}'::jsonb,
        true
    ),
    (
        'VI1',
        'VI1 - Visually Impaired (B1)',
        'Athletes who are totally blind - from no light perception in either eye to some light perception but inability to recognize the shape of a hand at any distance or in any direction. Uses audio sighting equipment.',
        'RIFLE'::public.event_type_enum,
        'No light perception (NLP) to light perception only - cannot recognize hand shape at any distance',
        '{"audio_sighting": true, "shooting_stand": true, "guide": true, "tactile_markers": true}'::jsonb,
        true
    ),
    (
        'VI2',
        'VI2 - Visually Impaired (B2)',
        'Athletes with severe visual impairment - able to recognize the shape of a hand but with visual acuity of 2/60 or less, or visual field of less than 5 degrees. Uses audio sighting equipment.',
        'RIFLE'::public.event_type_enum,
        'Visual acuity ≤ 2/60 and/or visual field < 5 degrees',
        '{"audio_sighting": true, "shooting_stand": true, "guide": true, "magnification": false}'::jsonb,
        true
    ),
    (
        'VI3',
        'VI3 - Visually Impaired (B3)',
        'Athletes with moderate visual impairment - visual acuity ranging from 2/60 to 6/60, or visual field of 5 to 20 degrees. Uses audio sighting equipment.',
        'RIFLE'::public.event_type_enum,
        'Visual acuity 2/60 to 6/60 and/or visual field 5-20 degrees',
        '{"audio_sighting": true, "shooting_stand": true, "guide": true, "magnification": false}'::jsonb,
        true
    );
-- Block 48 ========================================
-- Event categories seed data
insert into public.event_categories (
        name,
        code,
        description,
        icon_url,
        sort_order,
        is_active
    )
values (
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
-- Block 49 ========================================
-- Shooting events seed data
insert into public.shooting_events (
        event_category_id,
        name,
        code,
        distance,
        shots_qualification,
        shots_final,
        max_score_qualification,
        max_score_final,
        time_limit_minutes,
        gender,
        disability_categories,
        is_paralympic,
        is_wsps,
        is_active
    )
values -- Rifle Events (SH1)
    (
        (
            select id
            from public.event_categories
            where code = 'R'
        ),
        '10m Air Rifle Standing SH1',
        'R1',
        '10m',
        60,
        24,
        654.5,
        261.2,
        75,
        null,
        '["SH1"]'::jsonb,
        true,
        true,
        true
    ),
    (
        (
            select id
            from public.event_categories
            where code = 'R'
        ),
        '10m Air Rifle Prone SH1',
        'R2',
        '10m',
        60,
        24,
        654.5,
        261.2,
        50,
        null,
        '["SH1"]'::jsonb,
        true,
        true,
        true
    ),
    -- Rifle Events (SH2)
    (
        (
            select id
            from public.event_categories
            where code = 'R'
        ),
        '10m Air Rifle Prone SH2',
        'R3',
        '10m',
        60,
        24,
        654.5,
        261.2,
        50,
        null,
        '["SH2"]'::jsonb,
        true,
        true,
        true
    ),
    (
        (
            select id
            from public.event_categories
            where code = 'R'
        ),
        '10m Air Rifle Standing SH2',
        'R4',
        '10m',
        60,
        24,
        654.5,
        261.2,
        75,
        null,
        '["SH2"]'::jsonb,
        true,
        true,
        true
    ),
    (
        (
            select id
            from public.event_categories
            where code = 'R'
        ),
        '10m Air Rifle Prone Mixed SH2',
        'R5',
        '10m',
        60,
        24,
        654.5,
        261.2,
        50,
        'mixed',
        '["SH2"]'::jsonb,
        true,
        true,
        true
    ),
    -- 50m Rifle Events
    (
        (
            select id
            from public.event_categories
            where code = 'R'
        ),
        '50m Rifle Prone SH1',
        'R6',
        '50m',
        60,
        null,
        654.5,
        null,
        75,
        null,
        '["SH1"]'::jsonb,
        false,
        true,
        true
    ),
    (
        (
            select id
            from public.event_categories
            where code = 'R'
        ),
        '50m Rifle 3 Positions SH1',
        'R7',
        '50m',
        120,
        null,
        1185.5,
        null,
        150,
        null,
        '["SH1"]'::jsonb,
        false,
        true,
        true
    ),
    -- Visually Impaired Events
    (
        (
            select id
            from public.event_categories
            where code = 'R'
        ),
        '10m Air Rifle Standing VI',
        'R8',
        '10m',
        60,
        24,
        654.5,
        261.2,
        75,
        null,
        '["VI1", "VI2", "VI3"]'::jsonb,
        false,
        true,
        true
    ),
    -- Pistol Events
    (
        (
            select id
            from public.event_categories
            where code = 'P'
        ),
        '10m Air Pistol SH1',
        'P1',
        '10m',
        60,
        24,
        246.1,
        246.1,
        75,
        null,
        '["SH1"]'::jsonb,
        true,
        true,
        true
    ),
    (
        (
            select id
            from public.event_categories
            where code = 'P'
        ),
        '25m Pistol SH1',
        'P2',
        '25m',
        60,
        null,
        594.0,
        null,
        null,
        null,
        '["SH1"]'::jsonb,
        true,
        true,
        true
    ),
    (
        (
            select id
            from public.event_categories
            where code = 'P'
        ),
        '25m Pistol Mixed SH1',
        'P3',
        '25m',
        60,
        null,
        594.0,
        null,
        null,
        'mixed',
        '["SH1"]'::jsonb,
        false,
        true,
        true
    ),
    (
        (
            select id
            from public.event_categories
            where code = 'P'
        ),
        '50m Pistol SH1',
        'P4',
        '50m',
        60,
        null,
        580.0,
        null,
        90,
        null,
        '["SH1"]'::jsonb,
        false,
        true,
        true
    );
-- Block 50 ========================================
-- State associations seed data
insert into public.state_associations (code, name, state, is_active)
values (
        'AN',
        'Andaman & Nicobar Rifle Association',
        'Andaman & Nicobar Islands',
        true
    ),
    (
        'AP',
        'Andhra Pradesh State Rifle Association',
        'Andhra Pradesh',
        true
    ),
    (
        'AR',
        'Arunachal Pradesh Rifle Association',
        'Arunachal Pradesh',
        true
    ),
    (
        'AS',
        'Assam State Rifle Association',
        'Assam',
        true
    ),
    (
        'BR',
        'Bihar State Rifle Association',
        'Bihar',
        true
    ),
    (
        'CG',
        'Chhattisgarh State Rifle Association',
        'Chhattisgarh',
        true
    ),
    (
        'CH',
        'Chandigarh State Rifle Association',
        'Chandigarh',
        true
    ),
    (
        'DD',
        'Dadra & Nagar Haveli Rifle Association',
        'Dadra & Nagar Haveli',
        true
    ),
    (
        'DL',
        'Delhi State Rifle Association',
        'Delhi',
        true
    ),
    ('GA', 'Goa State Rifle Association', 'Goa', true),
    (
        'GJ',
        'Gujarat State Rifle Association',
        'Gujarat',
        true
    ),
    (
        'HP',
        'Himachal Pradesh State Rifle Association',
        'Himachal Pradesh',
        true
    ),
    (
        'HR',
        'Haryana State Rifle Association',
        'Haryana',
        true
    ),
    (
        'JH',
        'Jharkhand State Rifle Association',
        'Jharkhand',
        true
    ),
    (
        'JK',
        'Jammu & Kashmir State Rifle Association',
        'Jammu & Kashmir',
        true
    ),
    (
        'KA',
        'Karnataka State Rifle Association',
        'Karnataka',
        true
    ),
    (
        'KL',
        'Kerala State Rifle Association',
        'Kerala',
        true
    ),
    ('LA', 'Ladakh Rifle Association', 'Ladakh', true),
    (
        'MH',
        'Maharashtra State Rifle Association',
        'Maharashtra',
        true
    ),
    (
        'ML',
        'Meghalaya State Rifle Association',
        'Meghalaya',
        true
    ),
    (
        'MN',
        'Manipur State Rifle Association',
        'Manipur',
        true
    ),
    (
        'MP',
        'Madhya Pradesh State Rifle Association',
        'Madhya Pradesh',
        true
    ),
    (
        'MZ',
        'Mizoram State Rifle Association',
        'Mizoram',
        true
    ),
    (
        'NL',
        'Nagaland State Rifle Association',
        'Nagaland',
        true
    ),
    (
        'OD',
        'Odisha State Rifle Association',
        'Odisha',
        true
    ),
    (
        'PB',
        'Punjab State Rifle Association',
        'Punjab',
        true
    ),
    (
        'PY',
        'Puducherry Rifle Association',
        'Puducherry',
        true
    ),
    (
        'RJ',
        'Rajasthan State Rifle Association',
        'Rajasthan',
        true
    ),
    (
        'SK',
        'Sikkim State Rifle Association',
        'Sikkim',
        true
    ),
    (
        'TN',
        'Tamil Nadu State Rifle Association',
        'Tamil Nadu',
        true
    ),
    (
        'TS',
        'Telangana State Rifle Association',
        'Telangana',
        true
    ),
    (
        'TR',
        'Tripura State Rifle Association',
        'Tripura',
        true
    ),
    (
        'UK',
        'Uttarakhand State Rifle Association',
        'Uttarakhand',
        true
    ),
    (
        'UP',
        'Uttar Pradesh State Rifle Association',
        'Uttar Pradesh',
        true
    ),
    (
        'WB',
        'West Bengal State Rifle Association',
        'West Bengal',
        true
    );
-- Block 51 ========================================
-- Membership types seed data
insert into public.membership_types (
        name,
        code,
        description,
        duration_months,
        price,
        benefits,
        is_active
    )
values (
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
-- Block 52 ========================================
-- Document categories seed data
insert into public.document_categories (
        name,
        slug,
        description,
        icon,
        sort_order,
        is_active
    )
values (
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
-- Block 53 ========================================
-- Scheduled jobs seed data
insert into public.scheduled_jobs (
        job_name,
        job_type,
        schedule,
        is_enabled,
        metadata
    )
values (
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
-- Block 54 ========================================
-- Para Shooting Database Seed Script
-- Execute in order after schema creation
\ echo 'Starting seed data population...' -- 1. Roles (no dependencies)
\ echo 'Seeding roles...' \ i seed / 01_roles.sql -- 2. Disability categories (no dependencies)
\ echo 'Seeding disability categories...' \ i seed / 02_disability_categories.sql -- 3. Event categories (no dependencies)
\ echo 'Seeding event categories...' \ i seed / 03_event_categories.sql -- 4. Shooting events (depends on event_categories)
\ echo 'Seeding shooting events...' \ i seed / 04_shooting_events.sql -- 5. State associations (no dependencies)
\ echo 'Seeding state associations...' \ i seed / 05_state_associations.sql -- 6. Membership types (no dependencies)
\ echo 'Seeding membership types...' \ i seed / 06_membership_types.sql -- 7. Document categories (no dependencies)
\ echo 'Seeding document categories...' \ i seed / 07_document_categories.sql -- 8. Scheduled jobs (no dependencies)
\ echo 'Seeding scheduled jobs...' \ i seed / 08_scheduled_jobs.sql \ echo 'Seed data population complete!' -- Verify seed counts
select 'roles' as table_name,
    count(*) as row_count
from public.roles
union all
select 'disability_categories',
    count(*)
from public.disability_categories
union all
select 'event_categories',
    count(*)
from public.event_categories
union all
select 'shooting_events',
    count(*)
from public.shooting_events
union all
select 'state_associations',
    count(*)
from public.state_associations
union all
select 'membership_types',
    count(*)
from public.membership_types
union all
select 'document_categories',
    count(*)
from public.document_categories
union all
select 'scheduled_jobs',
    count(*)
from public.scheduled_jobs;