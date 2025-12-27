# Payment Data Model

> Para Shooting Committee of India - Payment System Documentation
> Version: 1.0 | Last Updated: December 2025

---

## Table of Contents

1. [Overview](#overview)
2. [Payment Flow](#payment-flow)
3. [Database Tables](#database-tables)
4. [Razorpay Integration](#razorpay-integration)
5. [Payment States](#payment-states)
6. [Idempotency Guarantees](#idempotency-guarantees)
7. [Reconciliation](#reconciliation)

---

## Overview

The payment system handles membership fees, competition entry fees, and donations through Razorpay payment gateway integration.

### Payment Types

| Type | Description | Typical Amount |
|------|-------------|----------------|
| `MEMBERSHIP` | Membership fee payment | ₹2,500 - ₹25,000 |
| `ENTRY_FEE` | Competition registration | ₹500 - ₹5,000 |
| `FINE` | Penalty payments | Variable |
| `DONATION` | Voluntary donations | Variable |
| `OTHER` | Miscellaneous payments | Variable |

---

## Payment Flow

### Complete Payment Flow Diagram

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                           PAYMENT FLOW                                        │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌─────────┐        ┌─────────┐        ┌──────────┐        ┌─────────────┐  │
│  │  User   │        │   API   │        │ Razorpay │        │   Webhook   │  │
│  └────┬────┘        └────┬────┘        └────┬─────┘        └──────┬──────┘  │
│       │                  │                   │                     │         │
│       │ 1. Initiate      │                   │                     │         │
│       │    Payment       │                   │                     │         │
│       │─────────────────>│                   │                     │         │
│       │                  │                   │                     │         │
│       │                  │ 2. Create Order   │                     │         │
│       │                  │──────────────────>│                     │         │
│       │                  │                   │                     │         │
│       │                  │   order_id        │                     │         │
│       │                  │<──────────────────│                     │         │
│       │                  │                   │                     │         │
│       │                  │ 3. Save Payment   │                     │         │
│       │                  │    (PENDING)      │                     │         │
│       │                  │─────┐             │                     │         │
│       │                  │     │ DB          │                     │         │
│       │                  │<────┘             │                     │         │
│       │                  │                   │                     │         │
│       │   order_id       │                   │                     │         │
│       │<─────────────────│                   │                     │         │
│       │                  │                   │                     │         │
│       │ 4. Open Razorpay │                   │                     │         │
│       │    Checkout      │                   │                     │         │
│       │─────────────────────────────────────>│                     │         │
│       │                  │                   │                     │         │
│       │ 5. Complete      │                   │                     │         │
│       │    Payment       │                   │                     │         │
│       │─────────────────────────────────────>│                     │         │
│       │                  │                   │                     │         │
│       │   payment_id,    │                   │                     │         │
│       │   signature      │                   │                     │         │
│       │<─────────────────────────────────────│                     │         │
│       │                  │                   │                     │         │
│       │ 6. Verify        │                   │  7. Webhook         │         │
│       │    Payment       │                   │     Notification    │         │
│       │─────────────────>│                   │────────────────────>│         │
│       │                  │                   │                     │         │
│       │                  │ 8. Verify         │                     │         │
│       │                  │    Signature      │                     │         │
│       │                  │──────────────────>│                     │         │
│       │                  │                   │                     │         │
│       │                  │ 9. Update Payment │                     │         │
│       │                  │    (COMPLETED)    │                     │         │
│       │                  │─────┐             │                     │         │
│       │                  │     │ DB          │                     │         │
│       │                  │<────┘             │                     │         │
│       │                  │                   │                     │         │
│       │   Success        │                   │                     │         │
│       │<─────────────────│                   │                     │         │
│       │                  │                   │                     │         │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## Database Tables

### Table: `payments`

| Column | Type | Description |
|--------|------|-------------|
| `id` | bigint | Primary key |
| `public_id` | uuid | External identifier |
| `user_id` | bigint | Paying user |
| `payment_type` | varchar(30) | MEMBERSHIP, ENTRY_FEE, etc. |
| `amount` | decimal(10,2) | Amount in INR |
| `currency` | varchar(3) | Currency code (INR) |
| `status` | varchar(20) | Payment status |
| `razorpay_order_id` | varchar(50) | Razorpay order ID |
| `razorpay_payment_id` | varchar(50) | Razorpay payment ID |
| `razorpay_signature` | text | Payment signature |
| `payment_method` | varchar(30) | UPI, CARD, NETBANKING |
| `paid_at` | timestamptz | Payment completion time |
| `created_at` | timestamptz | Record creation |

### Table: `refunds`

| Column | Type | Description |
|--------|------|-------------|
| `id` | bigint | Primary key |
| `payment_id` | bigint | Original payment reference |
| `amount` | decimal(10,2) | Refund amount |
| `status` | varchar(20) | Refund status |
| `razorpay_refund_id` | varchar(50) | Razorpay refund ID |
| `reason` | text | Refund reason |
| `initiated_by` | bigint | Admin user ID |
| `processed_at` | timestamptz | Processing time |

---

## Razorpay Integration

### Create Order

```typescript
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

async function createPaymentOrder(
  userId: number,
  type: PaymentType,
  amount: number,
  description: string
) {
  // Create Razorpay order
  const order = await razorpay.orders.create({
    amount: amount * 100, // Convert to paise
    currency: 'INR',
    receipt: `rcpt_${Date.now()}`,
    notes: { userId: String(userId), type },
  });
  
  // Save to database
  const payment = await prisma.payment.create({
    data: {
      userId,
      paymentType: type,
      amount,
      currency: 'INR',
      status: 'pending',
      razorpayOrderId: order.id,
      description,
    },
  });
  
  return { payment, orderId: order.id };
}
```

### Verify Payment

```typescript
import crypto from 'crypto';

function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const body = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

async function confirmPayment(
  orderId: string,
  paymentId: string,
  signature: string
) {
  // Verify signature
  if (!verifyRazorpaySignature(orderId, paymentId, signature)) {
    throw new Error('Invalid payment signature');
  }
  
  // Update payment status
  return prisma.payment.update({
    where: { razorpayOrderId: orderId },
    data: {
      razorpayPaymentId: paymentId,
      razorpaySignature: signature,
      status: 'completed',
      paidAt: new Date(),
    },
  });
}
```

### Webhook Handler

```typescript
async function handleRazorpayWebhook(payload: WebhookPayload, signature: string) {
  // Verify webhook signature
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(JSON.stringify(payload))
    .digest('hex');
  
  if (signature !== expectedSignature) {
    throw new Error('Invalid webhook signature');
  }
  
  const { event, payload: { payment } } = payload;
  
  switch (event) {
    case 'payment.captured':
      await prisma.payment.update({
        where: { razorpayPaymentId: payment.entity.id },
        data: {
          status: 'completed',
          paidAt: new Date(payment.entity.created_at * 1000),
          paymentMethod: payment.entity.method,
        },
      });
      break;
      
    case 'payment.failed':
      await prisma.payment.update({
        where: { razorpayOrderId: payment.entity.order_id },
        data: {
          status: 'failed',
          failedAt: new Date(),
          failureReason: payment.entity.error_description,
        },
      });
      break;
      
    case 'refund.processed':
      await prisma.refund.update({
        where: { razorpayRefundId: payload.payload.refund.entity.id },
        data: {
          status: 'completed',
          processedAt: new Date(),
        },
      });
      break;
  }
}
```

---

## Payment States

### Payment State Machine

```
                    ┌─────────────┐
                    │   PENDING   │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
              ▼            ▼            ▼
      ┌───────────┐  ┌───────────┐  ┌───────────┐
      │ PROCESSING│  │  FAILED   │  │ CANCELLED │
      └─────┬─────┘  └───────────┘  └───────────┘
            │
            ▼
      ┌───────────┐
      │ COMPLETED │
      └─────┬─────┘
            │
    ┌───────┴───────┐
    │               │
    ▼               ▼
┌────────────┐  ┌───────────────────┐
│  REFUNDED  │  │ PARTIALLY_REFUNDED│
└────────────┘  └───────────────────┘
```

### State Transitions

| From | To | Trigger | Reversible |
|------|-----|---------|------------|
| PENDING | PROCESSING | Payment initiated | No |
| PENDING | CANCELLED | User cancels | No |
| PROCESSING | COMPLETED | Payment successful | No |
| PROCESSING | FAILED | Payment failed | No |
| COMPLETED | REFUNDED | Full refund processed | No |
| COMPLETED | PARTIALLY_REFUNDED | Partial refund | Yes |

---

## Idempotency Guarantees

### Order Creation Idempotency

```typescript
async function getOrCreateOrder(
  userId: number,
  type: PaymentType,
  amount: number,
  idempotencyKey: string
) {
  // Check for existing order
  const existing = await prisma.payment.findFirst({
    where: {
      userId,
      paymentType: type,
      amount,
      status: 'pending',
      createdAt: { gte: new Date(Date.now() - 30 * 60 * 1000) }, // Last 30 min
    },
  });
  
  if (existing) {
    return { payment: existing, orderId: existing.razorpayOrderId };
  }
  
  // Create new order
  return createPaymentOrder(userId, type, amount, 'New order');
}
```

### Webhook Idempotency

```typescript
async function processWebhookIdempotent(eventId: string, handler: () => Promise<void>) {
  // Check if event already processed
  const processed = await prisma.paymentWebhook.findUnique({
    where: { eventId },
  });
  
  if (processed) {
    return { status: 'already_processed' };
  }
  
  // Process and record
  await prisma.$transaction(async (tx) => {
    await handler();
    await tx.paymentWebhook.create({
      data: { eventId, processedAt: new Date() },
    });
  });
  
  return { status: 'processed' };
}
```

---

## Reconciliation

### Daily Reconciliation Query

```sql
-- Daily payment reconciliation report
select
    date(paid_at) as payment_date,
    payment_type,
    count(*) as transaction_count,
    sum(amount) as total_amount,
    count(*) filter (where status = 'completed') as successful,
    count(*) filter (where status = 'failed') as failed,
    count(*) filter (where status = 'refunded') as refunded
from public.payments
where paid_at >= current_date - interval '1 day'
group by date(paid_at), payment_type
order by payment_date desc, payment_type;
```

### Monthly Summary

```sql
-- Monthly collection summary
select
    date_trunc('month', paid_at) as month,
    payment_type,
    count(*) as transactions,
    sum(amount) as gross_amount,
    sum(case when status in ('refunded', 'partially_refunded') 
        then (select sum(amount) from refunds where payment_id = payments.id) 
        else 0 end) as refunded_amount,
    sum(amount) - coalesce(sum(case when status in ('refunded', 'partially_refunded') 
        then (select sum(amount) from refunds where payment_id = payments.id) 
        else 0 end), 0) as net_amount
from public.payments
where status = 'completed'
    and paid_at >= date_trunc('year', current_date)
group by date_trunc('month', paid_at), payment_type
order by month desc;
```

