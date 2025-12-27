# Failure Handling Guide

> Para Shooting Committee of India - Critical Failure Scenarios
> Version: 1.0 | Last Updated: December 2025

---

## Table of Contents

1. [Overview](#overview)
2. [Failure Categories](#failure-categories)
3. [Database Failures](#database-failures)
4. [Application Failures](#application-failures)
5. [Payment Failures](#payment-failures)
6. [Detection & Alerting](#detection--alerting)
7. [Recovery Procedures](#recovery-procedures)

---

## Overview

This document defines critical failure scenarios, detection mechanisms, and mitigation strategies for the Para Shooting platform.

### Failure Response Priorities

| Priority | Response Time | Examples |
|----------|---------------|----------|
| P1 - Critical | < 15 minutes | Database down, payment system failure |
| P2 - High | < 1 hour | API errors > 5%, slow queries |
| P3 - Medium | < 4 hours | Non-critical service degradation |
| P4 - Low | < 24 hours | Minor bugs, cosmetic issues |

---

## Failure Categories

```
┌─────────────────────────────────────────────────────────────────┐
│                    FAILURE CATEGORIES                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                   DATABASE FAILURES                      │    │
│  ├─────────────────────────────────────────────────────────┤    │
│  │ • Connection Pool Exhausted                              │    │
│  │ • Deadlock Detection                                     │    │
│  │ • Replication Lag                                        │    │
│  │ • Disk Space Exhaustion                                  │    │
│  │ • Query Timeout                                          │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                  APPLICATION FAILURES                    │    │
│  ├─────────────────────────────────────────────────────────┤    │
│  │ • Memory Exhaustion                                      │    │
│  │ • Unhandled Exceptions                                   │    │
│  │ • External Service Timeout                               │    │
│  │ • Rate Limiting                                          │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                   PAYMENT FAILURES                       │    │
│  ├─────────────────────────────────────────────────────────┤    │
│  │ • Double Charge                                          │    │
│  │ • Failed Refund                                          │    │
│  │ • Webhook Delivery Failure                               │    │
│  │ • Signature Verification Failure                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Database Failures

### Connection Pool Exhausted

| Aspect | Details |
|--------|---------|
| **Error Code** | `53300` (too_many_connections) |
| **Detection** | Pool wait time > 5s, connection count at max |
| **Impact** | New requests fail, existing requests may timeout |
| **Mitigation** | Circuit breaker, connection queue, auto-scaling |

**Recovery Steps:**
1. Enable circuit breaker to reject new requests
2. Identify long-running queries and terminate if necessary
3. Scale connection pool if under-provisioned
4. Investigate root cause (query leaks, missing connection release)

```typescript
// Circuit breaker implementation
class DatabaseCircuitBreaker {
  private failures = 0;
  private lastFailure = 0;
  private state: 'closed' | 'open' | 'half-open' = 'closed';
  
  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      if (Date.now() - this.lastFailure > 30000) {
        this.state = 'half-open';
      } else {
        throw new Error('Circuit breaker is open');
      }
    }
    
    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
  
  private onSuccess() {
    this.failures = 0;
    this.state = 'closed';
  }
  
  private onFailure() {
    this.failures++;
    this.lastFailure = Date.now();
    if (this.failures >= 5) {
      this.state = 'open';
    }
  }
}
```

### Deadlock Detection

| Aspect | Details |
|--------|---------|
| **Error Code** | `40P01` (deadlock_detected) |
| **Detection** | PostgreSQL automatically detects and terminates |
| **Impact** | One transaction rolled back |
| **Mitigation** | Automatic retry with exponential backoff |

**Prevention:**
- Always acquire locks in consistent order
- Keep transactions short
- Use `SELECT ... FOR UPDATE NOWAIT` where appropriate

```typescript
async function withDeadlockRetry<T>(
  operation: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      if (error.code === '40P01' && attempt < maxRetries - 1) {
        await sleep(100 * Math.pow(2, attempt));
        continue;
      }
      throw error;
    }
  }
  throw new Error('Max deadlock retries exceeded');
}
```

### Replication Lag

| Aspect | Details |
|--------|---------|
| **Detection** | `pg_stat_replication` shows lag > 10s |
| **Impact** | Read replicas return stale data |
| **Mitigation** | Route critical reads to primary |

```sql
-- Monitor replication lag
select
    client_addr,
    state,
    sent_lsn,
    write_lsn,
    flush_lsn,
    replay_lsn,
    extract(epoch from now() - pg_last_xact_replay_timestamp()) as lag_seconds
from pg_stat_replication;
```

### Disk Space Exhaustion

| Aspect | Details |
|--------|---------|
| **Detection** | Disk usage > 85% alert |
| **Impact** | Database enters read-only mode |
| **Mitigation** | Automated cleanup, alerting |

**Prevention:**
- Monitor disk usage continuously
- Implement data retention policies
- Schedule regular VACUUM operations

---

## Application Failures

### Memory Exhaustion

| Aspect | Details |
|--------|---------|
| **Detection** | Memory usage > 90%, OOM killer |
| **Impact** | Process crash, request failures |
| **Mitigation** | Memory limits, request queuing |

```typescript
// Memory monitoring
setInterval(() => {
  const used = process.memoryUsage();
  if (used.heapUsed / used.heapTotal > 0.9) {
    logger.warn('High memory usage', { 
      heapUsed: used.heapUsed,
      heapTotal: used.heapTotal,
    });
    // Trigger garbage collection if available
    if (global.gc) global.gc();
  }
}, 30000);
```

### Unhandled Exceptions

| Aspect | Details |
|--------|---------|
| **Detection** | Error logging, crash reports |
| **Impact** | Request failure, potential data corruption |
| **Mitigation** | Global error handlers, graceful degradation |

```typescript
// Global error handling
process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception', { error });
  // Graceful shutdown
  gracefulShutdown().then(() => process.exit(1));
});

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled rejection', { reason });
});
```

---

## Payment Failures

### Double Charge Prevention

| Aspect | Details |
|--------|---------|
| **Risk** | User charged twice for same order |
| **Detection** | Duplicate payment_id for same order_id |
| **Mitigation** | Idempotency keys, unique constraints |

```typescript
async function processPaymentSafely(orderId: string, paymentId: string) {
  // Use database constraint to prevent duplicates
  try {
    await prisma.payment.update({
      where: { razorpayOrderId: orderId },
      data: { 
        razorpayPaymentId: paymentId,
        status: 'completed',
      },
    });
  } catch (error: any) {
    if (error.code === 'P2002') {
      // Payment already processed - this is safe
      logger.info('Payment already processed', { orderId, paymentId });
      return;
    }
    throw error;
  }
}
```

### Failed Refund Recovery

| Aspect | Details |
|--------|---------|
| **Risk** | Refund initiated but not completed |
| **Detection** | Refund status stuck in 'processing' |
| **Mitigation** | Retry mechanism, manual intervention queue |

```typescript
// Refund retry job
async function retryPendingRefunds() {
  const pendingRefunds = await prisma.refund.findMany({
    where: {
      status: 'processing',
      createdAt: { lt: new Date(Date.now() - 3600000) }, // > 1 hour old
    },
  });
  
  for (const refund of pendingRefunds) {
    try {
      const result = await razorpay.refunds.fetch(refund.razorpayRefundId);
      await prisma.refund.update({
        where: { id: refund.id },
        data: { 
          status: result.status === 'processed' ? 'completed' : 'failed',
          processedAt: new Date(),
        },
      });
    } catch (error) {
      logger.error('Refund retry failed', { refundId: refund.id, error });
    }
  }
}
```

---

## Detection & Alerting

### Health Check Endpoints

```typescript
// Database health check
app.get('/health/db', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'healthy' });
  } catch (error) {
    res.status(503).json({ status: 'unhealthy', error: error.message });
  }
});

// Full health check
app.get('/health', async (req, res) => {
  const checks = {
    database: await checkDatabase(),
    redis: await checkRedis(),
    razorpay: await checkRazorpay(),
  };
  
  const allHealthy = Object.values(checks).every(c => c.healthy);
  res.status(allHealthy ? 200 : 503).json({ 
    status: allHealthy ? 'healthy' : 'degraded',
    checks,
  });
});
```

### Alert Thresholds

| Metric | Warning | Critical |
|--------|---------|----------|
| Error Rate | > 1% | > 5% |
| Response Time (p99) | > 2s | > 5s |
| Database Connections | > 70% | > 90% |
| Memory Usage | > 80% | > 95% |
| Disk Usage | > 70% | > 85% |

---

## Recovery Procedures

### Database Recovery

```sql
-- Terminate long-running queries
select pg_terminate_backend(pid)
from pg_stat_activity
where state = 'active'
  and query_start < now() - interval '5 minutes'
  and query not like '%pg_stat_activity%';

-- Reclaim space
vacuum full analyze;

-- Reset connection pool (application level)
-- Restart application with fresh connections
```

### Application Recovery

1. **Identify** the failure type from logs/metrics
2. **Isolate** affected components if possible
3. **Mitigate** immediate impact (circuit breaker, feature flags)
4. **Recover** services in dependency order
5. **Verify** system health post-recovery
6. **Document** incident and root cause

### Payment Recovery

```typescript
// Reconciliation after outage
async function reconcilePayments(startTime: Date, endTime: Date) {
  // Get all Razorpay payments in time range
  const razorpayPayments = await razorpay.payments.all({
    from: Math.floor(startTime.getTime() / 1000),
    to: Math.floor(endTime.getTime() / 1000),
  });
  
  for (const payment of razorpayPayments.items) {
    const dbPayment = await prisma.payment.findFirst({
      where: { razorpayPaymentId: payment.id },
    });
    
    if (!dbPayment) {
      // Missing payment - investigate
      logger.warn('Payment in Razorpay but not in DB', { 
        paymentId: payment.id,
        orderId: payment.order_id,
      });
    } else if (dbPayment.status !== mapRazorpayStatus(payment.status)) {
      // Status mismatch - update
      await prisma.payment.update({
        where: { id: dbPayment.id },
        data: { status: mapRazorpayStatus(payment.status) },
      });
    }
  }
}
```

