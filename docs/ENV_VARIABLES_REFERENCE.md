# Environment Variables - Quick Reference

> **Quick lookup guide for all environment variables**

---

## 🎯 Frontend Variables (apps/web)

### Required Variables

| Variable              | Purpose                | Development                  | Preview                            | Production                 |
| --------------------- | ---------------------- | ---------------------------- | ---------------------------------- | -------------------------- |
| `NODE_ENV`            | Environment identifier | development                  | preview                            | production                 |
| `NEXT_PUBLIC_API_URL` | Backend API endpoint   | http://localhost:8080/api/v1 | https://preview-api.psci.in/api/v1 | https://api.psci.in/api/v1 |

### Optional Variables

| Variable                          | Purpose          | Development | Preview     | Production   |
| --------------------------------- | ---------------- | ----------- | ----------- | ------------ |
| `NEXT_PUBLIC_ENABLE_ANALYTICS`    | Google Analytics | false       | false       | true         |
| `NEXT_PUBLIC_ENABLE_SENTRY`       | Error tracking   | false       | true        | true         |
| `NEXT_PUBLIC_DEBUG_MODE`          | Debug logs       | true        | false       | false        |
| `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID` | GA tracking ID   | (empty)     | (empty)     | G-XXXXXXXXXX |
| `NEXT_PUBLIC_SENTRY_DSN`          | Sentry DSN       | (empty)     | https://... | https://...  |

---

## 🔧 Backend Variables (apps/api)

### Critical Variables (Must Set)

| Variable             | Purpose           | Development           | Preview                 | Production          |
| -------------------- | ----------------- | --------------------- | ----------------------- | ------------------- |
| `NODE_ENV`           | Environment       | development           | preview                 | production          |
| `PORT`               | Server port       | 8080                  | 8080                    | 8080                |
| `DB_HOST`            | Database host     | localhost             | preview-db.railway.app  | prod-db.railway.app |
| `DB_PASSWORD`        | Database password | psci_secure_2025      | <strong-random>         | <strong-random>     |
| `JWT_SECRET`         | JWT signing key   | dev-secret            | <32-random-chars>       | <32-random-chars>   |
| `JWT_REFRESH_SECRET` | Refresh token key | dev-refresh           | <32-random-chars>       | <32-random-chars>   |
| `CORS_ORIGIN`        | Allowed frontend  | http://localhost:3000 | https://preview.psci.in | https://www.psci.in |

### Database Variables

| Variable      | Purpose           | Development      | Preview               | Production      |
| ------------- | ----------------- | ---------------- | --------------------- | --------------- |
| `DB_HOST`     | Database host     | localhost        | <cloud-db-host>       | <cloud-db-host> |
| `DB_PORT`     | Database port     | 5432             | 5432                  | 5432            |
| `DB_USERNAME` | Database user     | psci_admin       | psci_admin            | psci_admin      |
| `DB_PASSWORD` | Database password | psci_secure_2025 | <strong>              | <strong>        |
| `DB_DATABASE` | Database name     | psci_platform    | psci_platform_preview | psci_platform   |

### Security Variables

| Variable             | Purpose         | Development                | Preview     | Production  |
| -------------------- | --------------- | -------------------------- | ----------- | ----------- |
| `JWT_SECRET`         | JWT signing     | dev-secret                 | <random-32> | <random-32> |
| `JWT_REFRESH_SECRET` | Refresh token   | dev-refresh                | <random-32> | <random-32> |
| `SESSION_SECRET`     | Session signing | dev-session                | <random-32> | <random-32> |
| `COOKIE_SECRET`      | Cookie signing  | dev-cookie                 | <random-32> | <random-32> |
| `ENCRYPTION_KEY`     | Data encryption | dev-encryption-key-32chars | <random-32> | <random-32> |

---

## 🔑 How to Generate Secrets

### Linux/Mac

```bash
# Generate 32-character random string
openssl rand -hex 32
```

### Windows PowerShell

```powershell
# Generate 32-character random string
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

### Online

- https://randomkeygen.com/ (use "CodeIgniter Encryption Keys")
- https://www.uuidgenerator.net/

---

## 📋 Setup Checklist

### Development

- [ ] Copy `.env.example` to `.env` (backend)
- [ ] Copy `.env.example` to `.env.local` (frontend)
- [ ] Set `NODE_ENV=development`
- [ ] Set `NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1`
- [ ] Start Docker database
- [ ] Start backend
- [ ] Start frontend

### Preview

- [ ] Create preview database
- [ ] Deploy backend to Railway/Render
- [ ] Set all environment variables in platform
- [ ] Deploy frontend to Netlify
- [ ] Set `NEXT_PUBLIC_API_URL` to preview backend URL
- [ ] Test deployment

### Production

- [ ] Create production database (separate from preview!)
- [ ] Generate new strong secrets (don't reuse preview secrets!)
- [ ] Deploy backend to Railway/Render
- [ ] Set all environment variables
- [ ] Deploy frontend to Netlify
- [ ] Configure custom domain
- [ ] Enable SSL
- [ ] Test thoroughly

---

## ⚠️ Common Mistakes

### ❌ Using Same Secrets Everywhere

**Wrong**: Same JWT_SECRET in dev, preview, and production  
**Right**: Different secrets for each environment

### ❌ Committing .env Files

**Wrong**: `git add .env`  
**Right**: .env files are gitignored

### ❌ Weak Secrets in Production

**Wrong**: `JWT_SECRET=secret123`  
**Right**: `JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`

### ❌ Wrong API URL

**Wrong**: Frontend uses localhost in production  
**Right**: Frontend uses production API URL

### ❌ Same Database for All Environments

**Wrong**: Dev, preview, and production use same database  
**Right**: Separate database for each environment

---

## 🔍 Verification

### Check Frontend Variables

```bash
# In browser console (F12)
console.log(process.env.NEXT_PUBLIC_API_URL)
console.log(process.env.NEXT_PUBLIC_ENV)
```

### Check Backend Variables

```bash
# In terminal
echo $NODE_ENV
echo $DB_HOST
echo $CORS_ORIGIN
```

### Test API Connection

```bash
# Should return 200 OK
curl https://api.psci.in/api/v1/health
```

---

## 📚 Files Reference

- **Frontend**: `apps/web/.env.example`
- **Backend**: `apps/api/.env.example`
- **Documentation**: `docs/ENVIRONMENT_STRATEGY.md`

---

**Last Updated**: 2025-12-28
