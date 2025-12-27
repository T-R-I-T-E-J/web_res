# API Flow Diagrams

> Para Shooting Committee of India - Visual API Flow Documentation
> Version: 1.0 | Last Updated: December 2025

---

## Table of Contents

1. [User Registration Flow](#user-registration-flow)
2. [Shooter Profile Creation](#shooter-profile-creation)
3. [Competition Registration Flow](#competition-registration-flow)
4. [Score Submission Flow](#score-submission-flow)
5. [Payment Processing Flow](#payment-processing-flow)
6. [Refund Processing Flow](#refund-processing-flow)
7. [Classification Update Flow](#classification-update-flow)
8. [Ranking Calculation Flow](#ranking-calculation-flow)

---

## User Registration Flow

### Flow Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                      USER REGISTRATION FLOW                             │
├────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────┐                                                          │
│  │  Client  │                                                          │
│  └────┬─────┘                                                          │
│       │                                                                 │
│       │ 1. POST /api/auth/register                                     │
│       │    { email, password, firstName, lastName }                    │
│       │                                                                 │
│       ▼                                                                 │
│  ┌──────────┐                                                          │
│  │   API    │                                                          │
│  └────┬─────┘                                                          │
│       │                                                                 │
│       │ 2. Validate input (Zod schema)                                 │
│       │                                                                 │
│       ▼                                                                 │
│  ┌──────────────────────────────────────┐                              │
│  │            DATABASE                   │                              │
│  ├──────────────────────────────────────┤                              │
│  │                                       │                              │
│  │  3. BEGIN TRANSACTION                 │                              │
│  │     │                                 │                              │
│  │     ├─> Check email uniqueness        │                              │
│  │     │                                 │                              │
│  │     ├─> INSERT INTO users             │                              │
│  │     │   (email, password_hash, ...)   │                              │
│  │     │                                 │                              │
│  │     ├─> INSERT INTO user_roles        │                              │
│  │     │   (user_id, role_id='viewer')   │                              │
│  │     │                                 │                              │
│  │  4. COMMIT                            │                              │
│  │                                       │                              │
│  └────────────────┬─────────────────────┘                              │
│                   │                                                     │
│                   ▼                                                     │
│  ┌──────────┐                                                          │
│  │  Email   │ 5. Send verification email                               │
│  │  Service │                                                          │
│  └──────────┘                                                          │
│                                                                         │
│       ◄───────────────────────────────────────────────────────────     │
│       │                                                                 │
│       │ 6. Response: { user, message: "Verification email sent" }      │
│       │                                                                 │
│       ▼                                                                 │
│  ┌──────────┐                                                          │
│  │  Client  │ User clicks verification link                            │
│  └────┬─────┘                                                          │
│       │                                                                 │
│       │ 7. GET /api/auth/verify?token=xxx                              │
│       │                                                                 │
│       ▼                                                                 │
│  ┌──────────┐                                                          │
│  │   API    │ 8. UPDATE users SET email_verified_at = now()            │
│  └──────────┘                                                          │
│                                                                         │
└────────────────────────────────────────────────────────────────────────┘
```

### Database Operations

| Step | Operation | Table | Notes |
|------|-----------|-------|-------|
| 3a | SELECT | `users` | Check email uniqueness |
| 3b | INSERT | `users` | Create user record |
| 3c | INSERT | `user_roles` | Assign default role |
| 8 | UPDATE | `users` | Set verified timestamp |

---

## Shooter Profile Creation

### Flow Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                    SHOOTER PROFILE CREATION                             │
├────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────┐                                                          │
│  │Verified  │                                                          │
│  │  User    │                                                          │
│  └────┬─────┘                                                          │
│       │                                                                 │
│       │ 1. POST /api/shooters                                          │
│       │    { dateOfBirth, gender, stateAssociationId, ... }            │
│       │                                                                 │
│       ▼                                                                 │
│  ┌──────────┐                                                          │
│  │   API    │                                                          │
│  │          │ 2. Validate user is verified                             │
│  │          │ 3. Validate input data                                   │
│  └────┬─────┘                                                          │
│       │                                                                 │
│       ▼                                                                 │
│  ┌──────────────────────────────────────┐                              │
│  │            DATABASE                   │                              │
│  ├──────────────────────────────────────┤                              │
│  │                                       │                              │
│  │  4. BEGIN TRANSACTION                 │                              │
│  │     │                                 │                              │
│  │     ├─> Generate shooter_id           │                              │
│  │     │   (PSCI-YYYY-XXXX)              │                              │
│  │     │                                 │                              │
│  │     ├─> INSERT INTO shooters          │                              │
│  │     │   (user_id, shooter_id, ...)    │                              │
│  │     │                                 │                              │
│  │     ├─> UPDATE user_roles             │                              │
│  │     │   Add 'shooter' role            │                              │
│  │     │                                 │                              │
│  │  5. COMMIT                            │                              │
│  │                                       │                              │
│  └────────────────┬─────────────────────┘                              │
│                   │                                                     │
│       ◄───────────┘                                                     │
│       │                                                                 │
│       │ 6. Response: { shooter, message: "Profile created" }           │
│       │                                                                 │
│       ▼                                                                 │
│  ┌──────────┐                                                          │
│  │  Admin   │ 7. Review and verify profile                             │
│  │          │                                                          │
│  │          │ 8. POST /api/admin/shooters/:id/verify                   │
│  └────┬─────┘                                                          │
│       │                                                                 │
│       ▼                                                                 │
│  ┌──────────┐                                                          │
│  │   API    │ 9. UPDATE shooters SET verified_at = now()               │
│  └──────────┘                                                          │
│                                                                         │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Competition Registration Flow

### Flow Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                   COMPETITION REGISTRATION FLOW                         │
├────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────┐                                                          │
│  │ Shooter  │                                                          │
│  └────┬─────┘                                                          │
│       │                                                                 │
│       │ 1. GET /api/competitions/:id                                   │
│       │    View competition details                                    │
│       │                                                                 │
│       │ 2. POST /api/competitions/:id/events/:eventId/register         │
│       │                                                                 │
│       ▼                                                                 │
│  ┌──────────┐                                                          │
│  │   API    │                                                          │
│  └────┬─────┘                                                          │
│       │                                                                 │
│       │ 3. Validate:                                                   │
│       │    - Shooter verified? ✓                                       │
│       │    - Classification eligible? ✓                                │
│       │    - Registration open? ✓                                      │
│       │    - Event capacity? ✓                                         │
│       │                                                                 │
│       ▼                                                                 │
│  ┌──────────────────────────────────────┐                              │
│  │            DATABASE                   │                              │
│  ├──────────────────────────────────────┤                              │
│  │                                       │                              │
│  │  4. BEGIN TRANSACTION                 │                              │
│  │     │                                 │                              │
│  │     ├─> SELECT FROM competition_events│                              │
│  │     │   FOR UPDATE (lock row)         │                              │
│  │     │                                 │                              │
│  │     ├─> Check current entry count     │                              │
│  │     │                                 │                              │
│  │     ├─> INSERT INTO competition_entries│                             │
│  │     │   (status = 'pending')          │                              │
│  │     │                                 │                              │
│  │  5. COMMIT                            │                              │
│  │                                       │                              │
│  └────────────────┬─────────────────────┘                              │
│                   │                                                     │
│       ◄───────────┘                                                     │
│       │                                                                 │
│       │ 6. Response: { entry, payment_required: true }                 │
│       │                                                                 │
│       ▼                                                                 │
│  ┌──────────┐                                                          │
│  │ Shooter  │ 7. Proceed to payment (see Payment Flow)                 │
│  └──────────┘                                                          │
│                                                                         │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Score Submission Flow

### Flow Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                      SCORE SUBMISSION FLOW                              │
├────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────┐                                                          │
│  │ Official │                                                          │
│  └────┬─────┘                                                          │
│       │                                                                 │
│       │ 1. POST /api/scores                                            │
│       │    {                                                           │
│       │      entryId: 123,                                             │
│       │      stage: "QUALIFICATION",                                   │
│       │      seriesScores: [...],                                      │
│       │      totalScore: 632.5                                         │
│       │    }                                                           │
│       │                                                                 │
│       ▼                                                                 │
│  ┌──────────┐                                                          │
│  │   API    │                                                          │
│  └────┬─────┘                                                          │
│       │                                                                 │
│       │ 2. Validate:                                                   │
│       │    - Official has permission? ✓                                │
│       │    - Entry exists and confirmed? ✓                             │
│       │    - Event is ongoing? ✓                                       │
│       │    - Score within valid range? ✓                               │
│       │    - Series sum = total? ✓                                     │
│       │                                                                 │
│       ▼                                                                 │
│  ┌──────────────────────────────────────┐                              │
│  │            DATABASE                   │                              │
│  ├──────────────────────────────────────┤                              │
│  │                                       │                              │
│  │  3. BEGIN TRANSACTION                 │                              │
│  │     (ISOLATION: REPEATABLE READ)      │                              │
│  │     │                                 │                              │
│  │     ├─> UPSERT INTO scores            │                              │
│  │     │   ON CONFLICT (entry_id, stage) │                              │
│  │     │   DO UPDATE                     │                              │
│  │     │                                 │                              │
│  │     ├─> Check for record              │                              │
│  │     │   (compare with shooting_events)│                              │
│  │     │                                 │                              │
│  │     ├─> INSERT INTO audit_logs        │                              │
│  │     │                                 │                              │
│  │  4. COMMIT                            │                              │
│  │                                       │                              │
│  └────────────────┬─────────────────────┘                              │
│                   │                                                     │
│       ◄───────────┘                                                     │
│       │                                                                 │
│       │ 5. Response: { score, isRecord: false }                        │
│       │                                                                 │
│       ▼                                                                 │
│  ┌──────────┐                                                          │
│  │ Ranking  │ 6. Trigger async ranking recalculation                   │
│  │  Worker  │                                                          │
│  └──────────┘                                                          │
│                                                                         │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Payment Processing Flow

### Flow Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                     PAYMENT PROCESSING FLOW                             │
├────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐      │
│  │  Client  │     │   API    │     │ Razorpay │     │ Webhook  │      │
│  └────┬─────┘     └────┬─────┘     └────┬─────┘     └────┬─────┘      │
│       │                │                │                │             │
│       │ 1. Initiate    │                │                │             │
│       │    Payment     │                │                │             │
│       │───────────────>│                │                │             │
│       │                │                │                │             │
│       │                │ 2. Create      │                │             │
│       │                │    Order       │                │             │
│       │                │───────────────>│                │             │
│       │                │                │                │             │
│       │                │   order_id     │                │             │
│       │                │<───────────────│                │             │
│       │                │                │                │             │
│       │                │ 3. INSERT      │                │             │
│       │                │    payment     │                │             │
│       │                │   (PENDING)    │                │             │
│       │                │                │                │             │
│       │   order_id     │                │                │             │
│       │<───────────────│                │                │             │
│       │                │                │                │             │
│       │ 4. Open        │                │                │             │
│       │    Checkout    │                │                │             │
│       │────────────────────────────────>│                │             │
│       │                │                │                │             │
│       │ 5. Pay         │                │                │             │
│       │────────────────────────────────>│                │             │
│       │                │                │                │             │
│       │   payment_id   │                │                │             │
│       │   signature    │                │                │             │
│       │<────────────────────────────────│                │             │
│       │                │                │ 6. Webhook     │             │
│       │                │                │    Event       │             │
│       │                │                │───────────────>│             │
│       │ 7. Verify      │                │                │             │
│       │    Payment     │                │                │             │
│       │───────────────>│                │                │             │
│       │                │                │                │             │
│       │                │ 8. Verify      │                │             │
│       │                │    Signature   │                │             │
│       │                │<──────────────>│                │             │
│       │                │                │                │             │
│       │                │ 9. UPDATE      │                │             │
│       │                │    payment     │                │             │
│       │                │   (COMPLETED)  │                │             │
│       │                │                │                │             │
│       │   Success      │                │                │             │
│       │<───────────────│                │                │             │
│       │                │                │                │             │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Refund Processing Flow

### Flow Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                      REFUND PROCESSING FLOW                             │
├────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────┐                                                          │
│  │  Admin   │                                                          │
│  └────┬─────┘                                                          │
│       │                                                                 │
│       │ 1. POST /api/admin/payments/:id/refund                         │
│       │    { amount, reason }                                          │
│       │                                                                 │
│       ▼                                                                 │
│  ┌──────────┐                                                          │
│  │   API    │ 2. Validate:                                             │
│  │          │    - Admin has permission? ✓                             │
│  │          │    - Payment completed? ✓                                │
│  │          │    - Refund amount valid? ✓                              │
│  └────┬─────┘                                                          │
│       │                                                                 │
│       │ 3. BEGIN TRANSACTION                                           │
│       │                                                                 │
│       ▼                                                                 │
│  ┌──────────────────────────────────────┐                              │
│  │            DATABASE                   │                              │
│  ├──────────────────────────────────────┤                              │
│  │                                       │                              │
│  │  4. INSERT INTO refunds               │                              │
│  │     (status = 'pending')              │                              │
│  │                                       │                              │
│  └──────────────────────────────────────┘                              │
│       │                                                                 │
│       ▼                                                                 │
│  ┌──────────┐                                                          │
│  │ Razorpay │ 5. POST /refunds                                         │
│  │          │    { payment_id, amount }                                │
│  └────┬─────┘                                                          │
│       │                                                                 │
│       │ 6. refund_id                                                   │
│       │                                                                 │
│       ▼                                                                 │
│  ┌──────────────────────────────────────┐                              │
│  │            DATABASE                   │                              │
│  ├──────────────────────────────────────┤                              │
│  │                                       │                              │
│  │  7. UPDATE refunds                    │                              │
│  │     SET razorpay_refund_id,           │                              │
│  │         status = 'processing'         │                              │
│  │                                       │                              │
│  │  8. UPDATE payments                   │                              │
│  │     SET status = 'refunded'           │                              │
│  │                                       │                              │
│  │  9. COMMIT                            │                              │
│  │                                       │                              │
│  └──────────────────────────────────────┘                              │
│       │                                                                 │
│       ▼                                                                 │
│  ┌──────────┐                                                          │
│  │ Webhook  │ 10. refund.processed event                               │
│  │          │     UPDATE refunds status = 'completed'                  │
│  └──────────┘                                                          │
│                                                                         │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Classification Update Flow

### Flow Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                    CLASSIFICATION UPDATE FLOW                           │
├────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────┐                                                          │
│  │Classifier│                                                          │
│  │ Official │                                                          │
│  └────┬─────┘                                                          │
│       │                                                                 │
│       │ 1. POST /api/admin/shooters/:id/classification                 │
│       │    {                                                           │
│       │      categoryCode: "SH1",                                      │
│       │      status: "CONFIRMED",                                      │
│       │      validUntil: "2028-12-31"                                  │
│       │    }                                                           │
│       │                                                                 │
│       ▼                                                                 │
│  ┌──────────┐                                                          │
│  │   API    │ 2. Validate classifier permissions                       │
│  └────┬─────┘                                                          │
│       │                                                                 │
│       ▼                                                                 │
│  ┌──────────────────────────────────────┐                              │
│  │            DATABASE                   │                              │
│  ├──────────────────────────────────────┤                              │
│  │                                       │                              │
│  │  3. BEGIN TRANSACTION                 │                              │
│  │     │                                 │                              │
│  │     ├─> UPDATE shooter_classifications│                              │
│  │     │   SET is_current = false        │                              │
│  │     │   WHERE shooter_id = $1         │                              │
│  │     │                                 │                              │
│  │     ├─> INSERT INTO                   │                              │
│  │     │   shooter_classifications       │                              │
│  │     │   (is_current = true)           │                              │
│  │     │                                 │                              │
│  │     ├─> INSERT INTO audit_logs        │                              │
│  │     │                                 │                              │
│  │  4. COMMIT                            │                              │
│  │                                       │                              │
│  └──────────────────────────────────────┘                              │
│       │                                                                 │
│       ▼                                                                 │
│  ┌──────────┐                                                          │
│  │Notification│ 5. Notify shooter of classification update             │
│  │  Service   │                                                        │
│  └────────────┘                                                        │
│                                                                         │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Ranking Calculation Flow

### Flow Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                    RANKING CALCULATION FLOW                             │
├────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────┐                                                          │
│  │Scheduled │ Triggered weekly or after major competition              │
│  │   Job    │                                                          │
│  └────┬─────┘                                                          │
│       │                                                                 │
│       │ 1. Start ranking calculation                                   │
│       │                                                                 │
│       ▼                                                                 │
│  ┌──────────────────────────────────────┐                              │
│  │            DATABASE                   │                              │
│  ├──────────────────────────────────────┤                              │
│  │                                       │                              │
│  │  2. FOR EACH shooting_event:          │                              │
│  │     │                                 │                              │
│  │     ├─> SELECT top scores             │                              │
│  │     │   FROM last 12 months           │                              │
│  │     │   GROUP BY shooter              │                              │
│  │     │   ORDER BY best score DESC      │                              │
│  │     │                                 │                              │
│  │     ├─> Calculate ranking points      │                              │
│  │     │   (weighted by competition      │                              │
│  │     │    level and recency)           │                              │
│  │     │                                 │                              │
│  │     ├─> UPDATE rankings               │                              │
│  │     │   SET is_current = false        │                              │
│  │     │   WHERE event = current_event   │                              │
│  │     │                                 │                              │
│  │     └─> INSERT INTO rankings          │                              │
│  │         (new rankings with            │                              │
│  │          previous_rank captured)      │                              │
│  │                                       │                              │
│  └────────────────┬─────────────────────┘                              │
│                   │                                                     │
│       ◄───────────┘                                                     │
│       │                                                                 │
│       │ 3. Log completion                                              │
│       │                                                                 │
│       ▼                                                                 │
│  ┌──────────┐                                                          │
│  │ Update   │ 4. UPDATE scheduled_jobs                                 │
│  │  Status  │    SET last_run_at = now()                               │
│  └──────────┘                                                          │
│                                                                         │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────┐      │
│  │                  RANKING ALGORITHM                            │      │
│  ├──────────────────────────────────────────────────────────────┤      │
│  │                                                               │      │
│  │  Points = Σ (Score × Level_Weight × Recency_Factor)          │      │
│  │                                                               │      │
│  │  Level Weights:                                               │      │
│  │    INTERNATIONAL: 1.5                                         │      │
│  │    NATIONAL: 1.0                                              │      │
│  │    STATE: 0.5                                                 │      │
│  │                                                               │      │
│  │  Recency Factor:                                              │      │
│  │    Last 3 months: 1.0                                         │      │
│  │    3-6 months: 0.8                                            │      │
│  │    6-12 months: 0.6                                           │      │
│  │                                                               │      │
│  │  Count: Best 4 scores in 12-month window                      │      │
│  │                                                               │      │
│  └──────────────────────────────────────────────────────────────┘      │
│                                                                         │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Quick Reference

### API Endpoints Summary

| Flow | Method | Endpoint | Auth |
|------|--------|----------|------|
| Register | POST | `/api/auth/register` | None |
| Create Shooter | POST | `/api/shooters` | User |
| Register Competition | POST | `/api/competitions/:id/events/:eventId/register` | Shooter |
| Submit Score | POST | `/api/scores` | Official |
| Create Payment | POST | `/api/payments` | User |
| Process Refund | POST | `/api/admin/payments/:id/refund` | Admin |
| Update Classification | POST | `/api/admin/shooters/:id/classification` | Classifier |

### Transaction Isolation Levels

| Flow | Isolation Level |
|------|-----------------|
| User Registration | READ COMMITTED |
| Competition Registration | REPEATABLE READ |
| Score Submission | REPEATABLE READ |
| Payment Processing | SERIALIZABLE |
| Ranking Calculation | SERIALIZABLE |

