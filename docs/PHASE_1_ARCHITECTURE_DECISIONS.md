# Phase 1 - Architecture Decisions Summary

> **Para Shooting Committee of India - Production Architecture**  
> **Date**: 2025-12-28  
> **Status**: Partially Defined - Decisions Required

---

## ✅ Confirmed Architecture Decisions

### 1. PDF Management Strategy

**Decision**: File System Storage with Admin-Only Upload

**Details**:

- **Storage Location**: `results/` directory in project root
- **Upload Access**: Admin role only (via RBAC)
- **Public Access**: Read-only view/download for all users
- **File Format**: PDF only, no inline editing
- **File Size Limit**: 10MB (recommended)
- **Validation**: File type and size validation on upload

**Rationale**:

- Simple implementation for Phase 1
- No external dependencies
- Meets current requirements
- Can migrate to cloud storage later if needed

**Implementation Status**:

- ✅ Public viewing implemented
- ❌ Admin upload endpoint not implemented
- ❌ Role-based upload guard not implemented

---

### 2. Authentication & Authorization

**Decision**: JWT + Role-Based Access Control (RBAC)

**Details**:

- **Authentication Method**: JWT tokens
- **Token Expiry**: 7 days (access), 30 days (refresh)
- **Authorization Model**: Role-Based Access Control (RBAC)
- **Roles**: admin, official, scorer, shooter, viewer
- **Permissions**: Fine-grained permissions per role
- **Audit**: All actions logged to `audit_logs` table

**Rationale**:

- Industry standard approach
- Scalable and flexible
- Supports future permission changes
- Audit trail for compliance

**Implementation Status**:

- ✅ JWT authentication implemented
- ✅ RBAC system implemented
- ✅ Permissions system implemented
- ✅ Audit logging implemented

---

### 3. Database Architecture

**Decision**: PostgreSQL with TypeORM

**Details**:

- **Database**: PostgreSQL 16
- **ORM**: TypeORM
- **Schema Design**: Normalized with audit trails
- **Primary Keys**: BIGSERIAL + UUID pattern
- **Timestamps**: All tables have created_at, updated_at
- **Soft Deletes**: Implemented where needed
- **Audit Logs**: Separate audit_logs table

**Rationale**:

- PostgreSQL is robust and feature-rich
- TypeORM provides type safety
- Schema follows best practices
- Audit trail for compliance

**Implementation Status**:

- ✅ Database schema implemented
- ✅ Migrations in place
- ✅ TypeORM entities created
- ✅ Audit logging active

---

### 4. Technology Stack

**Decision**: Next.js + NestJS + PostgreSQL

**Frontend**:

- Framework: Next.js 16 (App Router)
- UI Library: React 19
- Language: TypeScript
- Styling: Tailwind CSS
- State Management: React hooks

**Backend**:

- Framework: NestJS 11
- Language: TypeScript
- ORM: TypeORM
- Validation: class-validator
- Security: Passport, JWT

**Database**:

- Engine: PostgreSQL 16
- Hosting: TBD (see pending decisions)

**Rationale**:

- Modern, type-safe stack
- Excellent developer experience
- Strong ecosystem and community
- Production-ready frameworks

**Implementation Status**:

- ✅ Frontend stack implemented
- ✅ Backend stack implemented
- ✅ Database configured
- ✅ Development environment working

---

### 5. Security Approach

**Decision**: Defense in Depth

**Layers**:

1. **Authentication**: JWT tokens
2. **Authorization**: RBAC + Permissions
3. **Rate Limiting**: 100 req/min global, custom per endpoint
4. **Audit Logging**: All actions tracked
5. **Input Validation**: class-validator on all DTOs
6. **SQL Injection Prevention**: Parameterized queries (TypeORM)
7. **CORS**: Configured for frontend origin only

**Pending** (Phase 1 requirements):

- ❌ Security headers (Helmet)
- ❌ HTTPS enforcement
- ❌ CSP policy
- ❌ HSTS headers

**Rationale**:

- Multiple layers of security
- Industry best practices
- Compliance-ready
- Audit trail for incidents

**Implementation Status**:

- ✅ Authentication implemented
- ✅ Authorization implemented
- ✅ Rate limiting implemented
- ✅ Audit logging implemented
- ✅ Input validation implemented
- ❌ Security headers not implemented
- ❌ HTTPS not enforced

---

## ❌ Pending Architecture Decisions

### 1. Backend Hosting Provider

**Status**: Not Decided  
**Priority**: P1 - High  
**Required By**: Week 2

**Options**:

| Provider          | Pros                                 | Cons               | Est. Cost/Month |
| ----------------- | ------------------------------------ | ------------------ | --------------- |
| **Railway**       | Easy deployment, PostgreSQL included | Limited free tier  | ₹1,500-3,000    |
| **Render**        | Free tier available, auto-deploy     | Slower cold starts | ₹0-2,000        |
| **AWS (EC2+RDS)** | Full control, scalable               | Complex setup      | ₹5,000-10,000   |
| **Azure**         | Good for enterprises                 | Complex pricing    | ₹5,000-10,000   |
| **Fly.io**        | Global edge deployment               | Newer platform     | ₹1,000-2,500    |

**Recommendation**: Railway or Render for Phase 1

- Railway: Best for production-ready deployment
- Render: Best for cost-conscious deployment

**Decision Required**: Choose provider by end of Week 1

---

### 2. Database Hosting Provider

**Status**: Not Decided  
**Priority**: P1 - High  
**Required By**: Week 2

**Options**:

| Provider     | Pros                        | Cons               | Est. Cost/Month |
| ------------ | --------------------------- | ------------------ | --------------- |
| **Supabase** | PostgreSQL + auth + storage | Vendor lock-in     | ₹0-2,000        |
| **Neon**     | Serverless PostgreSQL       | Newer platform     | ₹0-1,500        |
| **Railway**  | Bundled with backend        | Limited to Railway | ₹1,000-2,000    |
| **AWS RDS**  | Fully managed, scalable     | Complex, expensive | ₹3,000-8,000    |
| **Render**   | Bundled with backend        | Limited features   | ₹0-1,500        |

**Recommendation**: Supabase or Neon for Phase 1

- Supabase: Best for feature-rich deployment
- Neon: Best for cost-effective deployment

**Decision Required**: Choose provider by end of Week 1

---

### 3. File Storage Strategy

**Status**: Not Decided  
**Priority**: P2 - Medium  
**Required By**: Week 3-4

**Current**: File system storage (not scalable)

**Options**:

| Provider             | Pros                          | Cons           | Est. Cost/Month |
| -------------------- | ----------------------------- | -------------- | --------------- |
| **AWS S3**           | Industry standard, reliable   | Complex setup  | ₹500-2,000      |
| **Cloudflare R2**    | S3-compatible, no egress fees | Newer service  | ₹200-1,000      |
| **Supabase Storage** | Integrated with Supabase      | Vendor lock-in | ₹0-500          |
| **File System**      | Simple, no cost               | Not scalable   | ₹0              |

**Recommendation**:

- **Phase 1**: Continue with file system (acceptable for launch)
- **Phase 2**: Migrate to Cloudflare R2 or Supabase Storage

**Decision Required**: Choose provider by Week 3

---

### 4. Domain & SSL Strategy

**Status**: Partially Decided  
**Priority**: P1 - High  
**Required By**: Week 2

**Domain**:

- **Option 1**: psci.in (if available)
- **Option 2**: parashootingindia.in
- **Option 3**: parashootingcommittee.in

**SSL Certificate**:

- **Recommendation**: Let's Encrypt (free, auto-renewing)
- **Alternative**: Cloudflare SSL (free with Cloudflare)

**Decision Required**:

- Confirm domain name by end of Week 1
- SSL will use Let's Encrypt (no decision needed)

---

## Environment Strategy

### Minimum 2-Environment Setup

**Environment 1: Production**

- **Purpose**: Live system for real users
- **URL**: `https://www.psci.in` (or chosen domain)
- **Backend**: `https://api.psci.in`
- **Database**: Managed PostgreSQL (production instance)
- **Deployment**: Manual or CI/CD
- **Data**: Real user data

**Environment 2: Preview (Netlify)**

- **Purpose**: Testing before production
- **URL**: Auto-generated Netlify preview URLs
- **Backend**: Preview backend instance
- **Database**: Separate preview database
- **Deployment**: Automatic on PR creation
- **Data**: Test data only

**Optional: Development (Local)**

- **Purpose**: Local development
- **URL**: `http://localhost:3000` (frontend), `http://localhost:8080` (backend)
- **Database**: Docker PostgreSQL
- **Deployment**: Not applicable
- **Data**: Seed data

---

## Required Environment Variables

### Backend Production Variables

**Critical** (must be set):

```bash
NODE_ENV=production
PORT=8080
API_PREFIX=api/v1
APP_URL=https://api.psci.in
FRONTEND_URL=https://www.psci.in

# Database
DB_HOST=<managed-db-host>
DB_PORT=5432
DB_USERNAME=<db-user>
DB_PASSWORD=<secure-password>
DB_DATABASE=psci_platform

# Security
JWT_SECRET=<generate-32-char-random>
JWT_REFRESH_SECRET=<generate-32-char-random>
SESSION_SECRET=<generate-32-char-random>
COOKIE_SECRET=<generate-32-char-random>

# CORS
CORS_ORIGIN=https://www.psci.in
```

**Optional** (can be added later):

```bash
# Email
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=<key>

# Monitoring
SENTRY_DSN=<dsn>
LOG_LEVEL=info

# File Storage (if using cloud)
AWS_S3_BUCKET=<bucket>
AWS_ACCESS_KEY_ID=<key>
AWS_SECRET_ACCESS_KEY=<secret>
```

### Frontend Production Variables

**Critical** (must be set):

```bash
NEXT_PUBLIC_API_URL=https://api.psci.in/api/v1
NODE_ENV=production
NEXT_PUBLIC_ENV=production
```

**Optional**:

```bash
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=<id>
NEXT_PUBLIC_SENTRY_DSN=<dsn>
```

---

## Deployment Strategy

### Frontend (Next.js)

**Platform**: Netlify (already configured)

**Configuration**:

```toml
# netlify.toml (exists)
[build]
  base = "apps/web"
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

**Environment Variables**: Set in Netlify dashboard

**Deployment**:

- **Production**: Push to `main` branch
- **Preview**: Automatic on PR creation

---

### Backend (NestJS)

**Platform**: TBD (Railway or Render recommended)

**Build Command**: `npm run build`  
**Start Command**: `npm run start:prod`  
**Port**: 8080

**Environment Variables**: Set in hosting platform dashboard

**Deployment**:

- **Production**: Push to `main` branch or manual deploy
- **Preview**: Separate preview instance

---

### Database (PostgreSQL)

**Platform**: TBD (Supabase or Neon recommended)

**Configuration**:

- **Version**: PostgreSQL 16
- **Backup**: Daily automated backups
- **Retention**: 7 days minimum

**Migrations**: Manual execution via SQL scripts

---

## Security Headers Configuration

### Backend (Helmet)

**Required Package**: `helmet`

**Configuration**:

```typescript
// apps/api/src/main.ts
import helmet from "helmet";

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    frameguard: { action: "deny" },
    noSniff: true,
    xssFilter: true,
  })
);
```

---

### Frontend (Next.js Headers)

**Configuration**:

```typescript
// apps/web/next.config.ts
const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};
```

---

## Next Steps

### Week 1: Critical Decisions

1. ✅ Review this architecture summary
2. ❌ Choose backend hosting provider
3. ❌ Choose database hosting provider
4. ❌ Confirm domain name
5. ❌ Create environment variable templates

### Week 2: Implementation

1. ❌ Set up production infrastructure
2. ❌ Configure environment variables
3. ❌ Implement security headers
4. ❌ Deploy to preview environment
5. ❌ Test end-to-end

### Week 3: Launch

1. ❌ Deploy to production
2. ❌ Run security audit
3. ❌ Performance testing
4. ❌ Go live

---

**Document Owner**: Senior Full-Stack Technical Lead  
**Last Updated**: 2025-12-28  
**Next Review**: After infrastructure decisions
