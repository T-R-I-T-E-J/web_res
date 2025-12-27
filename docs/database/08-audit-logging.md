# Audit Logging Guide

> Para Shooting Committee of India - Audit Trail Implementation
> Version: 1.0 | Last Updated: December 2025

---

## Table of Contents

1. [Overview](#overview)
2. [What to Log](#what-to-log)
3. [Audit Log Schema](#audit-log-schema)
4. [Implementation](#implementation)
5. [GDPR Compliance](#gdpr-compliance)
6. [Querying Audit Logs](#querying-audit-logs)
7. [Retention & Archival](#retention--archival)

---

## Overview

The audit logging system provides a comprehensive trail of all data changes and user actions for compliance, security monitoring, and debugging purposes.

### Audit Purposes

| Purpose | Description |
|---------|-------------|
| **Compliance** | Meet regulatory requirements (IT Act, Sports Code) |
| **Security** | Detect unauthorized access and data breaches |
| **Debugging** | Track down data corruption issues |
| **Analytics** | Understand user behavior patterns |
| **Legal** | Provide evidence for disputes |

---

## What to Log

### Data Change Events

| Table | Events to Log | Sensitivity |
|-------|---------------|-------------|
| `users` | CREATE, UPDATE, DELETE | High |
| `shooters` | CREATE, UPDATE, DELETE | High |
| `shooter_classifications` | CREATE, UPDATE | High |
| `scores` | CREATE, UPDATE, DELETE | Critical |
| `rankings` | CREATE, UPDATE | Medium |
| `payments` | CREATE, UPDATE | Critical |
| `refunds` | CREATE, UPDATE | Critical |
| `memberships` | CREATE, UPDATE | High |
| `competition_entries` | CREATE, UPDATE, DELETE | Medium |
| `news_articles` | CREATE, UPDATE, DELETE | Low |

### User Action Events

| Action | When | Data Captured |
|--------|------|---------------|
| `LOGIN` | User authenticates | IP, user agent, success/failure |
| `LOGOUT` | User logs out | Session duration |
| `PASSWORD_CHANGE` | Password updated | Old hash (masked), timestamp |
| `ROLE_CHANGE` | Role assigned/removed | Old roles, new roles, admin |
| `EXPORT` | Data exported | Export type, filters, record count |
| `BULK_UPDATE` | Mass data changes | Affected records, change summary |

### Events NOT to Log

- Read operations (too voluminous)
- System health checks
- Static asset requests
- Automated background jobs (log separately)

---

## Audit Log Schema

### Table: `audit_logs`

| Column | Type | Description |
|--------|------|-------------|
| `id` | bigint | Primary key |
| `user_id` | bigint | Acting user (null for system) |
| `action` | varchar(50) | Action type |
| `table_name` | varchar(100) | Affected table |
| `record_id` | bigint | Affected record ID |
| `old_values` | jsonb | Previous values (for UPDATE/DELETE) |
| `new_values` | jsonb | New values (for CREATE/UPDATE) |
| `ip_address` | inet | Client IP address |
| `user_agent` | text | Browser/client info |
| `request_id` | uuid | Request correlation ID |
| `created_at` | timestamptz | Event timestamp |

### Indexes

```sql
create index idx_audit_logs_user on audit_logs(user_id);
create index idx_audit_logs_table_record on audit_logs(table_name, record_id);
create index idx_audit_logs_action on audit_logs(action);
create index idx_audit_logs_created on audit_logs(created_at);
create index idx_audit_logs_request on audit_logs(request_id);
```

---

## Implementation

### Trigger-Based Logging

```sql
-- Audit trigger function
create or replace function audit_log_trigger()
returns trigger as $$
declare
    audit_user_id bigint;
    audit_ip inet;
    audit_request_id uuid;
begin
    -- Get context from session variables (set by application)
    audit_user_id := nullif(current_setting('app.current_user_id', true), '')::bigint;
    audit_ip := nullif(current_setting('app.client_ip', true), '')::inet;
    audit_request_id := nullif(current_setting('app.request_id', true), '')::uuid;
    
    if (tg_op = 'DELETE') then
        insert into audit_logs (
            user_id, action, table_name, record_id, 
            old_values, ip_address, request_id
        ) values (
            audit_user_id, 'DELETE', tg_table_name, old.id,
            to_jsonb(old), audit_ip, audit_request_id
        );
        return old;
        
    elsif (tg_op = 'UPDATE') then
        -- Only log if values actually changed
        if to_jsonb(old) is distinct from to_jsonb(new) then
            insert into audit_logs (
                user_id, action, table_name, record_id,
                old_values, new_values, ip_address, request_id
            ) values (
                audit_user_id, 'UPDATE', tg_table_name, new.id,
                to_jsonb(old), to_jsonb(new), audit_ip, audit_request_id
            );
        end if;
        return new;
        
    elsif (tg_op = 'INSERT') then
        insert into audit_logs (
            user_id, action, table_name, record_id,
            new_values, ip_address, request_id
        ) values (
            audit_user_id, 'CREATE', tg_table_name, new.id,
            to_jsonb(new), audit_ip, audit_request_id
        );
        return new;
    end if;
    
    return null;
end;
$$ language plpgsql;

-- Apply to tables
create trigger audit_users after insert or update or delete on users
    for each row execute function audit_log_trigger();
    
create trigger audit_shooters after insert or update or delete on shooters
    for each row execute function audit_log_trigger();
    
create trigger audit_scores after insert or update or delete on scores
    for each row execute function audit_log_trigger();
    
create trigger audit_payments after insert or update or delete on payments
    for each row execute function audit_log_trigger();
```

### Application-Level Context

```typescript
// Middleware to set audit context
function auditContextMiddleware(req: Request, res: Response, next: NextFunction) {
  const requestId = uuidv4();
  req.requestId = requestId;
  
  // Set PostgreSQL session variables for triggers
  prisma.$executeRaw`
    SELECT set_config('app.current_user_id', ${String(req.user?.id || '')}, true);
    SELECT set_config('app.client_ip', ${req.ip || ''}, true);
    SELECT set_config('app.request_id', ${requestId}, true);
  `;
  
  next();
}

// Manual audit logging for non-database events
async function logAuditEvent(event: AuditEvent) {
  await prisma.auditLog.create({
    data: {
      userId: event.userId,
      action: event.action,
      tableName: event.tableName || 'N/A',
      recordId: event.recordId,
      newValues: event.details,
      ipAddress: event.ipAddress,
      userAgent: event.userAgent,
      requestId: event.requestId,
    },
  });
}

// Example: Log login event
await logAuditEvent({
  userId: user.id,
  action: 'LOGIN',
  details: { method: 'password', success: true },
  ipAddress: req.ip,
  userAgent: req.headers['user-agent'],
  requestId: req.requestId,
});
```

---

## GDPR Compliance

### Data Subject Rights

| Right | Implementation |
|-------|----------------|
| **Right to Access** | Export all audit logs for a user |
| **Right to Erasure** | Anonymize user reference in logs |
| **Right to Portability** | Export in machine-readable format |

### PII Handling in Logs

```typescript
// Mask sensitive fields before logging
function sanitizeForAudit(data: Record<string, any>): Record<string, any> {
  const sensitiveFields = [
    'password', 'passwordHash', 'token', 'secret',
    'creditCard', 'bankAccount', 'aadhaar', 'pan'
  ];
  
  const sanitized = { ...data };
  
  for (const field of sensitiveFields) {
    if (field in sanitized) {
      sanitized[field] = '[REDACTED]';
    }
  }
  
  // Mask email partially
  if (sanitized.email) {
    const [local, domain] = sanitized.email.split('@');
    sanitized.email = `${local.slice(0, 2)}***@${domain}`;
  }
  
  // Mask phone
  if (sanitized.phone) {
    sanitized.phone = sanitized.phone.replace(/\d(?=\d{4})/g, '*');
  }
  
  return sanitized;
}
```

### User Data Export

```sql
-- Export all audit logs for a user (GDPR request)
select
    created_at,
    action,
    table_name,
    record_id,
    ip_address,
    -- Exclude sensitive new_values/old_values
    case when action = 'LOGIN' then new_values else null end as details
from audit_logs
where user_id = $1
order by created_at desc;
```

### User Anonymization

```sql
-- Anonymize user in audit logs (Right to Erasure)
update audit_logs
set 
    ip_address = null,
    user_agent = null,
    old_values = old_values - 'email' - 'phone' - 'firstName' - 'lastName',
    new_values = new_values - 'email' - 'phone' - 'firstName' - 'lastName'
where user_id = $1;

-- Note: Keep the audit record but remove PII
```

---

## Querying Audit Logs

### Find Who Changed a Record

```sql
-- Who modified this score and when?
select 
    al.created_at,
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
```

### Track User Activity

```sql
-- All actions by a user in the last 24 hours
select 
    created_at,
    action,
    table_name,
    record_id,
    ip_address
from audit_logs
where user_id = $1
  and created_at >= now() - interval '24 hours'
order by created_at desc;
```

### Security Investigation

```sql
-- Failed login attempts from suspicious IPs
select 
    ip_address,
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
```

### Data Change Report

```sql
-- Daily change summary by table
select 
    date(created_at) as date,
    table_name,
    action,
    count(*) as count
from audit_logs
where created_at >= current_date - interval '7 days'
group by date(created_at), table_name, action
order by date desc, table_name, action;
```

---

## Retention & Archival

### Retention Periods

| Log Type | Retention | Reason |
|----------|-----------|--------|
| Financial (payments, refunds) | 7 years | Tax compliance |
| Score modifications | 10 years | Sports records |
| User authentication | 2 years | Security audit |
| General data changes | 2 years | Standard retention |
| System events | 90 days | Operational needs |

### Archival Strategy

```sql
-- Archive old audit logs to cold storage
create table audit_logs_archive (like audit_logs including all);

-- Move records older than 2 years to archive
insert into audit_logs_archive
select * from audit_logs
where created_at < now() - interval '2 years'
  and table_name not in ('payments', 'refunds', 'scores');

-- Delete archived records from main table
delete from audit_logs
where created_at < now() - interval '2 years'
  and table_name not in ('payments', 'refunds', 'scores');

-- Vacuum to reclaim space
vacuum analyze audit_logs;
```

### Cleanup Job

```typescript
// Scheduled job: Archive old audit logs
async function archiveOldAuditLogs() {
  const cutoffDate = new Date();
  cutoffDate.setFullYear(cutoffDate.getFullYear() - 2);
  
  // Archive to cold storage (S3, etc.)
  const oldLogs = await prisma.auditLog.findMany({
    where: {
      createdAt: { lt: cutoffDate },
      tableName: { notIn: ['payments', 'refunds', 'scores'] },
    },
  });
  
  // Export to S3
  await exportToS3(oldLogs, `audit-archive/${format(cutoffDate, 'yyyy-MM')}.json`);
  
  // Delete from database
  await prisma.auditLog.deleteMany({
    where: {
      createdAt: { lt: cutoffDate },
      tableName: { notIn: ['payments', 'refunds', 'scores'] },
    },
  });
  
  logger.info('Archived audit logs', { count: oldLogs.length });
}
```

