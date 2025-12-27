# Database Schema Requirements Questionnaire

> **Para Shooting Committee of India Platform**  
> **Purpose:** Gather business requirements to finalize database schema  
> **Reviewer:** Senior Database Architect  
> **Date:** 2025-12-27  
> **Status:** 🟡 AWAITING RESPONSES

---

## 📋 Instructions

**For each question:**

1. ✅ Mark your answer clearly
2. 📝 Provide additional context where needed
3. ⚠️ Flag any uncertainties with "TBD" or "DISCUSS"
4. 🔴 Questions marked **BLOCKER** must be answered first

**Priority Legend:**

- 🔴 **BLOCKER** - Affects core data model, must answer immediately
- 🟡 **HIGH** - Impacts business logic and security
- 🟢 **MEDIUM** - Needed for optimization and compliance

---

## 🎯 SECTION A: Business Rules & Data Lifecycle

### **A1. Shooters & Classifications**

#### Q1. Shooter ID Generation 🔴 **BLOCKER**

**Current State:** Auto-generated as `PSCI-1001`, `PSCI-1002`, etc.

**Question:** Should `shooter_id` be:

- [ ] Always auto-generated (recommended)
- [ ] Editable by admins for legacy data import
- [ ] Manual entry allowed during registration

**If editable:** What validation rules? (e.g., must start with "PSCI-", must be unique)

**Your Answer:**

```
[FILL IN]
```

---

#### Q2. Multiple Classifications 🟡 **HIGH**

**Question:** Can a single shooter hold multiple **current** (`is_current = true`) classifications simultaneously?

**Scenario Examples:**

- Shooter has SH1 classification for Rifle events AND SH2 for Pistol events
- Shooter participates in both RIFLE and PISTOL categories

**Your Answer:**

- [ ] Yes, multiple current classifications allowed (one per event category)
- [ ] No, only ONE current classification at a time
- [ ] Other: ******\_\_\_******

**If YES:** Should we add a unique constraint on `(shooter_id, disability_category_id, is_current)` where `is_current = true`?

**Your Answer:**

```
[FILL IN]
```

---

#### Q3. Classification Expiry 🟢 **MEDIUM**

**Question:** What should happen when `shooter_classifications.valid_until` date passes?

**Your Answer:**

- [ ] Auto-update `is_current = false` via scheduled job
- [ ] Send notification to shooter/admin, manual review required
- [ ] No automatic action, classifications remain valid until manually updated
- [ ] Other: ******\_\_\_******

**Notification Timing:**

- [ ] 30 days before expiry
- [ ] 7 days before expiry
- [ ] On expiry date
- [ ] Other: ******\_\_\_******

---

#### Q4. Profile Verification 🟡 **HIGH**

**Question:** Who can verify shooter profiles (`shooters.verified_by`)?

**Your Answer (select all that apply):**

- [ ] Super Admin only
- [ ] State Association Admins (for their state shooters only)
- [ ] Technical Committee members
- [ ] Other: ******\_\_\_******

**Follow-up:** Should verification be a **two-step process**? (e.g., State Admin → National Admin)

**Your Answer:**

```
[FILL IN]
```

---

### **A2. Competitions & Entries**

#### Q5. Competition Cancellation 🔴 **BLOCKER**

**Question:** When a competition status changes to `cancelled`, what should happen to related data?

**Competition Entries:**

- [ ] Auto-withdraw all entries (`entry_status = 'withdrawn'`)
- [ ] Keep entries as-is, manual admin action required
- [ ] Other: ******\_\_\_******

**Payments:**

- [ ] Auto-initiate refunds for all paid entries
- [ ] Mark payments as `refunded` but require manual processing
- [ ] No automatic action
- [ ] Other: ******\_\_\_******

**Audit Logging:**

- [ ] Log bulk cancellation as single audit entry
- [ ] Log each entry/payment change individually
- [ ] Other: ******\_\_\_******

**Your Answer:**

```
[FILL IN]
```

---

#### Q6. Entry Withdrawal 🟡 **HIGH**

**Question:** Can shooters withdraw their competition entry after `registration_closes` timestamp?

**Your Answer:**

- [ ] Yes, allowed until 24 hours before competition starts
- [ ] Yes, allowed until competition `start_date`
- [ ] No, withdrawals locked after registration closes
- [ ] Other: ******\_\_\_******

**Penalty/Refund Policy:**

- [ ] Full refund if withdrawn before registration closes
- [ ] 50% refund if withdrawn after registration closes
- [ ] No refund after registration closes
- [ ] Other: ******\_\_\_******

**Your Answer:**

```
[FILL IN]
```

---

#### Q7. Waitlist Management 🟢 **MEDIUM**

**Question:** How should the `waitlisted` entry status work?

**Auto-Promotion:**

- [ ] Automatically promote waitlisted shooters when a slot opens (FIFO)
- [ ] Send notification to waitlisted shooter, they must confirm within X hours
- [ ] Manual admin action required
- [ ] Other: ******\_\_\_******

**Waitlist Limit:**

- [ ] No limit on waitlist size
- [ ] Limit to 2x of max_participants
- [ ] Other: ******\_\_\_******

**Your Answer:**

```
[FILL IN]
```

---

#### Q8. Relay Assignment 🟢 **MEDIUM**

**Question:** How are shooters assigned to event relays (`event_relays`)?

**Your Answer:**

- [ ] Manual assignment by competition admin
- [ ] Auto-assigned based on registration order (FIFO)
- [ ] Auto-assigned based on shooter ranking (seeding)
- [ ] Shooters choose their preferred relay during registration
- [ ] Other: ******\_\_\_******

**Relay Capacity:**

- [ ] Fixed capacity per relay (e.g., 20 shooters max)
- [ ] Flexible, based on venue firing points
- [ ] Other: ******\_\_\_******

**Your Answer:**

```
[FILL IN]
```

---

### **A3. Scores & Rankings**

#### Q9. Score Editing 🔴 **BLOCKER**

**Question:** Can scores be modified after `verified_at` timestamp is set?

**Your Answer:**

- [ ] No, scores are immutable after verification
- [ ] Yes, but only by Super Admin with audit log entry
- [ ] Yes, within 24 hours of verification
- [ ] Other: ******\_\_\_******

**If YES:**

- [ ] Old score should be archived in `audit_logs`
- [ ] Old score should be kept in a separate `scores_history` table
- [ ] Overwrite old score (not recommended)

**Protest Handling:**

- [ ] If `protest_filed = true`, scores remain editable until `protest_resolved_at`
- [ ] Protests require separate approval workflow
- [ ] Other: ******\_\_\_******

**Your Answer:**

```
[FILL IN]
```

---

#### Q10. Ranking Calculation 🟡 **HIGH**

**Question:** How are `rankings.ranking_points` calculated?

**Your Answer:**

- [ ] Based on ISSF/WSPS official formula (please provide formula/link)
- [ ] Custom formula: ******\_\_\_******
- [ ] Manually entered by admin
- [ ] Other: ******\_\_\_******

**Ranking Update Frequency:**

- [ ] Real-time after each competition
- [ ] Weekly batch job
- [ ] Monthly batch job
- [ ] Manual trigger by admin
- [ ] Other: ******\_\_\_******

**Storage:**

- [ ] Store as regular column (current approach)
- [ ] Use computed/generated column (PostgreSQL 12+)
- [ ] Calculate on-the-fly in views (no storage)

**Your Answer:**

```
[FILL IN]
```

---

#### Q11. Historical Rankings 🟢 **MEDIUM**

**Question:** How long should historical rankings (`is_current = false`) be retained?

**Your Answer:**

- [ ] Keep forever (for historical analysis)
- [ ] Archive after 5 years to separate table
- [ ] Delete after 2 years
- [ ] Other: ******\_\_\_******

**Archival Strategy:**

- [ ] Move to `rankings_archive` table
- [ ] Export to data warehouse
- [ ] Keep in same table with partitioning
- [ ] Other: ******\_\_\_******

**Your Answer:**

```
[FILL IN]
```

---

### **A4. Payments & Refunds**

#### Q12. Partial Refunds 🔴 **BLOCKER**

**Question:** The `payments.status` includes `partially_refunded`. How should partial refund amounts be tracked?

**Your Answer:**

- [ ] Add `refunded_amount` column to `payments` table
- [ ] Calculate from `SUM(refunds.amount)` where `payment_id = X`
- [ ] Store in `payments.metadata` JSONB field
- [ ] Other: ******\_\_\_******

**Validation:**

- [ ] Ensure `SUM(refunds.amount) <= payments.amount`
- [ ] Allow over-refund (e.g., for compensation)
- [ ] Other: ******\_\_\_******

**Your Answer:**

```
[FILL IN]
```

---

#### Q13. Failed Payments 🟡 **HIGH**

**Question:** How long should failed payment records be retained?

**Your Answer:**

- [ ] Keep forever (for fraud analysis)
- [ ] Delete after 90 days
- [ ] Archive after 1 year
- [ ] Other: ******\_\_\_******

**Retry Policy:**

- [ ] Allow user to retry failed payment (same `razorpay_order_id`)
- [ ] Create new payment record for each retry
- [ ] Other: ******\_\_\_******

**Your Answer:**

```
[FILL IN]
```

---

#### Q14. Payment Reconciliation 🟡 **HIGH**

**Question:** Should `competition_entries.payment_id` be a foreign key to `payments.id`?

**Current State:** It's a regular `BIGINT` column, not a foreign key.

**Your Answer:**

- [ ] Yes, add foreign key constraint `REFERENCES payments(id)`
- [ ] No, keep as-is (allows flexibility for external payments)
- [ ] Other: ******\_\_\_******

**If YES:**

- [ ] `ON DELETE RESTRICT` (prevent deleting payments with linked entries)
- [ ] `ON DELETE SET NULL` (allow payment deletion, nullify entry link)
- [ ] Other: ******\_\_\_******

**Your Answer:**

```
[FILL IN]
```

---

### **A5. Memberships**

#### Q15. Overlapping Memberships 🟡 **HIGH**

**Question:** Can a user renew their membership before the current one expires?

**Your Answer:**

- [ ] Yes, create new membership record, extend `end_date` of new record
- [ ] Yes, update existing membership `end_date` (no new record)
- [ ] No, must wait until current membership expires
- [ ] Other: ******\_\_\_******

**If YES (new record):**

- [ ] Old membership remains `active` until `end_date`
- [ ] Old membership immediately marked `expired`, new one becomes `active`
- [ ] Both memberships can be `active` simultaneously

**Your Answer:**

```
[FILL IN]
```

---

#### Q16. Membership Expiry 🟡 **HIGH**

**Question:** Should there be an automated job to mark memberships as `expired`?

**Your Answer:**

- [ ] Yes, daily scheduled job checks `end_date < CURRENT_DATE` and updates status
- [ ] No, application handles this at runtime
- [ ] Other: ******\_\_\_******

**Grace Period:**

- [ ] No grace period, expires on `end_date`
- [ ] 7-day grace period after `end_date`
- [ ] Other: ******\_\_\_******

**Your Answer:**

```
[FILL IN]
```

---

#### Q17. Membership Numbers 🟢 **MEDIUM**

**Question:** What format should `memberships.membership_number` follow?

**Your Answer:**

- [ ] Auto-generated: `PSCI-M-1001`, `PSCI-M-1002`, etc.
- [ ] Manual entry by admin
- [ ] Based on year: `PSCI-2025-001`, `PSCI-2025-002`, etc.
- [ ] Other: ******\_\_\_******

**Uniqueness:**

- [ ] Globally unique across all years
- [ ] Unique per year (reset sequence annually)
- [ ] Other: ******\_\_\_******

**Your Answer:**

```
[FILL IN]
```

---

## 🔐 SECTION B: Security & Privacy

#### Q18. PII Protection 🟡 **HIGH**

**Question:** Should sensitive personal information be encrypted at rest?

**Fields to Consider:**

- `users.phone`
- `shooters.emergency_contact_phone`
- `shooters.blood_group`
- `shooters.date_of_birth`
- `contact_messages.email`, `contact_messages.phone`

**Your Answer:**

- [ ] Yes, use PostgreSQL `pgcrypto` extension for column-level encryption
- [ ] Yes, use application-level encryption (before storing in DB)
- [ ] No, rely on database-level encryption (disk encryption)
- [ ] Other: ******\_\_\_******

**Audit Log PII:**

- [ ] Exclude PII fields from `audit_logs.old_values` and `new_values`
- [ ] Encrypt PII in audit logs
- [ ] Keep PII in audit logs (for compliance)
- [ ] Other: ******\_\_\_******

**Your Answer:**

```
[FILL IN]
```

---

#### Q19. GDPR/Data Retention 🟢 **MEDIUM**

**Question:** How long should deleted user accounts be retained?

**Your Answer:**

- [ ] Soft delete only (`deleted_at IS NOT NULL`), keep forever
- [ ] Hard delete after 90 days of soft delete
- [ ] Hard delete after 1 year of soft delete
- [ ] Immediate hard delete (not recommended)
- [ ] Other: ******\_\_\_******

**Right to be Forgotten:**

- [ ] Anonymize user data instead of deleting (replace name/email with "DELETED_USER_XXX")
- [ ] Full deletion including audit logs
- [ ] Full deletion except audit logs (keep for compliance)
- [ ] Other: ******\_\_\_******

**Your Answer:**

```
[FILL IN]
```

---

#### Q20. Role Permissions Schema 🟡 **HIGH**

**Question:** What is the structure of `roles.permissions` JSONB field?

**Example Format:**

```json
{
  "users": ["create", "read", "update", "delete"],
  "competitions": ["create", "read", "update"],
  "scores": ["verify", "read"]
}
```

**Your Answer (provide example):**

```json
[FILL IN]
```

**Validation:**

- [ ] Add CHECK constraint to validate JSON structure
- [ ] Validate at application level only
- [ ] Other: ******\_\_\_******

**Your Answer:**

```
[FILL IN]
```

---

#### Q21. Session Security 🟡 **HIGH**

**Question:** Should `user_sessions` track failed login attempts?

**Your Answer:**

- [ ] Yes, add `failed_login_attempts` table with IP, timestamp, user_id
- [ ] Yes, store in `user_sessions.metadata` JSONB
- [ ] No, handle at application/firewall level
- [ ] Other: ******\_\_\_******

**Rate Limiting:**

- [ ] Block IP after 5 failed attempts in 15 minutes
- [ ] Block user account after 10 failed attempts
- [ ] Other: ******\_\_\_******

**Your Answer:**

```
[FILL IN]
```

---

## 📊 SECTION C: Reporting & Analytics

#### Q22. Performance Reports 🟢 **MEDIUM**

**Question:** What are the most frequently run queries/reports?

**Your Answer (select all that apply):**

- [ ] Top shooters by event (leaderboard)
- [ ] Competition participation trends (monthly/yearly)
- [ ] Payment revenue by month/quarter
- [ ] State-wise shooter distribution
- [ ] Membership renewal rates
- [ ] Event-wise score statistics (avg, max, min)
- [ ] Audit trail reports (who changed what, when)
- [ ] Other: ******\_\_\_******

**Report Frequency:**

- [ ] Real-time (on-demand)
- [ ] Daily
- [ ] Weekly
- [ ] Monthly
- [ ] Other: ******\_\_\_******

**Your Answer:**

```
[FILL IN]
```

---

#### Q23. Materialized Views 🟢 **MEDIUM**

**Question:** Should expensive queries use materialized views for performance?

**Candidates:**

- Current rankings (joins `rankings`, `shooters`, `users`, `shooting_events`)
- Upcoming competitions (joins `competitions`, `venues`, `competition_events`)
- Active shooters with classifications

**Your Answer:**

- [ ] Yes, create materialized views with refresh schedule
- [ ] No, use regular views (always up-to-date)
- [ ] Use caching layer (Redis) instead
- [ ] Other: ******\_\_\_******

**Refresh Strategy:**

- [ ] Refresh on schedule (e.g., every 1 hour)
- [ ] Refresh on data change (trigger-based)
- [ ] Manual refresh by admin
- [ ] Other: ******\_\_\_******

**Your Answer:**

```
[FILL IN]
```

---

#### Q24. Export Requirements 🟢 **MEDIUM**

**Question:** Do admins need to export data (CSV/Excel)?

**Your Answer:**

- [ ] Yes, all tables should be exportable
- [ ] Yes, only specific tables: ******\_\_\_******
- [ ] No, use reporting tools instead
- [ ] Other: ******\_\_\_******

**Audit Logging:**

- [ ] Log all exports in `audit_logs` with table name and record count
- [ ] No logging needed
- [ ] Other: ******\_\_\_******

**Your Answer:**

```
[FILL IN]
```

---

## 🔄 SECTION D: Data Integrity & Validation

#### Q25. Orphan Prevention 🔴 **BLOCKER**

**Question:** What should happen when parent records are deleted?

**For each relationship, choose:**

- **CASCADE** - Delete child records automatically
- **RESTRICT** - Prevent deletion if child records exist
- **SET NULL** - Set foreign key to NULL in child records

| Parent Table   | Child Table           | Current     | Recommended                              |
| -------------- | --------------------- | ----------- | ---------------------------------------- |
| `users`        | `shooters`            | NO ACTION   | [FILL IN: CASCADE / RESTRICT / SET NULL] |
| `users`        | `payments`            | RESTRICT ✅ | [FILL IN: Keep or Change?]               |
| `users`        | `audit_logs`          | None        | [FILL IN: CASCADE / RESTRICT / SET NULL] |
| `venues`       | `competitions`        | None        | [FILL IN: CASCADE / RESTRICT / SET NULL] |
| `competitions` | `competition_events`  | CASCADE ✅  | [FILL IN: Keep or Change?]               |
| `shooters`     | `competition_entries` | None        | [FILL IN: CASCADE / RESTRICT / SET NULL] |
| `payments`     | `refunds`             | None        | [FILL IN: CASCADE / RESTRICT / SET NULL] |

**Your Answer:**

```
[FILL IN TABLE ABOVE]
```

---

#### Q26. Enum Expansion 🟢 **MEDIUM**

**Question:** How should new values be added to CHECK constraints?

**Example:** Adding new `competition_type` value like `'PARA_WORLD_CUP'`

**Your Answer:**

- [ ] Database migration (ALTER TABLE ... DROP CONSTRAINT ... ADD CONSTRAINT)
- [ ] Use lookup tables instead of CHECK constraints (e.g., `competition_types` table)
- [ ] Use PostgreSQL ENUMs instead of CHECK constraints
- [ ] Other: ******\_\_\_******

**Your Answer:**

```
[FILL IN]
```

---

#### Q27. JSONB Validation 🟢 **MEDIUM**

**Question:** Should JSONB columns have CHECK constraints to validate structure?

**Example:**

```sql
ALTER TABLE roles
ADD CONSTRAINT check_permissions_is_object
CHECK (jsonb_typeof(permissions) = 'object');
```

**Your Answer:**

- [ ] Yes, add type validation for all JSONB columns
- [ ] Yes, add schema validation using `jsonb_matches_schema()` (requires extension)
- [ ] No, validate at application level only
- [ ] Other: ******\_\_\_******

**Your Answer:**

```
[FILL IN]
```

---

## ⚙️ SECTION E: System & Operations

#### Q28. Scheduled Jobs 🟡 **HIGH**

**Question:** What background jobs need to run automatically?

**Your Answer (select all that apply and specify frequency):**

| Job                                                     | Frequency                           | Enabled        |
| ------------------------------------------------------- | ----------------------------------- | -------------- |
| Session cleanup (delete expired sessions)               | [FILL IN: Daily / Weekly]           | [ ] Yes [ ] No |
| Ranking updates (recalculate rankings)                  | [FILL IN: Daily / Weekly / Monthly] | [ ] Yes [ ] No |
| Membership expiry check (mark as expired)               | [FILL IN: Daily / Weekly]           | [ ] Yes [ ] No |
| Audit log archival (move old logs to archive)           | [FILL IN: Monthly / Quarterly]      | [ ] Yes [ ] No |
| Email digest (send notifications summary)               | [FILL IN: Daily / Weekly]           | [ ] Yes [ ] No |
| Competition status updates (auto-update based on dates) | [FILL IN: Hourly / Daily]           | [ ] Yes [ ] No |
| Other: ******\_\_\_******                               | [FILL IN]                           | [ ] Yes [ ] No |

**Job Execution:**

- [ ] Use PostgreSQL `pg_cron` extension
- [ ] Use external scheduler (cron, systemd timer)
- [ ] Use application-level scheduler (Node.js cron, Go ticker)
- [ ] Other: ******\_\_\_******

**Your Answer:**

```
[FILL IN TABLE ABOVE]
```

---

#### Q29. Backup Strategy 🟡 **HIGH**

**Question:** What backup and recovery strategy is needed?

**Your Answer:**

- [ ] Point-in-time recovery (PITR) with WAL archiving
- [ ] Daily full backups + hourly incremental
- [ ] Continuous replication to standby server
- [ ] Other: ******\_\_\_******

**Retention:**

- [ ] Keep daily backups for 30 days
- [ ] Keep weekly backups for 1 year
- [ ] Other: ******\_\_\_******

**Audit Log Separation:**

- [ ] Store `audit_logs` in separate tablespace for easier archival
- [ ] Keep in main database
- [ ] Other: ******\_\_\_******

**Your Answer:**

```
[FILL IN]
```

---

#### Q30. Multi-Tenancy 🟡 **HIGH**

**Question:** Will this system support multiple organizations (multi-tenancy)?

**Your Answer:**

- [ ] No, single-tenant (Para Shooting Committee of India only)
- [ ] Yes, state associations as tenants (add `tenant_id` to all tables)
- [ ] Future requirement (design for single-tenant now, plan for multi-tenant)
- [ ] Other: ******\_\_\_******

**If YES:**

- [ ] Use Row-Level Security (RLS) policies
- [ ] Use separate schemas per tenant
- [ ] Use separate databases per tenant
- [ ] Other: ******\_\_\_******

**Your Answer:**

```
[FILL IN]
```

---

## 🧪 SECTION F: Testing & Validation

#### Q31. Seed Data 🟢 **MEDIUM**

**Question:** Do you have sample/seed data for testing?

**Your Answer:**

- [ ] Yes, I will provide CSV/JSON files
- [ ] No, please generate realistic sample data
- [ ] Partially, I have: ******\_\_\_******

**Sample Size Needed:**

- [ ] 100 shooters, 10 competitions, 500 scores
- [ ] 1,000 shooters, 50 competitions, 5,000 scores
- [ ] Other: ******\_\_\_******

**Your Answer:**

```
[FILL IN]
```

---

#### Q32. Load Testing 🟢 **MEDIUM**

**Question:** What is the expected scale of the system?

| Metric                       | Year 1    | Year 3    | Year 5    |
| ---------------------------- | --------- | --------- | --------- |
| Total Shooters               | [FILL IN] | [FILL IN] | [FILL IN] |
| Active Shooters (monthly)    | [FILL IN] | [FILL IN] | [FILL IN] |
| Competitions per year        | [FILL IN] | [FILL IN] | [FILL IN] |
| Scores per competition (avg) | [FILL IN] | [FILL IN] | [FILL IN] |
| Concurrent users (peak)      | [FILL IN] | [FILL IN] | [FILL IN] |
| Payments per month           | [FILL IN] | [FILL IN] | [FILL IN] |

**Your Answer:**

```
[FILL IN TABLE ABOVE]
```

---

#### Q33. Concurrency 🟢 **MEDIUM**

**Question:** Will multiple admins edit the same records simultaneously?

**Your Answer:**

- [ ] Yes, need optimistic locking (version column)
- [ ] Yes, need pessimistic locking (SELECT FOR UPDATE)
- [ ] No, single admin workflow
- [ ] Other: ******\_\_\_******

**Conflict Resolution:**

- [ ] Last write wins
- [ ] Show conflict error, user must refresh and retry
- [ ] Merge changes automatically
- [ ] Other: ******\_\_\_******

**Your Answer:**

```
[FILL IN]
```

---

## ✅ COMPLETION CHECKLIST

Before submitting, ensure you've answered:

- [ ] All 🔴 **BLOCKER** questions (Q1, Q5, Q9, Q12, Q25)
- [ ] All 🟡 **HIGH** priority questions (Q2, Q4, Q6, Q10, Q13, Q14, Q15, Q16, Q18, Q20, Q21, Q28, Q29, Q30)
- [ ] All 🟢 **MEDIUM** priority questions (Q3, Q7, Q8, Q11, Q17, Q19, Q22, Q23, Q24, Q26, Q27, Q31, Q32, Q33)

**Total Questions:** 33  
**Answered:** **\_** / 33

---

## 📤 SUBMISSION

**How to Submit:**

1. Fill in all answers in this document
2. Save the file
3. Reply with "Questionnaire completed" or share the filled document
4. I will review and provide:
   - ✏️ Proposed Schema Changes (SQL migration scripts)
   - 📐 ERD Updates
   - 🔒 Security Enhancements
   - ⚡ Performance Optimizations
   - ✅ Migration Strategy
   - 📊 Quality Checklist

---

**Questions or Need Clarification?**  
Feel free to ask about any question before answering. I'm here to help! 🚀
