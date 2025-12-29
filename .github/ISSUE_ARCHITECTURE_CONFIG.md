# ⚙️ Critical Configuration: Multiple Architecture & Config Errors

## Problem Description

### What is happening

The application has **multiple critical configuration and architectural issues** that will cause failures in production environments, including ephemeral storage vulnerabilities, port mismatches, disabled audit logging, and hardcoded database configurations. These issues create a fragile system that works inconsistently across environments.

### Where it is happening

- **Storage**: `apps/api/src/results/services/storage.service.ts` - Ephemeral storage vulnerability
- **Frontend**: `apps/web/src/app/(dashboard)/admin/scores/page.tsx` - Port mismatch (8082 vs 8080)
- **Backend**: `apps/api/src/main.ts` - Port configuration
- **Audit**: `apps/api/src/app.module.ts` - Disabled audit interceptor
- **Database**: `apps/api/src/config/database.config.ts` - Hardcoded SSL settings
- **Auth**: `apps/api/src/auth/auth.service.ts` - TypeScript type mismatches

### Why it is a problem

These are **critical operational and deployment issues** that:

- ✗ Cause file loss on modern hosting platforms (Netlify, Vercel, Heroku)
- ✗ Break frontend-backend communication (connection refused)
- ✗ Disable critical audit logging (compliance violation)
- ✗ Cause production deployment failures (database connection errors)
- ✗ Hide runtime errors with TypeScript type casting
- ✗ Create inconsistent behavior across environments
- ✗ Make the application undeployable to production

### Who is affected

- **DevOps/Infrastructure**: Deployment failures and debugging nightmares
- **Compliance/Audit**: No audit trail for critical actions
- **End Users**: Features break in production
- **Development Team**: Inconsistent behavior across environments
- **Organization**: Cannot deploy to production safely

---

## Root Cause Analysis

### Issue 1: Ephemeral Storage Vulnerability (CRITICAL)

**Current (Broken) Code**:

```typescript
// apps/api/src/results/services/storage.service.ts

async saveFile(file: Express.Multer.File): Promise<string> {
  // ❌ CRITICAL: Uses process.cwd() - unreliable on modern hosting
  const uploadDir = path.join(process.cwd(), '../../results');

  // Problem: On Netlify, Vercel, Heroku, Railway:
  // - process.cwd() changes between deployments
  // - Files are stored in ephemeral filesystem
  // - Files disappear on every deploy/restart
  // - No persistent storage
}
```

**What Happens on Modern Hosting**:

```
Deploy 1: User uploads file.pdf → Stored in /tmp/app-123/results/
Deploy 2: Code updated → New container created
         → /tmp/app-456/results/ (empty)
         → file.pdf is GONE ❌
```

**Impact**: All uploaded files disappear on every deployment or server restart.

---

### Issue 2: Port and Path Mismatch (HIGH)

**Backend Configuration**:

```typescript
// apps/api/src/main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api/v1"); // ✅ Prefix set
  await app.listen(8080); // ✅ Port 8080
}
```

**Frontend Configuration (WRONG)**:

```typescript
// apps/web/src/app/(dashboard)/admin/scores/page.tsx
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8082"; // ❌ Port 8082!

// Also missing api/v1 prefix in some places
const res = await fetch(`${API_URL}/results`); // ❌ Should be /api/v1/results
```

**Result**: `ECONNREFUSED` - Frontend tries to connect to port 8082, backend is on 8080.

---

### Issue 3: Disabled Audit Logging (CRITICAL)

**Current (Broken) Code**:

```typescript
// apps/api/src/app.module.ts
@Module({
  providers: [
    // ... other providers
    // ❌ CRITICAL: Audit interceptor is commented out
    // AuditInterceptor,
  ],
})
export class AppModule {}
```

**Impact**:

- No audit trail for user deletions
- No audit trail for file uploads/deletions
- No audit trail for role changes
- No audit trail for sensitive data access
- **Compliance violation** (SOC 2, ISO 27001, GDPR require audit logs)

---

### Issue 4: Database Configuration Issues (MEDIUM)

**Current (Problematic) Code**:

```typescript
// apps/api/src/config/database.config.ts
export const databaseConfig = {
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  // ❌ Hardcoded SSL settings (may not work in all environments)
  ssl: {
    rejectUnauthorized: false, // Dangerous in production
  },

  // ❌ Synchronize should NEVER be true in production
  synchronize: false, // Good, but not enforced
};
```

**Problems**:

- SSL settings not configurable per environment
- No validation that `synchronize` is false in production
- Missing connection pool configuration
- No retry logic for connection failures

---

### Issue 5: TypeScript Type Mismatches (LOW but RISKY)

**Current (Problematic) Code**:

```typescript
// apps/api/src/auth/auth.service.ts

const token = this.jwtService.sign(payload, {
  // ❌ Using type casting to bypass TypeScript
  expiresIn: process.env.JWT_EXPIRES_IN as any,
  // or
  // @ts-ignore
  expiresIn: process.env.JWT_EXPIRES_IN,
});
```

**Problem**:

- If `JWT_EXPIRES_IN=3600` (number without unit), JWT library crashes at runtime
- TypeScript can't catch this error because of `as any` or `@ts-ignore`
- Should be: `JWT_EXPIRES_IN=1h` or `JWT_EXPIRES_IN=3600s`

---

## Steps to Reproduce

### Issue 1: Ephemeral Storage

1. Deploy to Netlify/Vercel/Heroku
2. Upload a file
3. Trigger a new deployment (git push)
4. Try to access the file → **404 Not Found**

### Issue 2: Port Mismatch

1. Start backend on port 8080
2. Start frontend
3. Navigate to admin scores page
4. Open DevTools → Network tab
5. Observe: `ECONNREFUSED` to `localhost:8082`

### Issue 3: Disabled Audit Logging

1. Delete a user as admin
2. Check `audit_logs` table:
   ```sql
   SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 10;
   ```
3. Observe: **No entries** (audit logging disabled)

### Issue 4: Database SSL

1. Deploy to production with SSL-required database
2. Observe: Connection fails or succeeds with insecure connection

### Issue 5: JWT Type Error

1. Set `JWT_EXPIRES_IN=3600` (no unit)
2. Attempt login
3. Observe: Runtime error or unexpected behavior

---

## Impact Assessment

### Deployment Impact

- **Severity**: Critical
- **Affected Environments**: Production, staging, any cloud hosting
- **Workaround**: None (requires code changes)

### Compliance Impact

- **Audit Logging**: Violates SOC 2, ISO 27001, GDPR, HIPAA
- **Data Retention**: Files lost on deployment (data loss)
- **Security**: No audit trail for investigations

### Operational Impact

- **File Storage**: All files lost on deployment
- **Debugging**: Port mismatches cause confusion
- **Monitoring**: No audit logs for tracking actions

---

## Scope & Constraints

### ✅ In Scope

- Fix ephemeral storage (migrate to cloud storage or persistent volumes)
- Fix port mismatch (consistent configuration)
- Enable audit interceptor
- Improve database configuration
- Fix TypeScript type issues
- Document environment-specific configurations

### ❌ Out of Scope

- Complete cloud migration (separate project)
- Implementing new audit features (just enable existing)
- Database schema changes (just config)

### 📋 Assumptions

- Cloud storage (S3, GCS, Cloudinary) is acceptable solution
- Audit logging code already exists (just needs enabling)
- Environment variables can be updated

### 🔗 Dependencies

- May require AWS SDK, Google Cloud SDK, or Cloudinary SDK
- Requires environment variable updates
- May require infrastructure changes (persistent volumes)

---

## Acceptance Criteria

This issue is considered **resolved** when:

- [ ] **Storage (Critical)**

  - [ ] Files stored in persistent location (cloud storage or persistent volume)
  - [ ] Files survive deployments and restarts
  - [ ] Storage configuration documented
  - [ ] Migration path for existing files documented

- [ ] **Port Configuration (High)**

  - [ ] Frontend uses correct port (8080)
  - [ ] All API calls include `/api/v1` prefix
  - [ ] Environment variable used consistently
  - [ ] No hardcoded ports in code

- [ ] **Audit Logging (Critical)**

  - [ ] `AuditInterceptor` enabled in `app.module.ts`
  - [ ] All critical actions logged (create, update, delete)
  - [ ] Audit logs include user ID, action, timestamp, IP
  - [ ] Audit logs queryable and exportable

- [ ] **Database Configuration (Medium)**

  - [ ] SSL configurable per environment
  - [ ] `synchronize` forced to false in production
  - [ ] Connection pooling configured
  - [ ] Retry logic implemented

- [ ] **TypeScript Types (Low)**

  - [ ] No `as any` or `@ts-ignore` for critical configs
  - [ ] Environment variables validated at startup
  - [ ] Clear error messages for invalid configs

- [ ] **Documentation**
  - [ ] Environment variables documented
  - [ ] Deployment guide updated
  - [ ] Cloud storage setup documented
  - [ ] Troubleshooting guide created

---

## Suggested Labels

- `critical` - Multiple critical issues
- `configuration` - Config and architecture
- `deployment` - Deployment blockers
- `backend` - Backend changes needed
- `frontend` - Frontend changes needed
- `compliance` - Audit logging compliance
- `devops` - Infrastructure changes
- `production-blocker` - Cannot deploy without fixes

---

## Priority

**🔴 CRITICAL**

**Justification**:

- **File loss** on every deployment (data loss)
- **Compliance violation** (no audit logging)
- **Deployment failures** (port mismatch, database config)
- **Cannot deploy to production** safely
- **Multiple critical issues** compounding

---

## Environment

- **Branch**: All branches
- **Environment**: Affects production, staging, cloud deployments
- **Hosting**: Netlify, Vercel, Heroku, Railway, AWS, GCP, Azure
- **Database**: PostgreSQL with SSL

---

## Recommended Fix (Implementation Guidance)

### Fix 1: Migrate to Cloud Storage (AWS S3 Example)

**Step 1: Install AWS SDK**

```bash
cd apps/api
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

**Step 2: Update Storage Service**

```typescript
// apps/api/src/results/services/storage.service.ts
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly s3Client: S3Client;
  private readonly bucketName: string;

  constructor(private configService: ConfigService) {
    // ✅ Use cloud storage (persistent)
    this.s3Client = new S3Client({
      region: this.configService.get("AWS_REGION"),
      credentials: {
        accessKeyId: this.configService.get("AWS_ACCESS_KEY_ID"),
        secretAccessKey: this.configService.get("AWS_SECRET_ACCESS_KEY"),
      },
    });
    this.bucketName = this.configService.get("AWS_S3_BUCKET");
  }

  async saveFile(file: Express.Multer.File, key: string): Promise<string> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: `results/${key}`,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: "public-read", // Or 'private' with presigned URLs
      });

      await this.s3Client.send(command);

      const fileUrl = `https://${this.bucketName}.s3.amazonaws.com/results/${key}`;
      this.logger.log(`File uploaded to S3: ${fileUrl}`);

      return fileUrl;
    } catch (error) {
      this.logger.error("Failed to upload file to S3", error);
      throw new InternalServerErrorException("File upload failed");
    }
  }

  async deleteFile(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: `results/${key}`,
      });

      await this.s3Client.send(command);
      this.logger.log(`File deleted from S3: ${key}`);
    } catch (error) {
      this.logger.error("Failed to delete file from S3", error);
      throw error;
    }
  }
}
```

**Step 3: Update Environment Variables**

```env
# .env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_S3_BUCKET=your-bucket-name
```

---

### Fix 2: Fix Port and Path Mismatch

**Step 1: Update Frontend Environment**

```env
# apps/web/.env.local
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

**Step 2: Update All Frontend API Calls**

```typescript
// apps/web/src/app/(dashboard)/admin/scores/page.tsx

// ❌ Before
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8082";
const res = await fetch(`${API_URL}/results`);

// ✅ After
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
const res = await fetch(`${API_URL}/results`); // Correct: includes /api/v1
```

**Step 3: Create API Client Utility**

```typescript
// apps/web/src/lib/api-client.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_URL environment variable is not set");
}

export const apiClient = {
  baseUrl: API_BASE_URL,

  async fetch(endpoint: string, options?: RequestInit) {
    const url = `${this.baseUrl}${endpoint}`;
    return fetch(url, options);
  },
};

// Usage
const res = await apiClient.fetch("/results");
```

---

### Fix 3: Enable Audit Logging

**File**: `apps/api/src/app.module.ts`

```typescript
import { AuditInterceptor } from "./common/interceptors/audit.interceptor";

@Module({
  providers: [
    // ... other providers

    // ✅ Enable audit interceptor
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
  ],
})
export class AppModule {}
```

**Verify Audit Interceptor Exists**:

```typescript
// apps/api/src/common/interceptors/audit.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private auditService: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, user, ip } = request;

    // Log critical actions
    const criticalMethods = ["POST", "PUT", "PATCH", "DELETE"];
    if (criticalMethods.includes(method)) {
      return next.handle().pipe(
        tap(() => {
          this.auditService.log({
            user_id: user?.id,
            action: `${method} ${url}`,
            ip_address: ip,
            user_agent: request.headers["user-agent"],
            timestamp: new Date(),
          });
        })
      );
    }

    return next.handle();
  }
}
```

---

### Fix 4: Improve Database Configuration

**File**: `apps/api/src/config/database.config.ts`

```typescript
import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const getDatabaseConfig = (
  configService: ConfigService
): TypeOrmModuleOptions => {
  const isProduction = configService.get("NODE_ENV") === "production";

  // ✅ Enforce synchronize=false in production
  if (isProduction && configService.get("DB_SYNCHRONIZE") === "true") {
    throw new Error("CRITICAL: DB_SYNCHRONIZE must be false in production!");
  }

  return {
    type: "postgres",
    host: configService.get("DB_HOST"),
    port: configService.get<number>("DB_PORT"),
    username: configService.get("DB_USERNAME"),
    password: configService.get("DB_PASSWORD"),
    database: configService.get("DB_NAME"),

    // ✅ Configurable SSL per environment
    ssl:
      configService.get("DB_SSL") === "true"
        ? {
            rejectUnauthorized:
              configService.get("DB_SSL_REJECT_UNAUTHORIZED") !== "false",
          }
        : false,

    // ✅ Connection pooling
    extra: {
      max: configService.get<number>("DB_POOL_MAX") || 10,
      min: configService.get<number>("DB_POOL_MIN") || 2,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    },

    synchronize: configService.get("DB_SYNCHRONIZE") === "true",
    logging: !isProduction,
    entities: [__dirname + "/../**/*.entity{.ts,.js}"],
    migrations: [__dirname + "/../migrations/*{.ts,.js}"],
  };
};
```

**Environment Variables**:

```env
# Development
DB_SSL=false
DB_SYNCHRONIZE=true

# Production
DB_SSL=true
DB_SSL_REJECT_UNAUTHORIZED=true
DB_SYNCHRONIZE=false
DB_POOL_MAX=20
DB_POOL_MIN=5
```

---

### Fix 5: Fix TypeScript Type Issues

**File**: `apps/api/src/auth/auth.service.ts`

```typescript
// ❌ Before
const token = this.jwtService.sign(payload, {
  expiresIn: process.env.JWT_EXPIRES_IN as any,
});

// ✅ After
const expiresIn = this.configService.get<string>("JWT_EXPIRES_IN");

// Validate format
if (!expiresIn || !/^\d+[smhd]$/.test(expiresIn)) {
  throw new Error(
    "Invalid JWT_EXPIRES_IN format. Expected: 1h, 60m, 3600s, etc."
  );
}

const token = this.jwtService.sign(payload, { expiresIn });
```

**Add Startup Validation**:

```typescript
// apps/api/src/main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Validate critical environment variables at startup
  const configService = app.get(ConfigService);

  const requiredEnvVars = [
    "DB_HOST",
    "DB_PORT",
    "DB_USERNAME",
    "DB_PASSWORD",
    "DB_NAME",
    "JWT_SECRET",
    "JWT_EXPIRES_IN",
    "NEXT_PUBLIC_API_URL",
  ];

  for (const envVar of requiredEnvVars) {
    if (!configService.get(envVar)) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  }

  await app.listen(8080);
}
```

---

## Testing Checklist

- [ ] Files persist after deployment
- [ ] Frontend connects to correct port
- [ ] All API calls include `/api/v1` prefix
- [ ] Audit logs created for critical actions
- [ ] Database connects with SSL in production
- [ ] JWT tokens generated correctly
- [ ] Environment validation catches missing vars
- [ ] No TypeScript errors in build

---

## Migration Guide

### For Existing Files

```bash
# Script to migrate local files to S3
npx ts-node scripts/migrate-files-to-s3.ts
```

### For Environment Variables

```bash
# Update all environments
# Development, Staging, Production
```

---

## Related Issues

- **Static File 404** (affects file serving)
- **Orphaned Files** (cleanup needed)
- **Auth Token Desync** (configuration consistency)

---

**Issue Created**: 2025-12-29  
**Reported By**: DevOps / Architecture Review  
**Severity**: Critical - Multiple deployment blockers  
**Estimated Fix Time**: 6-8 hours (all fixes combined)  
**Testing Time**: 3-4 hours
