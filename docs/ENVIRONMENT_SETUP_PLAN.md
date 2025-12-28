# Environment Setup & Compliance Roadmap

> Para Shooting Committee of India - Production Readiness Plan
> Version: 1.0 | Created: December 2025

---

## Table of Contents

1. [Environment Strategy](#environment-strategy)
2. [Missing Environment Variables](#missing-environment-variables)
3. [Compliance Gaps](#compliance-gaps)
4. [Implementation Roadmap](#implementation-roadmap)

---

## Environment Strategy

### Recommended: 3-Tier Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  DEVELOPMENT (Local)                                        │
├─────────────────────────────────────────────────────────────┤
│  Purpose: Feature development, unit testing                │
│  Infrastructure: Docker Compose                             │
│  Database: PostgreSQL (Docker)                              │
│  URL: http://localhost:3000                                 │
│  Data: Seed data only                                       │
│  Cost: $0/month                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  STAGING (Cloud)                                            │
├─────────────────────────────────────────────────────────────┤
│  Purpose: Integration testing, UAT, client demos           │
│  Infrastructure: AWS/Azure/GCP                              │
│  Database: Managed PostgreSQL (RDS/Cloud SQL)               │
│  URL: https://staging.psci.in                               │
│  Data: Anonymized production data                           │
│  Cost: ~₹5,000-10,000/month                                 │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  PRODUCTION (Cloud)                                         │
├─────────────────────────────────────────────────────────────┤
│  Purpose: Live system for real users                       │
│  Infrastructure: AWS/Azure/GCP (multi-AZ)                   │
│  Database: Managed PostgreSQL with replicas                 │
│  URL: https://www.psci.in                                   │
│  Data: Real user data                                       │
│  Cost: ~₹15,000-30,000/month                                │
└─────────────────────────────────────────────────────────────┘
```

---

## Missing Environment Variables

### Priority 1: Critical (Required for Production)

Create `.env.staging` and `.env.production` with these additional variables:

```bash
# Application URLs
APP_URL=https://api.psci.in
FRONTEND_URL=https://www.psci.in

# Security
SESSION_SECRET=<generate-with-openssl-rand-hex-32>
ENCRYPTION_KEY=<generate-with-openssl-rand-hex-32>
COOKIE_SECRET=<generate-with-openssl-rand-hex-32>

# SSL/TLS
SSL_CERT_PATH=/etc/ssl/certs/psci.crt
SSL_KEY_PATH=/etc/ssl/private/psci.key

# Rate Limiting
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_SKIP_SUCCESSFUL_REQUESTS=false

# File Upload
MAX_FILE_SIZE=10485760  # 10MB in bytes
ALLOWED_FILE_TYPES=image/jpeg,image/png,application/pdf

# Session
SESSION_TIMEOUT=3600000  # 1 hour in ms
SESSION_ABSOLUTE_TIMEOUT=86400000  # 24 hours in ms
```

### Priority 2: File Storage (Required for Document Uploads)

```bash
# AWS S3 Configuration
AWS_REGION=ap-south-1  # Mumbai region
AWS_S3_BUCKET=psci-platform-uploads
AWS_ACCESS_KEY_ID=<your-aws-access-key>
AWS_SECRET_ACCESS_KEY=<your-aws-secret-key>
AWS_S3_ENDPOINT=https://s3.ap-south-1.amazonaws.com

# Or use Cloudflare R2 (cheaper alternative)
R2_ACCOUNT_ID=<your-r2-account-id>
R2_ACCESS_KEY_ID=<your-r2-access-key>
R2_SECRET_ACCESS_KEY=<your-r2-secret-key>
R2_BUCKET=psci-uploads
```

### Priority 3: Caching & Performance

```bash
# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=<your-redis-password>
REDIS_DB=0
REDIS_TTL=3600  # 1 hour default TTL

# Cache Settings
CACHE_ENABLED=true
CACHE_TTL_SHORT=300  # 5 minutes
CACHE_TTL_MEDIUM=1800  # 30 minutes
CACHE_TTL_LONG=3600  # 1 hour
```

### Priority 4: Monitoring & Observability

```bash
# Error Tracking (Sentry)
SENTRY_DSN=https://<key>@sentry.io/<project>
SENTRY_ENVIRONMENT=production
SENTRY_TRACES_SAMPLE_RATE=0.1  # 10% of transactions

# Logging
LOG_LEVEL=info  # debug in dev, info in staging, warn in prod
LOG_FORMAT=json  # json for production, pretty for dev
LOG_FILE_PATH=/var/log/psci/app.log
LOG_MAX_FILES=30  # Keep 30 days of logs

# APM (Application Performance Monitoring)
NEW_RELIC_LICENSE_KEY=<your-new-relic-key>
NEW_RELIC_APP_NAME=PSCI Platform - Production
```

### Priority 5: Email & Notifications

```bash
# Production Email (SendGrid/AWS SES)
EMAIL_PROVIDER=sendgrid  # or 'ses', 'smtp'
SENDGRID_API_KEY=<your-sendgrid-api-key>
EMAIL_FROM=noreply@psci.in
EMAIL_FROM_NAME=Para Shooting Committee of India

# AWS SES (Alternative)
AWS_SES_REGION=ap-south-1
AWS_SES_ACCESS_KEY=<your-ses-access-key>
AWS_SES_SECRET_KEY=<your-ses-secret-key>

# SMS Notifications (Optional)
SMS_PROVIDER=twilio  # or 'msg91'
TWILIO_ACCOUNT_SID=<your-twilio-sid>
TWILIO_AUTH_TOKEN=<your-twilio-token>
TWILIO_PHONE_NUMBER=+91XXXXXXXXXX
```

---

## Compliance Gaps

### 1. Data Protection (GDPR/DPDP Act 2023)

#### Missing Features:

**A. Consent Management**

```typescript
// Need to implement:
- Cookie consent banner
- Terms acceptance tracking
- Privacy policy acceptance
- Marketing consent opt-in/out
- Consent withdrawal mechanism
```

**B. Data Encryption**

```typescript
// Encrypt these fields in database:
- users.aadhaar_number
- users.pan_number
- shooters.medical_records
- payments.card_details (if stored)
- users.phone (optional)
- users.email (optional)
```

**C. User Rights APIs**

```typescript
// Implement these endpoints:
POST /api/v1/gdpr/export-my-data
POST /api/v1/gdpr/delete-my-data
POST /api/v1/gdpr/anonymize-my-data
GET  /api/v1/gdpr/my-consents
PUT  /api/v1/gdpr/update-consent
```

### 2. Security Hardening

#### A. Security Headers (Add to NestJS)

```typescript
// helmet.config.ts
export const helmetConfig = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "https://api.psci.in"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  frameguard: {
    action: "deny",
  },
  noSniff: true,
  xssFilter: true,
};
```

#### B. Rate Limiting (Add to NestJS)

```typescript
// rate-limit.config.ts
import { ThrottlerModule } from '@nestjs/throttler';

ThrottlerModule.forRoot({
  ttl: 60,  // Time window in seconds
  limit: 100,  // Max requests per window
  ignoreUserAgents: [/googlebot/i, /bingbot/i],
});

// Stricter limits for sensitive endpoints
@Throttle(5, 60)  // 5 requests per minute
@Post('auth/login')
async login() { ... }

@Throttle(3, 3600)  // 3 requests per hour
@Post('auth/forgot-password')
async forgotPassword() { ... }
```

### 3. Operational Requirements

#### A. Backup Strategy

```yaml
# backup-config.yml
database:
  frequency: daily
  time: "02:00 UTC" # 7:30 AM IST
  retention:
    daily: 7 days
    weekly: 4 weeks
    monthly: 12 months
  encryption: AES-256
  storage:
    primary: AWS S3
    secondary: Google Cloud Storage (geo-redundant)

files:
  frequency: hourly
  retention: 30 days
  storage: AWS S3 with versioning
```

#### B. Monitoring Setup

```yaml
# monitoring-config.yml
uptime:
  provider: UptimeRobot
  checks:
    - name: API Health
      url: https://api.psci.in/api/v1/health
      interval: 5 minutes
    - name: Frontend
      url: https://www.psci.in
      interval: 5 minutes
    - name: Database
      type: port
      port: 5432
      interval: 5 minutes

alerts:
  channels:
    - email: devops@psci.in
    - slack: #alerts
    - sms: +91XXXXXXXXXX (for critical only)

  thresholds:
    response_time: 2000ms
    error_rate: 1%
    uptime: 99.9%
```

---

## Implementation Roadmap

### Week 1-2: Environment Setup

**Tasks:**

1. [ ] Create staging environment on cloud provider
2. [ ] Set up managed PostgreSQL database
3. [ ] Configure environment-specific `.env` files
4. [ ] Set up CI/CD pipeline (GitHub Actions)
5. [ ] Configure domain and SSL certificates
6. [ ] Test deployment to staging

**Deliverables:**

- Staging environment live at https://staging.psci.in
- Automated deployment pipeline
- Environment variables documented

---

### Week 3-4: Security Hardening

**Tasks:**

1. [ ] Implement field-level encryption for PII
2. [ ] Add security headers (Helmet)
3. [ ] Implement rate limiting
4. [ ] Set up WAF (Cloudflare or AWS WAF)
5. [ ] Configure HTTPS redirect
6. [ ] Run security audit (npm audit, Snyk)

**Deliverables:**

- Security headers implemented
- Rate limiting active
- Encryption for sensitive fields
- Security audit report

---

### Week 5-6: Compliance Features

**Tasks:**

1. [ ] Implement GDPR consent management
2. [ ] Create user data export API
3. [ ] Create user data deletion API
4. [ ] Add privacy policy and terms of service
5. [ ] Implement cookie consent banner
6. [ ] Create compliance documentation

**Deliverables:**

- GDPR-compliant user rights APIs
- Legal documents (Privacy Policy, ToS)
- Consent management system

---

### Week 7-8: Monitoring & Operations

**Tasks:**

1. [ ] Set up error tracking (Sentry)
2. [ ] Configure uptime monitoring
3. [ ] Implement automated backups
4. [ ] Create disaster recovery plan
5. [ ] Set up log aggregation
6. [ ] Configure alerting system

**Deliverables:**

- Monitoring dashboards
- Automated backup system
- Incident response plan
- Alerting configured

---

### Week 9-10: Testing & Launch

**Tasks:**

1. [ ] Load testing (Artillery, k6)
2. [ ] Security penetration testing
3. [ ] UAT with stakeholders
4. [ ] Performance optimization
5. [ ] Final compliance review
6. [ ] Production deployment

**Deliverables:**

- Load test report
- Security audit report
- Production environment live
- Launch announcement

---

## Cost Estimation

### Monthly Operational Costs (India)

| Service            | Provider                  | Staging    | Production  | Notes                    |
| ------------------ | ------------------------- | ---------- | ----------- | ------------------------ |
| **Compute**        | AWS EC2 t3.medium         | ₹2,500     | ₹5,000      | 2 instances for HA       |
| **Database**       | AWS RDS PostgreSQL        | ₹3,000     | ₹8,000      | db.t3.medium with backup |
| **Storage**        | AWS S3                    | ₹500       | ₹2,000      | 100GB uploads            |
| **CDN**            | Cloudflare                | ₹0         | ₹0          | Free tier                |
| **Email**          | SendGrid                  | ₹0         | ₹1,500      | 40k emails/month         |
| **Monitoring**     | Sentry + UptimeRobot      | ₹0         | ₹1,000      | Free tiers               |
| **Domain & SSL**   | Namecheap + Let's Encrypt | ₹0         | ₹500        | Annual ₹6,000            |
| **Backup Storage** | AWS S3 Glacier            | ₹200       | ₹1,000      | Long-term retention      |
| **Total**          |                           | **₹6,200** | **₹19,000** | Per month                |

### One-Time Costs

| Item                       | Cost        | Notes                        |
| -------------------------- | ----------- | ---------------------------- |
| Security Audit             | ₹50,000     | Annual penetration testing   |
| Legal Compliance           | ₹30,000     | Privacy policy, ToS drafting |
| SSL Certificate (optional) | ₹10,000     | If not using Let's Encrypt   |
| **Total**                  | **₹90,000** | First year only              |

---

## Next Steps

1. **Decision Required**: Choose cloud provider (AWS, Azure, or GCP)
2. **Budget Approval**: Get approval for monthly operational costs
3. **Team Assignment**: Assign DevOps engineer for infrastructure
4. **Timeline Confirmation**: Confirm 10-week timeline for production launch

---

**Document Owner**: DevOps Team  
**Last Updated**: 2025-12-28  
**Review Frequency**: Monthly
