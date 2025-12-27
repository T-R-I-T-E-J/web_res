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