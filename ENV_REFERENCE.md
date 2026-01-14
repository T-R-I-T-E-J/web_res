# 🔑 Environment Variables Reference

Here are the `.env` files you need for your project.

## 1. Root `.env` (For Docker Compose)

**Location:** `./.env` (The file you are currently looking at)

```env
# Database Credentials (for Docker)
POSTGRES_USER=admin
POSTGRES_PASSWORD=postgres_password_123
POSTGRES_DB=psci_platform

# Redis
REDIS_PASSWORD=redis_password_123

# PgAdmin (Database GUI)
PGADMIN_EMAIL=admin@psci.in
PGADMIN_PASSWORD=admin123
```

---

## 2. API `.env` (For Backend)

**Location:** `apps/api/.env`

```env
# Database Connection (must match Docker credentials above)
DATABASE_URL=postgresql://admin:postgres_password_123@localhost:5432/psci_platform

# Application
NODE_ENV=development
PORT=4000
API_PREFIX=api/v1

# Security
JWT_SECRET=super_secret_jwt_key_change_me_12345
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=super_secret_refresh_key_change_me_67890
REFRESH_TOKEN_EXPIRES_IN=30d
ENCRYPTION_KEY=0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef  # 64 chars

# CORS (Frontend URL)
CORS_ORIGIN=http://localhost:3000

# File Upload
MAX_FILE_SIZE=5242880
THROTTLE_TTL=60
THROTTLE_LIMIT=10
LOG_LEVEL=debug
```

---

## 3. Web `.env` (For Frontend)

**Location:** `apps/web/.env`

```env
# Environment
NODE_ENV=development
NEXT_PUBLIC_ENV=development

# Backend Connection
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
NEXT_PUBLIC_API_TIMEOUT=30000

# Features
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_SENTRY=false
NEXT_PUBLIC_DEBUG_MODE=true

# App Metadata
NEXT_PUBLIC_APP_NAME=Para Shooting Committee of India
NEXT_PUBLIC_APP_VERSION=1.0.0

# Security (Must match Backend JWT_SECRET)
JWT_SECRET=super_secret_jwt_key_change_me_12345
```
