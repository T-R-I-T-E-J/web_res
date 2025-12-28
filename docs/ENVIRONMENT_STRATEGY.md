# Environment Strategy - Production Deployment Guide

> **Para Shooting Committee of India**  
> **Created**: 2025-12-28  
> **Status**: Production-Ready  
> **Audience**: Developers, DevOps, Beginners

---

## 📋 Table of Contents

1. [Environment Overview](#environment-overview)
2. [Environment Definitions](#environment-definitions)
3. [Environment Variables](#environment-variables)
4. [Setup Instructions](#setup-instructions)
5. [Deployment Guide](#deployment-guide)
6. [Troubleshooting](#troubleshooting)

---

## 🌍 Environment Overview

This project uses a **3-tier environment strategy** for safe deployment:

```
┌─────────────────────────────────────────────────────────┐
│  DEVELOPMENT (Local)                                    │
│  - Your laptop/computer                                 │
│  - Fast iteration and debugging                         │
│  - No real data                                         │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  PREVIEW/STAGING (Cloud)                                │
│  - Test environment in the cloud                        │
│  - Test before going live                               │
│  - Looks like production but isn't public              │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  PRODUCTION (Cloud)                                     │
│  - Live website for real users                          │
│  - Must be stable and secure                            │
│  - Real data and real users                             │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 Environment Definitions

### 1. Development Environment

**Purpose**: Local development on your computer

**Characteristics**:

- ✅ Runs on `localhost`
- ✅ Fast hot reload and debugging
- ✅ Relaxed security (for debugging)
- ✅ Fake/seed data only
- ✅ No cost (runs on your computer)

**URLs**:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8080`
- Database: `localhost:5432` (Docker)

**When to Use**:

- Writing new code
- Testing features
- Debugging issues
- Learning the codebase

**Who Uses It**: Developers only

---

### 2. Preview/Staging Environment

**Purpose**: Test in a production-like environment before going live

**Characteristics**:

- ✅ Deployed to cloud (Netlify, Railway, etc.)
- ✅ Production-like configuration
- ✅ Test data (not real users)
- ✅ Can be accessed by team for testing
- ✅ Automatic deployment from pull requests

**URLs** (Example):

- Frontend: `https://preview.psci.in` or Netlify preview URL
- Backend: `https://preview-api.psci.in`
- Database: Separate preview database

**When to Use**:

- Testing new features before launch
- Client demos
- QA testing
- Integration testing

**Who Uses It**: Developers, QA team, stakeholders

---

### 3. Production Environment

**Purpose**: Live website for real users

**Characteristics**:

- ✅ Deployed to cloud
- ✅ Strict security enabled
- ✅ Real user data
- ✅ High availability and performance
- ✅ Monitoring and alerts enabled

**URLs** (Example):

- Frontend: `https://www.psci.in`
- Backend: `https://api.psci.in`
- Database: Production database with backups

**When to Use**:

- After testing in preview
- When ready for real users
- Stable, tested code only

**Who Uses It**: Real users, public

---

## 🔧 Environment Variables

### Frontend Variables

**Location**: `apps/web/.env.example`

**Required Variables**:

| Variable                       | Development                  | Preview                            | Production                 |
| ------------------------------ | ---------------------------- | ---------------------------------- | -------------------------- |
| `NODE_ENV`                     | development                  | preview                            | production                 |
| `NEXT_PUBLIC_API_URL`          | http://localhost:8080/api/v1 | https://preview-api.psci.in/api/v1 | https://api.psci.in/api/v1 |
| `NEXT_PUBLIC_ENABLE_ANALYTICS` | false                        | false                              | true                       |
| `NEXT_PUBLIC_ENABLE_SENTRY`    | false                        | true                               | true                       |
| `NEXT_PUBLIC_DEBUG_MODE`       | true                         | false                              | false                      |

**How to Set**:

**Development**:

```bash
# Copy example file
cd apps/web
cp .env.example .env.local

# Edit .env.local with your values
# This file is gitignored (won't be committed)
```

**Preview/Production**:

```
Set in Netlify dashboard:
1. Go to Site Settings → Environment Variables
2. Add each variable
3. Deploy
```

---

### Backend Variables

**Location**: `apps/api/.env.example`

**Critical Variables** (Must be set):

| Variable      | Development           | Preview                 | Production          |
| ------------- | --------------------- | ----------------------- | ------------------- |
| `NODE_ENV`    | development           | preview                 | production          |
| `PORT`        | 8080                  | 8080                    | 8080                |
| `DB_HOST`     | localhost             | preview-db.railway.app  | prod-db.railway.app |
| `DB_PASSWORD` | psci_secure_2025      | <strong-password>       | <strong-password>   |
| `JWT_SECRET`  | dev-secret            | <random-32-chars>       | <random-32-chars>   |
| `CORS_ORIGIN` | http://localhost:3000 | https://preview.psci.in | https://www.psci.in |

**How to Generate Secrets**:

```bash
# Generate random secret (32 characters)
# On Linux/Mac:
openssl rand -hex 32

# On Windows PowerShell:
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

**How to Set**:

**Development**:

```bash
# Copy example file
cd apps/api
cp .env.example .env

# Edit .env with your values
# This file is gitignored
```

**Preview/Production**:

```
Set in Railway/Render dashboard:
1. Go to Variables tab
2. Add each variable
3. Redeploy
```

---

## 🚀 Setup Instructions

### Development Setup (First Time)

**Step 1: Clone Repository**

```bash
git clone <repository-url>
cd demowebsite
```

**Step 2: Install Dependencies**

```bash
# Install backend dependencies
cd apps/api
npm install

# Install frontend dependencies
cd ../web
npm install
```

**Step 3: Setup Environment Variables**

```bash
# Backend
cd apps/api
cp .env.example .env
# Edit .env with your local values

# Frontend
cd ../web
cp .env.example .env.local
# Edit .env.local with your local values
```

**Step 4: Start Database**

```bash
# From project root
docker-compose up -d
```

**Step 5: Start Backend**

```bash
cd apps/api
npm run start:dev
```

**Step 6: Start Frontend**

```bash
cd apps/web
npm run dev
```

**Step 7: Verify**

- Frontend: http://localhost:3000
- Backend: http://localhost:8080/api/v1/health
- Database: localhost:5432

---

### Preview Environment Setup

**Prerequisites**:

- Netlify account (for frontend)
- Railway/Render account (for backend)
- Database hosting (Railway/Supabase/Neon)

**Step 1: Deploy Database**

```
1. Create database on Railway/Supabase
2. Get connection string
3. Save for later
```

**Step 2: Deploy Backend**

```
1. Connect GitHub repo to Railway/Render
2. Select apps/api as root directory
3. Set environment variables (see table above)
4. Deploy
5. Get backend URL (e.g., https://preview-api.railway.app)
```

**Step 3: Deploy Frontend**

```
1. Connect GitHub repo to Netlify
2. Set build settings:
   - Base directory: apps/web
   - Build command: npm run build
   - Publish directory: .next
3. Set environment variables:
   - NEXT_PUBLIC_API_URL=<backend-url>/api/v1
   - NODE_ENV=preview
4. Deploy
```

**Step 4: Test**

```
Visit your Netlify preview URL
Test all features
Check browser console for errors
```

---

### Production Environment Setup

**Same as Preview, but**:

- Use production database
- Use production domain (www.psci.in)
- Set NODE_ENV=production
- Enable monitoring (Sentry)
- Enable analytics (Google Analytics)
- Use strong secrets (not the same as preview!)

---

## 📊 Environment Comparison

| Feature            | Development    | Preview         | Production         |
| ------------------ | -------------- | --------------- | ------------------ |
| **Location**       | Local computer | Cloud           | Cloud              |
| **URL**            | localhost      | preview.psci.in | www.psci.in        |
| **Database**       | Docker (local) | Cloud (preview) | Cloud (production) |
| **Data**           | Seed/fake data | Test data       | Real user data     |
| **Security**       | Relaxed        | Strict          | Strict             |
| **HTTPS**          | No (HTTP)      | Yes             | Yes                |
| **Analytics**      | Disabled       | Disabled        | Enabled            |
| **Error Tracking** | Disabled       | Enabled         | Enabled            |
| **Debug Mode**     | Enabled        | Disabled        | Disabled           |
| **Cost**           | $0             | ~$10-20/month   | ~$20-50/month      |
| **Who Accesses**   | Developers     | Team            | Public             |

---

## 🔒 Security Differences

### Development

- ❌ No HTTPS (localhost uses HTTP)
- ❌ Relaxed CSP (allows inline scripts)
- ❌ No HSTS
- ✅ CORS allows localhost
- ✅ Debug logs enabled

### Preview

- ✅ HTTPS enabled
- ✅ Strict CSP
- ✅ HSTS enabled
- ✅ CORS restricted to preview domain
- ✅ Error tracking enabled
- ❌ Debug logs disabled

### Production

- ✅ HTTPS enforced
- ✅ Strictest CSP
- ✅ HSTS with preload
- ✅ CORS restricted to production domain
- ✅ Error tracking enabled
- ✅ Analytics enabled
- ❌ Debug logs disabled
- ✅ Rate limiting enforced

---

## 🎯 Deployment Workflow

### Recommended Workflow

```
1. Developer writes code locally (Development)
   ↓
2. Create pull request on GitHub
   ↓
3. Automatic preview deployment (Preview)
   ↓
4. Team tests preview
   ↓
5. Merge to main branch
   ↓
6. Automatic production deployment (Production)
```

### Manual Deployment

**Development → Preview**:

```bash
# Push to preview branch
git push origin preview

# Preview automatically deploys
```

**Preview → Production**:

```bash
# Merge preview to main
git checkout main
git merge preview
git push origin main

# Production automatically deploys
```

---

## ⚠️ Important Safety Rules

### 1. Never Use Production Secrets in Development

❌ **WRONG**: Copy production .env to local  
✅ **CORRECT**: Use separate secrets for each environment

### 2. Never Commit .env Files

❌ **WRONG**: `git add .env`  
✅ **CORRECT**: .env files are gitignored

### 3. Always Test in Preview First

❌ **WRONG**: Deploy directly to production  
✅ **CORRECT**: Test in preview, then promote to production

### 4. Use Strong Secrets in Production

❌ **WRONG**: `JWT_SECRET=secret123`  
✅ **CORRECT**: `JWT_SECRET=<32-random-characters>`

### 5. Different Database for Each Environment

❌ **WRONG**: All environments use same database  
✅ **CORRECT**: Separate database for dev, preview, production

---

## 🔍 Troubleshooting

### Issue: Frontend can't connect to backend

**Symptom**: API calls fail, CORS errors

**Solution**:

```bash
# Check NEXT_PUBLIC_API_URL in frontend
echo $NEXT_PUBLIC_API_URL

# Should match backend URL
# Development: http://localhost:8080/api/v1
# Preview: https://preview-api.psci.in/api/v1
# Production: https://api.psci.in/api/v1
```

---

### Issue: Database connection fails

**Symptom**: Backend can't start, database errors

**Solution**:

```bash
# Check database environment variables
echo $DB_HOST
echo $DB_PORT
echo $DB_USERNAME
echo $DB_DATABASE

# Test database connection
psql -h $DB_HOST -U $DB_USERNAME -d $DB_DATABASE
```

---

### Issue: CORS errors in browser

**Symptom**: "CORS policy blocked" in console

**Solution**:

```bash
# Check CORS_ORIGIN in backend matches frontend URL
# Backend .env:
CORS_ORIGIN=http://localhost:3000  # Development
CORS_ORIGIN=https://preview.psci.in  # Preview
CORS_ORIGIN=https://www.psci.in  # Production
```

---

### Issue: Environment variables not loading

**Symptom**: Variables are undefined

**Solution**:

```bash
# Frontend: Variables must start with NEXT_PUBLIC_
# ❌ WRONG: API_URL=...
# ✅ CORRECT: NEXT_PUBLIC_API_URL=...

# Backend: Restart server after changing .env
npm run start:dev
```

---

## 📝 Checklist Before Production

### Backend

- [ ] All secrets are strong and unique
- [ ] Database backups configured
- [ ] CORS_ORIGIN set to production domain
- [ ] NODE_ENV=production
- [ ] Error tracking enabled (Sentry)
- [ ] Rate limiting configured
- [ ] HTTPS enforced

### Frontend

- [ ] NEXT_PUBLIC_API_URL points to production backend
- [ ] Analytics enabled
- [ ] Error tracking enabled
- [ ] Debug mode disabled
- [ ] NODE_ENV=production

### Database

- [ ] Production database separate from preview
- [ ] Backups enabled (daily minimum)
- [ ] Strong password set
- [ ] Connection pooling configured

### Infrastructure

- [ ] Domain configured (www.psci.in)
- [ ] SSL certificate active
- [ ] DNS records correct
- [ ] Monitoring enabled

---

## 🎉 Summary

**3 Environments**:

1. **Development**: Local, fast, for coding
2. **Preview**: Cloud, for testing
3. **Production**: Cloud, for real users

**Key Points**:

- ✅ Use different secrets for each environment
- ✅ Never commit .env files
- ✅ Test in preview before production
- ✅ Use strong secrets in production
- ✅ Separate databases for each environment

**Next Steps**:

1. Set up development environment
2. Deploy to preview
3. Test thoroughly
4. Deploy to production
5. Monitor and maintain

---

**Questions?** Check the troubleshooting section or ask your team lead.

**Ready to deploy?** Follow the deployment guide step by step.

**Need help?** Review this document - it's written for beginners!

---

**Document Owner**: DevOps Team  
**Last Updated**: 2025-12-28  
**Next Review**: Before production launch
