# Complete Deployment Guide - Para Shooting Committee of India

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Prerequisites](#prerequisites)
4. [Local Development Setup](#local-development-setup)
5. [Production Deployment](#production-deployment)
6. [Environment Variables](#environment-variables)
7. [Database Setup](#database-setup)
8. [Troubleshooting](#troubleshooting)

---

## Overview

This guide covers deploying the Para Shooting Committee of India full-stack application, which consists of:

- **Frontend**: Next.js 14 (App Router)
- **Backend**: NestJS API
- **Database**: PostgreSQL
- **File Storage**: Local filesystem (development) / Cloud storage (production)

---

## Architecture

```
┌─────────────────┐
│   Vercel        │
│   (Frontend)    │
│   Next.js App   │
└────────┬────────┘
         │
         │ API Calls
         ▼
┌─────────────────┐
│   Render/       │
│   Railway       │
│   (Backend)     │
│   NestJS API    │
└────────┬────────┘
         │
         │ Database
         ▼
┌─────────────────┐
│   PostgreSQL    │
│   (Database)    │
└─────────────────┘
```

---

## Prerequisites

### Required Accounts

1. **Vercel Account** (for frontend hosting)
   - Sign up at https://vercel.com
2. **Render Account** (for backend hosting - recommended)
   - Sign up at https://render.com
   - Alternative: Railway (https://railway.app)

3. **Database Provider** (choose one)
   - Render PostgreSQL (free tier available)
   - Neon (https://neon.tech)
   - Supabase (https://supabase.com)

### Required Tools

- Node.js 18+
- npm or yarn
- Git
- Docker (for local development)

---

## Local Development Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd demowebsite

# Install dependencies for backend
cd apps/api
npm install

# Install dependencies for frontend
cd ../web
npm install
```

### 2. Start Database (Docker)

```bash
# From project root
docker compose up -d
```

This starts:

- PostgreSQL on port 5432
- Redis on port 6379
- PgAdmin on port 8081

### 3. Configure Environment Variables

**Backend (`apps/api/.env`):**

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=admin
DB_PASSWORD=admin123
DB_DATABASE=psci_platform
DB_SYNCHRONIZE=true

# Server
PORT=4000
NODE_ENV=development
API_PREFIX=api/v1

# CORS
CORS_ORIGIN=http://localhost:3000

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
JWT_REFRESH_EXPIRES_IN=30d

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760

# Rate Limiting
THROTTLE_TTL=60
THROTTLE_LIMIT=100
```

**Frontend (`apps/web/.env.local`):**

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
API_URL=http://localhost:4000

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Para Shooting Committee of India
```

### 4. Start Development Servers

**Terminal 1 - Backend:**

```bash
cd apps/api
npm run start:dev
```

**Terminal 2 - Frontend:**

```bash
cd apps/web
npm run dev
```

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000/api/v1
- **API Health**: http://localhost:4000/api/v1/health
- **PgAdmin**: http://localhost:8081

### 6. Create Admin User

```bash
# From apps/api directory
npm run seed:admin
```

Or manually via SQL:

```sql
-- Connect to database
docker exec -it psci_postgres psql -U admin -d psci_platform

-- Create admin user (password: admin123)
INSERT INTO users (email, password_hash, first_name, last_name, is_active)
VALUES ('admin@psci.in', '$2b$10$YourHashedPasswordHere', 'Admin', 'User', true);

-- Get user ID
SELECT id FROM users WHERE email = 'admin@psci.in';

-- Assign admin role (assuming role id 1 is admin)
INSERT INTO user_roles (user_id, role_id)
VALUES (<user_id_from_above>, 1);
```

---

## Production Deployment

### Step 1: Deploy Database

#### Option A: Render PostgreSQL (Recommended)

1. Go to https://dashboard.render.com
2. Click "New" → "PostgreSQL"
3. Configure:
   - **Name**: `psci-database`
   - **Database**: `psci_platform`
   - **User**: `psci_admin`
   - **Region**: Choose closest to your users
   - **Plan**: Free (or paid for production)
4. Click "Create Database"
5. **Save the connection details**:
   - Internal Database URL
   - External Database URL
   - PSQL Command

#### Option B: Neon PostgreSQL

1. Go to https://console.neon.tech
2. Create new project
3. Copy connection string
4. Enable connection pooling

### Step 2: Initialize Database Schema

```bash
# Connect to production database
psql "<your-production-database-url>"

# Run initialization script
\i infrastructure/database/01-init.sql

# Verify tables created
\dt
```

### Step 3: Deploy Backend API

#### Using Render

1. Go to https://dashboard.render.com
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `psci-api`
   - **Root Directory**: `apps/api`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start:prod`
   - **Plan**: Free (or paid)

5. **Add Environment Variables**:

```env
# Database (from Step 1)
DATABASE_URL=<your-render-postgres-url>
DB_HOST=<extracted-from-database-url>
DB_PORT=5432
DB_USERNAME=<your-db-username>
DB_PASSWORD=<your-db-password>
DB_DATABASE=psci_platform
DB_SYNCHRONIZE=false
RUN_MIGRATIONS=false

# Server
PORT=4000
NODE_ENV=production
API_PREFIX=api/v1

# CORS (your Vercel frontend URL)
CORS_ORIGIN=https://your-app.vercel.app

# JWT (CHANGE THESE!)
JWT_SECRET=<generate-strong-secret-key>
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=<generate-strong-refresh-key>
JWT_REFRESH_EXPIRES_IN=30d

# File Upload
UPLOAD_DIR=/var/data/uploads
MAX_FILE_SIZE=10485760

# Rate Limiting
THROTTLE_TTL=60
THROTTLE_LIMIT=100

# Security
BCRYPT_ROUNDS=12
```

6. Click "Create Web Service"
7. Wait for deployment to complete
8. **Save your backend URL**: `https://psci-api.onrender.com`

#### Using Railway

1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Add a new service for the API
5. Configure root directory: `apps/api`
6. Add environment variables (same as Render above)
7. Deploy

### Step 4: Deploy Frontend

#### Using Vercel

1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/web`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

5. **Add Environment Variables**:

```env
# API Configuration (from Step 3)
API_URL=https://psci-api.onrender.com
NEXT_PUBLIC_API_URL=https://psci-api.onrender.com/api/v1

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
NEXT_PUBLIC_SITE_NAME=Para Shooting Committee of India
```

6. Click "Deploy"
7. Wait for deployment to complete
8. **Your app is live!** Visit the URL provided by Vercel

### Step 5: Configure Custom Domain (Optional)

#### On Vercel:

1. Go to Project Settings → Domains
2. Add your custom domain (e.g., `parashootingindia.org`)
3. Follow DNS configuration instructions

#### On Render:

1. Go to your API service → Settings → Custom Domain
2. Add your API subdomain (e.g., `api.parashootingindia.org`)
3. Update DNS records

### Step 6: Update CORS Settings

After deploying, update the backend CORS_ORIGIN:

**On Render:**

1. Go to your API service
2. Environment → Edit
3. Update `CORS_ORIGIN` to your Vercel domain
4. Save and redeploy

### Step 7: Create Admin User in Production

```bash
# Connect to production database
psql "<your-production-database-url>"

# Create admin user
INSERT INTO users (email, password_hash, first_name, last_name, is_active)
VALUES ('admin@psci.in', '$2b$12$<bcrypt-hash>', 'Admin', 'User', true);

# Create admin role if not exists
INSERT INTO roles (name, display_name, description, is_system, level)
VALUES ('admin', 'Administrator', 'Full system access', true, 100)
ON CONFLICT (name) DO NOTHING;

# Assign admin role
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u, roles r
WHERE u.email = 'admin@psci.in' AND r.name = 'admin';
```

To generate bcrypt hash:

```bash
# Using Node.js
node -e "console.log(require('bcrypt').hashSync('your-password', 12))"
```

### Step 8: Upload Results Data

1. Go to `https://your-app.vercel.app/admin/login`
2. Login with admin credentials
3. Navigate to `/admin/scores`
4. Upload your PDF result files:
   - WSPS Rulebook 2022-2024
   - 2025 National Selection Policy
   - Asian Para Games 2024 Results

---

## Environment Variables

### Backend Environment Variables

| Variable                 | Description                       | Example                               | Required         |
| ------------------------ | --------------------------------- | ------------------------------------- | ---------------- |
| `DATABASE_URL`           | Full PostgreSQL connection string | `postgresql://user:pass@host:5432/db` | Yes (Production) |
| `DB_HOST`                | Database host                     | `localhost`                           | Yes (Dev)        |
| `DB_PORT`                | Database port                     | `5432`                                | Yes              |
| `DB_USERNAME`            | Database username                 | `admin`                               | Yes              |
| `DB_PASSWORD`            | Database password                 | `admin123`                            | Yes              |
| `DB_DATABASE`            | Database name                     | `psci_platform`                       | Yes              |
| `DB_SYNCHRONIZE`         | Auto-sync schema (dev only!)      | `false`                               | Yes              |
| `PORT`                   | API server port                   | `4000`                                | Yes              |
| `NODE_ENV`               | Environment                       | `production`                          | Yes              |
| `API_PREFIX`             | API route prefix                  | `api/v1`                              | Yes              |
| `CORS_ORIGIN`            | Allowed frontend origin           | `https://app.vercel.app`              | Yes              |
| `JWT_SECRET`             | JWT signing secret                | `<random-string>`                     | Yes              |
| `JWT_EXPIRES_IN`         | JWT expiration                    | `7d`                                  | Yes              |
| `JWT_REFRESH_SECRET`     | Refresh token secret              | `<random-string>`                     | Yes              |
| `JWT_REFRESH_EXPIRES_IN` | Refresh expiration                | `30d`                                 | Yes              |
| `UPLOAD_DIR`             | File upload directory             | `/var/data/uploads`                   | Yes              |
| `MAX_FILE_SIZE`          | Max upload size (bytes)           | `10485760`                            | Yes              |
| `THROTTLE_TTL`           | Rate limit window (seconds)       | `60`                                  | No               |
| `THROTTLE_LIMIT`         | Max requests per window           | `100`                                 | No               |
| `BCRYPT_ROUNDS`          | Password hashing rounds           | `12`                                  | No               |

### Frontend Environment Variables

| Variable                | Description                   | Example                          | Required |
| ----------------------- | ----------------------------- | -------------------------------- | -------- |
| `API_URL`               | Backend API URL (server-side) | `https://api.example.com`        | Yes      |
| `NEXT_PUBLIC_API_URL`   | Backend API URL (client-side) | `https://api.example.com/api/v1` | Yes      |
| `NEXT_PUBLIC_SITE_URL`  | Frontend URL                  | `https://example.com`            | Yes      |
| `NEXT_PUBLIC_SITE_NAME` | Site name                     | `Para Shooting India`            | No       |

---

## Database Setup

### Schema Overview

The database includes the following main tables:

- `users` - User accounts
- `roles` - Role definitions
- `user_roles` - User-role assignments
- `shooters` - Shooter profiles
- `competitions` - Competition events
- `news_articles` - News and announcements
- `documents` - Downloadable documents
- `results` - Competition results (for your use case)

### Seeding Data

#### 1. Create Roles

```sql
INSERT INTO roles (name, display_name, description, is_system, level) VALUES
('admin', 'Administrator', 'Full system access', true, 100),
('shooter', 'Shooter', 'Registered shooter', true, 10),
('official', 'Official', 'Competition official', true, 50)
ON CONFLICT (name) DO NOTHING;
```

#### 2. Create Admin User

```sql
-- Insert user
INSERT INTO users (email, password_hash, first_name, last_name, is_active)
VALUES ('admin@psci.in', '$2b$12$<your-hash>', 'Admin', 'User', true)
RETURNING id;

-- Assign admin role
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u, roles r
WHERE u.email = 'admin@psci.in' AND r.name = 'admin';
```

#### 3. Verify Setup

```sql
-- Check users
SELECT u.email, u.first_name, u.last_name, r.name as role
FROM users u
JOIN user_roles ur ON u.id = ur.user_id
JOIN roles r ON ur.role_id = r.id;

-- Check results table
SELECT COUNT(*) FROM results;
```

---

## Troubleshooting

### Issue: "No results found" on production

**Symptoms:**

- Local development shows results
- Production shows "No results found"

**Solutions:**

1. **Check Backend Connection:**

```bash
# Test backend health
curl https://your-backend-url.com/api/v1/health

# Test results endpoint
curl https://your-backend-url.com/api/v1/results
```

2. **Verify Environment Variables:**
   - Check Vercel: `API_URL` and `NEXT_PUBLIC_API_URL` are set
   - Check Render: `DATABASE_URL` is set correctly
   - Check CORS: `CORS_ORIGIN` matches your Vercel URL

3. **Check Database:**

```sql
-- Connect to production database
psql "<your-database-url>"

-- Check if results table exists
\dt results

-- Check if there's data
SELECT * FROM results LIMIT 5;
```

4. **Upload Results:**
   - Login to admin panel: `https://your-app.vercel.app/admin/login`
   - Go to Scores: `https://your-app.vercel.app/admin/scores`
   - Upload PDF files

### Issue: Backend not responding

**Check Render Logs:**

1. Go to Render Dashboard
2. Select your API service
3. Click "Logs"
4. Look for errors

**Common Issues:**

- Database connection failed → Check `DATABASE_URL`
- Port binding error → Ensure `PORT=4000` is set
- Module not found → Rebuild with `npm install`

### Issue: CORS errors

**Symptoms:**

```
Access to fetch at 'https://api.example.com' from origin 'https://app.vercel.app'
has been blocked by CORS policy
```

**Solution:**

1. Update backend `CORS_ORIGIN` environment variable
2. Include full URL with protocol: `https://your-app.vercel.app`
3. Redeploy backend

### Issue: File uploads failing

**Check:**

1. Upload directory exists and is writable
2. File size is within limits (10MB default)
3. File type is PDF
4. User is authenticated as admin

**Render Specific:**

- Render uses ephemeral filesystem
- Consider using cloud storage (AWS S3, Cloudinary) for production

### Issue: Database connection timeout

**Solutions:**

1. Use connection pooling
2. Increase connection timeout in `database.config.ts`
3. Check database is running and accessible
4. Verify firewall rules allow connections

---

## Production Checklist

Before going live, ensure:

- [ ] Database is set up and initialized
- [ ] Backend is deployed and healthy
- [ ] Frontend is deployed and accessible
- [ ] Environment variables are configured
- [ ] CORS is properly configured
- [ ] Admin user is created
- [ ] SSL/HTTPS is enabled
- [ ] Custom domain is configured (if applicable)
- [ ] Results data is uploaded
- [ ] All pages load correctly
- [ ] Admin panel is accessible
- [ ] File uploads work
- [ ] Authentication works
- [ ] API endpoints respond correctly

---

## Monitoring and Maintenance

### Health Checks

**Backend Health:**

```bash
curl https://your-api.com/api/v1/health
```

**Expected Response:**

```json
{
  "success": true,
  "data": {
    "status": "ok",
    "timestamp": "2026-01-17T10:00:00.000Z",
    "service": "Para Shooting Committee API",
    "version": "1.0.0",
    "environment": "production"
  }
}
```

### Logs

**Render:**

- Dashboard → Service → Logs tab
- Real-time log streaming
- Filter by log level

**Vercel:**

- Dashboard → Project → Deployments → View Function Logs
- Runtime logs for serverless functions

### Backups

**Database Backups (Render):**

1. Go to Database → Backups
2. Manual backup: Click "Create Backup"
3. Automated backups available on paid plans

**Manual Backup:**

```bash
# Backup database
pg_dump "<database-url>" > backup_$(date +%Y%m%d).sql

# Restore database
psql "<database-url>" < backup_20260117.sql
```

---

## Support and Resources

### Documentation

- Next.js: https://nextjs.org/docs
- NestJS: https://docs.nestjs.com
- PostgreSQL: https://www.postgresql.org/docs

### Deployment Platforms

- Vercel Docs: https://vercel.com/docs
- Render Docs: https://render.com/docs
- Railway Docs: https://docs.railway.app

### Community

- GitHub Issues: <your-repo-url>/issues
- Email: admin@psci.in

---

## Appendix

### A. Generating Secure Secrets

```bash
# Generate JWT secret (32 bytes)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate bcrypt hash
node -e "console.log(require('bcrypt').hashSync('your-password', 12))"
```

### B. Database Connection Strings

**Format:**

```
postgresql://[user]:[password]@[host]:[port]/[database]?[options]
```

**Example:**

```
postgresql://psci_admin:password123@dpg-abc123.oregon-postgres.render.com:5432/psci_platform?ssl=true
```

### C. Useful SQL Queries

```sql
-- Count all results
SELECT COUNT(*) FROM results;

-- List all users with roles
SELECT u.email, r.name as role
FROM users u
JOIN user_roles ur ON u.id = ur.user_id
JOIN roles r ON ur.role_id = r.id;

-- Recent results
SELECT title, date, created_at
FROM results
ORDER BY created_at DESC
LIMIT 10;

-- Delete all results (use with caution!)
DELETE FROM results;
```

---

## Version History

- **v1.0** (2026-01-17): Initial deployment guide
- Covers local development and production deployment
- Includes troubleshooting and maintenance sections

---

**Last Updated:** January 17, 2026  
**Maintained By:** Development Team  
**Contact:** admin@psci.in
