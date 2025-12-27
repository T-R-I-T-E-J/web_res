# API Contract Quick Reference

> Para Shooting Committee of India - Developer Quick Reference
> Version: 1.0 | Last Updated: December 2025

---

## Table of Contents

1. [CRUD Operations](#crud-operations)
2. [Common Query Patterns](#common-query-patterns)
3. [Error Handling](#error-handling)
4. [Retry Patterns](#retry-patterns)
5. [Pagination](#pagination)
6. [TypeScript/Prisma Examples](#typescriptprisma-examples)

---

## CRUD Operations

### Create Operations

```typescript
// Create User
const user = await prisma.user.create({
  data: {
    email: 'shooter@example.com',
    passwordHash: hashedPassword,
    firstName: 'Avani',
    lastName: 'Lekhara',
  },
});

// Create Shooter with Relations
const shooter = await prisma.shooter.create({
  data: {
    userId: user.id,
    shooterId: 'PSCI-2025-001',
    dateOfBirth: new Date('1995-01-01'),
    gender: 'female',
    stateAssociationId: 1,
  },
});
```

### Read Operations

```typescript
// Find by ID
const shooter = await prisma.shooter.findUnique({
  where: { id: shooterId },
  include: {
    user: true,
    stateAssociation: true,
    classifications: { where: { isCurrent: true } },
  },
});

// Find Many with Filters
const competitions = await prisma.competition.findMany({
  where: {
    status: 'upcoming',
    startDate: { gte: new Date() },
  },
  orderBy: { startDate: 'asc' },
  take: 10,
});
```

### Update Operations

```typescript
// Update Profile
const updated = await prisma.shooter.update({
  where: { id: shooterId },
  data: {
    coachName: 'New Coach',
    bio: 'Updated biography...',
  },
});

// Conditional Update
const result = await prisma.competitionEntry.updateMany({
  where: {
    competitionEventId: eventId,
    entryStatus: 'pending',
  },
  data: { entryStatus: 'confirmed' },
});
```

### Delete Operations

```typescript
// Soft Delete
const deleted = await prisma.user.update({
  where: { id: userId },
  data: { deletedAt: new Date() },
});

// Hard Delete
await prisma.userSession.deleteMany({
  where: { expiresAt: { lt: new Date() } },
});
```

---

## Common Query Patterns

### Get Shooter with Classification

```typescript
async function getShooterProfile(shooterId: string) {
  return prisma.shooter.findUnique({
    where: { shooterId },
    include: {
      user: {
        select: { firstName: true, lastName: true, email: true, avatarUrl: true },
      },
      stateAssociation: { select: { name: true, code: true } },
      classifications: {
        where: { isCurrent: true },
        include: { disabilityCategory: true },
      },
    },
  });
}
```

### Get Competition with Events

```typescript
async function getCompetitionDetails(publicId: string) {
  return prisma.competition.findUnique({
    where: { publicId },
    include: {
      venue: true,
      competitionEvents: {
        include: {
          shootingEvent: { include: { eventCategory: true } },
          _count: { select: { competitionEntries: true } },
        },
        orderBy: { scheduledDate: 'asc' },
      },
    },
  });
}
```

### Get Rankings

```typescript
async function getNationalRankings(eventCode: string, limit = 50) {
  return prisma.ranking.findMany({
    where: {
      isCurrent: true,
      rankingType: 'NATIONAL',
      shootingEvent: { code: eventCode },
    },
    include: {
      shooter: {
        include: {
          user: { select: { firstName: true, lastName: true } },
          stateAssociation: { select: { code: true } },
        },
      },
    },
    orderBy: { rank: 'asc' },
    take: limit,
  });
}
```

---

## Error Handling

### Error Handler

```typescript
import { Prisma } from '@prisma/client';

interface ApiError {
  status: number;
  code: string;
  message: string;
  retryable: boolean;
}

function handleDatabaseError(error: unknown): ApiError {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002': // Unique constraint
        return {
          status: 409,
          code: 'DUPLICATE_ENTRY',
          message: `A record with this ${error.meta?.target} already exists`,
          retryable: false,
        };
      case 'P2003': // Foreign key constraint
        return {
          status: 400,
          code: 'INVALID_REFERENCE',
          message: 'Referenced record does not exist',
          retryable: false,
        };
      case 'P2025': // Record not found
        return {
          status: 404,
          code: 'NOT_FOUND',
          message: 'Record not found',
          retryable: false,
        };
      default:
        return {
          status: 500,
          code: 'DATABASE_ERROR',
          message: 'An unexpected database error occurred',
          retryable: false,
        };
    }
  }
  
  if (error instanceof Prisma.PrismaClientValidationError) {
    return {
      status: 400,
      code: 'VALIDATION_ERROR',
      message: 'Invalid data provided',
      retryable: false,
    };
  }
  
  return {
    status: 500,
    code: 'INTERNAL_ERROR',
    message: 'An unexpected error occurred',
    retryable: false,
  };
}
```

### Usage in Route Handler

```typescript
app.post('/api/shooters', async (req, res) => {
  try {
    const shooter = await createShooter(req.body);
    res.status(201).json(shooter);
  } catch (error) {
    const apiError = handleDatabaseError(error);
    res.status(apiError.status).json({
      error: apiError.code,
      message: apiError.message,
    });
  }
});
```

---

## Retry Patterns

### Exponential Backoff

```typescript
async function withRetry<T>(
  operation: () => Promise<T>,
  options: { maxRetries?: number; baseDelay?: number } = {}
): Promise<T> {
  const { maxRetries = 3, baseDelay = 100 } = options;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      const isRetryable = 
        error instanceof Prisma.PrismaClientKnownRequestError &&
        ['P2034', 'P2024'].includes(error.code); // Transaction/connection errors
      
      if (!isRetryable || attempt === maxRetries) {
        throw error;
      }
      
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw new Error('Max retries exceeded');
}

// Usage
const result = await withRetry(() => 
  prisma.score.create({ data: scoreData })
);
```

### Transaction Retry

```typescript
async function submitScoreWithRetry(
  entryId: number,
  stage: string,
  scoreData: ScoreInput
) {
  return withRetry(async () => {
    return prisma.$transaction(async (tx) => {
      // Verify entry exists and is valid
      const entry = await tx.competitionEntry.findUnique({
        where: { id: entryId },
        include: { competitionEvent: true },
      });
      
      if (!entry || entry.entryStatus !== 'confirmed') {
        throw new Error('Invalid entry');
      }
      
      // Insert or update score
      return tx.score.upsert({
        where: {
          competitionEntryId_stage: { competitionEntryId: entryId, stage },
        },
        create: {
          competitionEntryId: entryId,
          stage,
          ...scoreData,
        },
        update: scoreData,
      });
    });
  });
}
```

---

## Pagination

### Cursor-Based Pagination

```typescript
interface PaginatedResult<T> {
  data: T[];
  nextCursor: string | null;
  hasMore: boolean;
}

async function getShootersPaginated(
  cursor?: string,
  limit = 20
): Promise<PaginatedResult<Shooter>> {
  const shooters = await prisma.shooter.findMany({
    take: limit + 1,
    ...(cursor && {
      skip: 1,
      cursor: { id: parseInt(cursor) },
    }),
    orderBy: { id: 'asc' },
    include: {
      user: { select: { firstName: true, lastName: true } },
    },
  });
  
  const hasMore = shooters.length > limit;
  const data = hasMore ? shooters.slice(0, -1) : shooters;
  
  return {
    data,
    nextCursor: hasMore ? String(data[data.length - 1].id) : null,
    hasMore,
  };
}
```

### Offset Pagination

```typescript
interface PagedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

async function getCompetitionsPaged(
  page = 1,
  pageSize = 10
): Promise<PagedResult<Competition>> {
  const [data, total] = await prisma.$transaction([
    prisma.competition.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { startDate: 'desc' },
    }),
    prisma.competition.count(),
  ]);
  
  return {
    data,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}
```

---

## TypeScript/Prisma Examples

### Bulk Operations

```typescript
// Bulk create entries
async function registerShootersForEvent(
  eventId: number,
  shooterIds: number[]
) {
  const entries = shooterIds.map(shooterId => ({
    competitionEventId: eventId,
    shooterId,
    entryStatus: 'pending' as const,
    paymentStatus: 'pending' as const,
  }));
  
  return prisma.competitionEntry.createMany({
    data: entries,
    skipDuplicates: true,
  });
}

// Bulk update
async function confirmAllPendingEntries(eventId: number) {
  return prisma.competitionEntry.updateMany({
    where: {
      competitionEventId: eventId,
      entryStatus: 'pending',
      paymentStatus: 'paid',
    },
    data: { entryStatus: 'confirmed', confirmedAt: new Date() },
  });
}
```

### Complex Transactions

```typescript
async function processCompetitionRegistration(
  shooterId: number,
  eventId: number,
  paymentData: PaymentInput
) {
  return prisma.$transaction(async (tx) => {
    // 1. Verify shooter eligibility
    const shooter = await tx.shooter.findUnique({
      where: { id: shooterId },
      include: { classifications: { where: { isCurrent: true } } },
    });
    
    if (!shooter?.verifiedAt) {
      throw new Error('Shooter not verified');
    }
    
    // 2. Check event capacity
    const event = await tx.competitionEvent.findUnique({
      where: { id: eventId },
      include: { _count: { select: { competitionEntries: true } } },
    });
    
    if (event?.maxEntries && event._count.competitionEntries >= event.maxEntries) {
      throw new Error('Event is full');
    }
    
    // 3. Create payment
    const payment = await tx.payment.create({
      data: {
        userId: shooter.userId,
        paymentType: 'ENTRY_FEE',
        amount: paymentData.amount,
        razorpayOrderId: paymentData.orderId,
        status: 'pending',
      },
    });
    
    // 4. Create entry
    const entry = await tx.competitionEntry.create({
      data: {
        competitionEventId: eventId,
        shooterId,
        entryStatus: 'pending',
        paymentStatus: 'pending',
        paymentId: payment.id,
        entryFeePaid: paymentData.amount,
      },
    });
    
    return { entry, payment };
  });
}
```

### Aggregations

```typescript
// Get shooter statistics
async function getShooterStats(shooterId: number) {
  const stats = await prisma.score.aggregate({
    where: {
      competitionEntry: { shooterId },
      stage: 'QUALIFICATION',
    },
    _avg: { totalScore: true },
    _max: { totalScore: true },
    _count: true,
  });
  
  return {
    competitionsEntered: stats._count,
    averageScore: stats._avg.totalScore,
    bestScore: stats._max.totalScore,
  };
}

// Get event participation by state
async function getStateParticipation(competitionId: number) {
  const result = await prisma.competitionEntry.groupBy({
    by: ['shooterId'],
    where: {
      competitionEvent: { competitionId },
      entryStatus: { in: ['confirmed', 'dns', 'dnf'] },
    },
  });
  
  // Further processing with shooter's state association...
}
```

