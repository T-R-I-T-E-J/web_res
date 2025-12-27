-- Auto-generated from documentation
-- Para Shooting Committee of India Platform
-- Database: PostgreSQL 16+
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
    status varchar(20) not null default 'draft' check (
        status in (
            'draft',
            'upcoming',
            'registration_open',
            'registration_closed',
            'ongoing',
            'completed',
            'cancelled'
        )
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
    status varchar(20) not null default 'scheduled' check (
        status in (
            'scheduled',
            'ongoing',
            'qualification_complete',
            'final_ongoing',
            'completed',
            'cancelled'
        )
    ),
    results_finalized_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    unique(competition_id, shooting_event_id)
);
comment on table public.competition_events is 'Individual shooting events within a competition with scheduling details.';
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
create table public.competition_entries (
    id bigint generated always as identity primary key,
    public_id uuid not null default gen_random_uuid() unique,
    competition_event_id bigint not null references public.competition_events(id),
    event_relay_id bigint references public.event_relays(id),
    shooter_id bigint not null references public.shooters(id),
    bib_number varchar(10),
    firing_point varchar(10),
    entry_status varchar(20) not null default 'pending' check (
        entry_status in (
            'pending',
            'confirmed',
            'waitlisted',
            'withdrawn',
            'disqualified',
            'dns',
            'dnf'
        )
    ),
    payment_status varchar(20) not null default 'pending' check (
        payment_status in ('pending', 'paid', 'waived', 'refunded')
    ),
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
create table public.memberships (
    id bigint generated always as identity primary key,
    public_id uuid not null default gen_random_uuid() unique,
    user_id bigint not null references public.users(id),
    membership_type_id bigint not null references public.membership_types(id),
    membership_number varchar(30) unique,
    start_date date not null,
    end_date date,
    status varchar(20) not null default 'pending' check (
        status in (
            'pending',
            'active',
            'expired',
            'cancelled',
            'suspended'
        )
    ),
    amount_paid decimal(10, 2) not null,
    payment_id bigint,
    approved_by bigint references public.users(id),
    approved_at timestamptz,
    notes text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);
comment on table public.memberships is 'User membership records with status and payment tracking.';
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
    status varchar(20) not null default 'pending' check (
        status in (
            'pending',
            'processing',
            'completed',
            'failed',
            'cancelled',
            'refunded',
            'partially_refunded'
        )
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
create table public.refunds (
    id bigint generated always as identity primary key,
    payment_id bigint not null references public.payments(id),
    amount decimal(10, 2) not null check (amount > 0),
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
    status varchar(20) not null default 'draft' check (
        status in (
            'draft',
            'pending_review',
            'published',
            'archived'
        )
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
create table public.contact_messages (
    id bigint generated always as identity primary key,
    name varchar(200) not null,
    email varchar(255) not null,
    phone varchar(20),
    subject varchar(255) not null,
    message text not null,
    category varchar(50),
    status varchar(20) default 'new' check (
        status in (
            'new',
            'in_progress',
            'responded',
            'closed',
            'spam'
        )
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