# API-to-Database Contract

> Para Shooting Committee of India - API Database Contract
> Version: 1.0 | Last Updated: December 2025

---

## Table of Contents

1. [Overview](#overview)
2. [Transaction Boundaries](#transaction-boundaries)
3. [Isolation Levels](#isolation-levels)
4. [Error Code Mapping](#error-code-mapping)
5. [Idempotency](#idempotency)
6. [Connection Management](#connection-management)
7. [Query Timeouts](#query-timeouts)

---

## Overview

This document defines the contract between the API layer and the PostgreSQL database, ensuring consistent behavior across all operations.

### Contract Principles

| Principle | Description |
|-----------|-------------|
| **Atomicity** | Related operations complete together or not at all |
| **Consistency** | Data integrity maintained at all times |
| **Isolation** | Concurrent operations don't interfere |
| **Durability** | Committed changes persist through failures |

---

## Transaction Boundaries

### Single-Operation Transactions

| Operation | Transaction | Example |
|-----------|-------------|---------|
| Create User | Single INSERT | `INSERT INTO users...` |
| Update Profile | Single UPDATE | `UPDATE shooters SET...` |
| Read Score | Single SELECT | `SELECT * FROM scores...` |
| Delete Session | Single DELETE | `DELETE FROM user_sessions...` |

### Multi-Operation Transactions

| Operation | Steps | Rollback Trigger |
|-----------|-------|------------------|
| Register Shooter | 1. Create user<br>2. Create shooter profile<br>3. Assign role | Any step fails |
| Competition Entry | 1. Validate eligibility<br>2. Create entry<br>3. Process payment | Payment fails |
| Score Submission | 1. Validate shooter<br>2. Insert score<br>3. Update rankings | Invalid data |
| Refund Payment | 1. Verify payment<br>2. Create refund<br>3. Update status | Razorpay fails |

### Transaction Example

```sql
-- Competition Registration Transaction
begin;

-- Step 1: Verify shooter eligibility
select id from public.shooters 
where id = $1 and verified_at is not null;

-- Step 2: Check event capacity
select count(*) < max_entries as has_capacity
from public.competition_entries ce
join public.competition_events ev on ce.competition_event_id = ev.id
where ev.id = $2;

-- Step 3: Create entry
insert into public.competition_entries (
    competition_event_id, shooter_id, entry_status, payment_status
) values ($2, $1, 'pending', 'pending')
returning id;

-- Step 4: Create payment record
insert into public.payments (
    user_id, payment_type, amount, status
) values ($3, 'ENTRY_FEE', $4, 'pending')
returning id;

commit;
```

---

## Isolation Levels

### Level Selection by Operation

| Operation Type | Isolation Level | Reason |
|----------------|-----------------|--------|
| Read-only queries | READ COMMITTED | Default, sufficient |
| Profile updates | READ COMMITTED | Non-critical |
| Score submission | REPEATABLE READ | Prevent phantom reads |
| Ranking calculation | SERIALIZABLE | Ensure consistency |
| Payment processing | SERIALIZABLE | Financial accuracy |
| Inventory/capacity | REPEATABLE READ | Prevent overselling |

### Implementation

```typescript
// Read-only (default)
const result = await db.query('SELECT * FROM competitions WHERE status = $1', ['upcoming']);

// Score submission (REPEATABLE READ)
await db.query('BEGIN ISOLATION LEVEL REPEATABLE READ');
// ... operations
await db.query('COMMIT');

// Payment processing (SERIALIZABLE)
await db.query('BEGIN ISOLATION LEVEL SERIALIZABLE');
try {
  // ... payment operations
  await db.query('COMMIT');
} catch (error) {
  await db.query('ROLLBACK');
  if (error.code === '40001') {
    // Serialization failure - retry
  }
}
```

---

## Error Code Mapping

### PostgreSQL to HTTP Status Mapping

| PostgreSQL Code | Error Name | HTTP Status | API Response |
|-----------------|------------|-------------|--------------|
| `23505` | unique_violation | 409 Conflict | `{ "error": "DUPLICATE_ENTRY", "message": "..." }` |
| `23503` | foreign_key_violation | 400 Bad Request | `{ "error": "INVALID_REFERENCE", "message": "..." }` |
| `23514` | check_violation | 422 Unprocessable | `{ "error": "VALIDATION_FAILED", "message": "..." }` |
| `23502` | not_null_violation | 400 Bad Request | `{ "error": "REQUIRED_FIELD", "message": "..." }` |
| `40001` | serialization_failure | 503 Retry | `{ "error": "RETRY", "message": "..." }` |
| `40P01` | deadlock_detected | 503 Retry | `{ "error": "RETRY", "message": "..." }` |
| `57014` | query_canceled | 504 Timeout | `{ "error": "TIMEOUT", "message": "..." }` |
| `53300` | too_many_connections | 503 Unavailable | `{ "error": "SERVICE_UNAVAILABLE", "message": "..." }` |
| `08006` | connection_failure | 503 Unavailable | `{ "error": "SERVICE_UNAVAILABLE", "message": "..." }` |
| `22P02` | invalid_text_representation | 400 Bad Request | `{ "error": "INVALID_FORMAT", "message": "..." }` |

### Error Handler Implementation

```typescript
function mapDatabaseError(error: DatabaseError): ApiError {
  const errorMap: Record<string, { status: number; code: string }> = {
    '23505': { status: 409, code: 'DUPLICATE_ENTRY' },
    '23503': { status: 400, code: 'INVALID_REFERENCE' },
    '23514': { status: 422, code: 'VALIDATION_FAILED' },
    '23502': { status: 400, code: 'REQUIRED_FIELD' },
    '40001': { status: 503, code: 'RETRY' },
    '40P01': { status: 503, code: 'RETRY' },
    '57014': { status: 504, code: 'TIMEOUT' },
  };
  
  const mapping = errorMap[error.code] || { status: 500, code: 'INTERNAL_ERROR' };
  
  return {
    status: mapping.status,
    body: {
      error: mapping.code,
      message: sanitizeErrorMessage(error),
      retryable: ['40001', '40P01'].includes(error.code),
    }
  };
}
```

---

## Idempotency

### Idempotency Key Strategy

| Operation | Idempotency Key | Storage |
|-----------|-----------------|---------|
| Payment Creation | `razorpay_order_id` | `payments.razorpay_order_id` |
| Competition Entry | `{shooter_id}_{event_id}` | Unique constraint |
| Score Submission | `{entry_id}_{stage}` | Unique constraint |
| Refund Request | `{payment_id}_{amount}` | `refunds` table |

### Implementation Pattern

```typescript
// Idempotent payment creation
async function createPayment(userId: number, type: string, amount: number, idempotencyKey: string) {
  // Check for existing payment with same idempotency key
  const existing = await db.query(
    'SELECT * FROM payments WHERE razorpay_order_id = $1',
    [idempotencyKey]
  );
  
  if (existing.rows.length > 0) {
    return existing.rows[0]; // Return existing payment
  }
  
  // Create new payment
  const result = await db.query(
    `INSERT INTO payments (user_id, payment_type, amount, razorpay_order_id, status)
     VALUES ($1, $2, $3, $4, 'pending')
     ON CONFLICT (razorpay_order_id) DO NOTHING
     RETURNING *`,
    [userId, type, amount, idempotencyKey]
  );
  
  return result.rows[0];
}
```

### Database-Level Idempotency

```sql
-- Idempotent score submission
insert into public.scores (
    competition_entry_id, stage, series_scores, total_score
) values ($1, $2, $3, $4)
on conflict (competition_entry_id, stage) 
do update set 
    series_scores = excluded.series_scores,
    total_score = excluded.total_score,
    updated_at = now()
returning *;
```

---

## Connection Management

### Pool Configuration

| Setting | Development | Production | Description |
|---------|-------------|------------|-------------|
| `min` | 2 | 10 | Minimum pool size |
| `max` | 10 | 50 | Maximum pool size |
| `idleTimeoutMillis` | 30000 | 10000 | Idle connection timeout |
| `connectionTimeoutMillis` | 5000 | 3000 | Connection acquisition timeout |
| `maxUses` | - | 7500 | Max queries per connection |

### Pool Implementation

```typescript
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  min: 10,
  max: 50,
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 3000,
  maxUses: 7500,
});

// Health check
pool.on('error', (err) => {
  console.error('Unexpected pool error', err);
});
```

---

## Query Timeouts

### Timeout Configuration by Operation

| Operation Type | Timeout (ms) | Example |
|----------------|--------------|---------|
| Simple read | 5,000 | Get user profile |
| List query | 10,000 | List competitions |
| Complex report | 30,000 | Generate rankings |
| Bulk insert | 60,000 | Import scores |
| Background job | 300,000 | Recalculate all rankings |

### Implementation

```typescript
// Per-query timeout
async function getShooterProfile(shooterId: number) {
  return db.query({
    text: 'SELECT * FROM v_active_shooters WHERE id = $1',
    values: [shooterId],
    timeout: 5000, // 5 seconds
  });
}

// Complex report with longer timeout
async function generateRankings(eventId: number) {
  return db.query({
    text: `
      SELECT s.shooter_id, s.total_score, 
             RANK() OVER (ORDER BY s.total_score DESC) as rank
      FROM scores s
      WHERE s.competition_entry_id IN (
        SELECT id FROM competition_entries WHERE competition_event_id = $1
      )
    `,
    values: [eventId],
    timeout: 30000, // 30 seconds
  });
}
```

### Statement Timeout at Database Level

```sql
-- Set default statement timeout (15 seconds)
alter database para_shooting set statement_timeout = '15s';

-- Set per-role timeout
alter role api_user set statement_timeout = '10s';
alter role report_user set statement_timeout = '60s';
```

