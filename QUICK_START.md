# Quick Start Guide

## Prerequisites

- Node.js 18+ installed
- Docker Desktop installed and running
- Git (optional)

## Setup Steps

### 1. Install Dependencies

```bash
cd C:\Users\starl\.gemini\antigravity\scratch\failure-handling-tests
npm install
```

### 2. Start Database

```bash
# Start PostgreSQL and Redis via Docker
docker-compose up -d

# Verify containers are running
docker ps
```

### 3. Initialize Database

```bash
# Run Prisma migrations
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate
```

### 4. Run Tests

```bash
# Run all test scenarios
npm run dev

# Run Jest test suite
npm test

# Watch mode for development
npm run test:watch
```

### 5. Start Test Server

```bash
# Start health check server
npm run dev

# Server will be available at http://localhost:3000
```

## Test Endpoints

Once the server is running, you can test the endpoints:

```bash
# Full health check
curl http://localhost:3000/health

# Database health only
curl http://localhost:3000/health/db

# Redis health only
curl http://localhost:3000/health/redis
```

## Running Individual Tests

Edit `src/index.ts` and comment/uncomment specific tests:

```typescript
// Comment out tests you don't want to run
// await testCircuitBreaker();
await simulateDeadlock(prisma);
await testDoubleChargePrevention(prisma);
```

## Memory Testing

To test memory exhaustion (requires --expose-gc flag):

```bash
node --expose-gc dist/index.js --memory
```

## Stopping the Environment

```bash
# Stop Docker containers
docker-compose down

# Remove volumes (cleans all data)
docker-compose down -v
```

## Troubleshooting

### Database Connection Issues

If you see connection errors:

1. Verify Docker is running
2. Check containers: `docker ps`
3. Check logs: `docker-compose logs postgres`
4. Verify `.env` file has correct DATABASE_URL

### Port Conflicts

If ports 5433 or 6380 are in use:

1. Edit `docker-compose.yml`
2. Change port mappings
3. Update `.env` file accordingly

### Prisma Issues

If Prisma commands fail:

```bash
# Regenerate client
npx prisma generate

# Reset database
npx prisma migrate reset
```

## Next Steps

1. Review test results in console output
2. Examine `FAILURE_HANDLING_GUIDE.md` for implementation patterns
3. Adapt validated code to your main project
4. Configure monitoring and alerting in production
5. Set up actual Razorpay integration (currently mocked)

## Project Structure

```
failure-handling-tests/
├── src/
│   ├── app/              # Application failure tests
│   ├── db/               # Database failure tests
│   ├── payment/          # Payment failure tests
│   ├── monitoring/       # Health checks & monitoring
│   ├── index.ts          # Main test runner
│   └── server.ts         # Express server
├── tests/                # Jest test suite
├── prisma/               # Database schema
└── docker-compose.yml    # Docker configuration
```
