# Data Retention Policy

> Para Shooting Committee of India - Data Lifecycle Management
> Version: 1.0 | Last Updated: December 2025

---

## Table of Contents

1. [Overview](#overview)
2. [Retention Schedule](#retention-schedule)
3. [Delete Types](#delete-types)
4. [Anonymization Rules](#anonymization-rules)
5. [Cleanup Jobs](#cleanup-jobs)
6. [Compliance Requirements](#compliance-requirements)

---

## Overview

This policy defines how long data is retained, when it's deleted, and how deletion is performed across the Para Shooting platform.

### Data Lifecycle

```
┌─────────────────────────────────────────────────────────────────┐
│                      DATA LIFECYCLE                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐  │
│  │  ACTIVE  │───>│  SOFT    │───>│  ARCHIVE │───>│  PURGE   │  │
│  │          │    │  DELETE  │    │          │    │          │  │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘  │
│       │               │               │               │         │
│   Live data      Marked for      Cold storage     Permanent    │
│                   deletion                        deletion      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Retention Schedule

### Core Data

| Table | Retention | Delete Type | Archive | Notes |
|-------|-----------|-------------|---------|-------|
| `users` | Indefinite | Soft | No | Anonymize on GDPR request |
| `shooters` | Indefinite | Soft | No | Historical sports records |
| `shooter_classifications` | Indefinite | None | No | Medical/sports history |
| `scores` | 10 years | Hard | Yes | Legal requirement |
| `rankings` | 10 years | Hard | Yes | Historical records |
| `competitions` | Indefinite | Soft | No | Sports history |
| `competition_events` | 10 years | Hard | Yes | Follows competition |
| `competition_entries` | 10 years | Hard | Yes | Follows competition |

### Financial Data

| Table | Retention | Delete Type | Archive | Notes |
|-------|-----------|-------------|---------|-------|
| `payments` | 7 years | Hard | Yes | Tax compliance |
| `refunds` | 7 years | Hard | Yes | Tax compliance |
| `memberships` | 7 years after expiry | Hard | Yes | Financial records |
| `membership_types` | Indefinite | Soft | No | Reference data |

### Operational Data

| Table | Retention | Delete Type | Archive | Notes |
|-------|-----------|-------------|---------|-------|
| `user_sessions` | 30 days | Hard | No | Auto-cleanup |
| `notifications` | 90 days | Hard | No | Auto-cleanup |
| `contact_messages` | 1 year | Hard | No | After resolution |
| `audit_logs` | 2-7 years | Hard | Yes | By category |
| `scheduled_jobs` | Indefinite | None | No | System config |

### Content Data

| Table | Retention | Delete Type | Archive | Notes |
|-------|-----------|-------------|---------|-------|
| `news_articles` | 5 years | Soft | Yes | Archive old news |
| `documents` | Until superseded | Soft | Yes | Version history |
| `document_categories` | Indefinite | Soft | No | Reference data |
| `committee_members` | Indefinite | Soft | No | Historical record |

---

## Delete Types

### Soft Delete

Records marked as deleted but retained in database.

```sql
-- Soft delete implementation
update public.users
set deleted_at = now()
where id = $1;

-- Query excludes soft-deleted
select * from public.users
where deleted_at is null;
```

**Soft Delete Tables:**
- `users`
- `shooters`
- `competitions`
- `news_articles`
- `documents`

### Hard Delete

Records permanently removed from database.

```sql
-- Hard delete (only after retention period)
delete from public.user_sessions
where expires_at < now() - interval '30 days';
```

**Hard Delete Tables:**
- `user_sessions`
- `notifications`
- `contact_messages`
- `audit_logs` (after archival)

### Cascade Delete

Deleting parent records cascades to children.

| Parent | Children Affected |
|--------|-------------------|
| `users` | `user_sessions`, `notifications`, `user_roles` |
| `competitions` | `competition_events` → `competition_entries` → `scores` |
| `shooters` | `shooter_classifications`, `competition_entries` |

---

## Anonymization Rules

### User Anonymization (GDPR)

When a user requests data deletion:

```sql
-- Anonymize user data
update public.users
set
    email = 'deleted_' || id || '@anonymized.local',
    password_hash = 'ANONYMIZED',
    first_name = 'Deleted',
    last_name = 'User',
    phone = null,
    avatar_url = null,
    deleted_at = now()
where id = $1;

-- Anonymize shooter profile
update public.shooters
set
    emergency_contact_name = null,
    emergency_contact_phone = null,
    bio = null
where user_id = $1;

-- Keep shooter_id and scores for historical records
-- but remove identifiable information
```

### Anonymization Fields

| Table | Fields to Anonymize | Fields to Keep |
|-------|---------------------|----------------|
| `users` | email, password_hash, first_name, last_name, phone | id, created_at |
| `shooters` | emergency_contact_*, bio | shooter_id, scores |
| `audit_logs` | ip_address, user_agent, PII in values | action, timestamp |
| `contact_messages` | name, email, phone, message | subject, status |

---

## Cleanup Jobs

### Daily Cleanup

```typescript
// Run daily at 2 AM
async function dailyCleanup() {
  const results = {
    sessions: 0,
    notifications: 0,
  };
  
  // Cleanup expired sessions
  const sessions = await prisma.userSession.deleteMany({
    where: { expiresAt: { lt: new Date() } },
  });
  results.sessions = sessions.count;
  
  // Cleanup old notifications
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 90);
  
  const notifications = await prisma.notification.deleteMany({
    where: { createdAt: { lt: cutoff } },
  });
  results.notifications = notifications.count;
  
  logger.info('Daily cleanup completed', results);
  return results;
}
```

### Weekly Cleanup

```typescript
// Run weekly on Sunday at 3 AM
async function weeklyCleanup() {
  const results = {
    softDeleted: 0,
    contactMessages: 0,
  };
  
  // Permanently delete soft-deleted records older than 30 days
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 30);
  
  // Only for non-critical tables
  const deleted = await prisma.newsArticle.deleteMany({
    where: {
      deletedAt: { lt: cutoff },
      status: 'archived',
    },
  });
  results.softDeleted = deleted.count;
  
  // Cleanup resolved contact messages
  const yearAgo = new Date();
  yearAgo.setFullYear(yearAgo.getFullYear() - 1);
  
  const messages = await prisma.contactMessage.deleteMany({
    where: {
      status: 'closed',
      updatedAt: { lt: yearAgo },
    },
  });
  results.contactMessages = messages.count;
  
  logger.info('Weekly cleanup completed', results);
  return results;
}
```

### Monthly Archival

```typescript
// Run monthly on 1st at 4 AM
async function monthlyArchival() {
  const results = {
    auditLogs: 0,
    oldScores: 0,
  };
  
  // Archive audit logs older than 2 years
  const twoYearsAgo = new Date();
  twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
  
  const auditLogs = await prisma.auditLog.findMany({
    where: {
      createdAt: { lt: twoYearsAgo },
      tableName: { notIn: ['payments', 'refunds', 'scores'] },
    },
  });
  
  if (auditLogs.length > 0) {
    // Export to S3
    await archiveToS3('audit-logs', auditLogs);
    
    // Delete from database
    await prisma.auditLog.deleteMany({
      where: { id: { in: auditLogs.map(l => l.id) } },
    });
    
    results.auditLogs = auditLogs.length;
  }
  
  logger.info('Monthly archival completed', results);
  return results;
}
```

### Scheduled Jobs Configuration

```sql
-- Update scheduled_jobs with cleanup schedules
insert into scheduled_jobs (job_name, job_type, schedule, is_enabled, metadata) values
('daily_cleanup', 'CLEANUP', '0 2 * * *', true, 
  '{"tasks": ["sessions", "notifications"]}'::jsonb),
('weekly_cleanup', 'CLEANUP', '0 3 * * 0', true, 
  '{"tasks": ["soft_deleted", "contact_messages"]}'::jsonb),
('monthly_archival', 'CLEANUP', '0 4 1 * *', true, 
  '{"tasks": ["audit_logs", "old_scores"]}'::jsonb),
('yearly_purge', 'CLEANUP', '0 5 1 1 *', true, 
  '{"tasks": ["archived_data"]}'::jsonb)
on conflict (job_name) do update set schedule = excluded.schedule;
```

---

## Compliance Requirements

### Legal Requirements

| Requirement | Data Affected | Retention |
|-------------|---------------|-----------|
| Income Tax Act | Financial records | 7 years |
| IT Act 2000 | Audit logs | 2 years |
| Sports Code | Competition results | 10 years |
| GDPR (if applicable) | Personal data | On request |

### Retention Verification Query

```sql
-- Verify no data exceeds retention period
select
    'user_sessions' as table_name,
    count(*) as expired_records,
    min(expires_at) as oldest_record
from user_sessions
where expires_at < now() - interval '30 days'

union all

select
    'notifications',
    count(*),
    min(created_at)
from notifications
where created_at < now() - interval '90 days'

union all

select
    'contact_messages',
    count(*),
    min(created_at)
from contact_messages
where status = 'closed'
  and updated_at < now() - interval '1 year';
```

### Compliance Report

```sql
-- Generate compliance report
select
    table_name,
    retention_period,
    record_count,
    oldest_record,
    case 
        when oldest_record < retention_cutoff then 'OVERDUE'
        else 'COMPLIANT'
    end as status
from (
    select 
        'payments' as table_name,
        '7 years' as retention_period,
        count(*) as record_count,
        min(created_at) as oldest_record,
        now() - interval '7 years' as retention_cutoff
    from payments
    
    union all
    
    select 
        'scores',
        '10 years',
        count(*),
        min(created_at),
        now() - interval '10 years'
    from scores
    
    union all
    
    select
        'audit_logs',
        '2 years',
        count(*),
        min(created_at),
        now() - interval '2 years'
    from audit_logs
    where table_name not in ('payments', 'refunds', 'scores')
) compliance_check;
```

