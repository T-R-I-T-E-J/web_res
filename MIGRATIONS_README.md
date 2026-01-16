# 🚀 Quick Start: Migration Commands

## ⚠️ IMPORTANT: Always run from `apps/api` directory!

```powershell
# Step 1: Navigate to the correct directory
cd apps/api

# Step 2: Set your DATABASE_URL
$env:DATABASE_URL="postgresql://neondb_owner:npg_9eCfYFJguLx7@ep-calm-art-ahbg990f-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"

# Step 3: Run your command
npm run migrate:status    # Check migration status
npm run migrate:sql       # Run pending migrations
```

## One-Line Commands (from project root)

```powershell
# Check migration status
cd apps/api; $env:DATABASE_URL="postgresql://neondb_owner:npg_9eCfYFJguLx7@ep-calm-art-ahbg990f-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"; npm run migrate:status

# Run migrations
cd apps/api; $env:DATABASE_URL="postgresql://neondb_owner:npg_9eCfYFJguLx7@ep-calm-art-ahbg990f-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"; npm run migrate:sql
```

## 📚 Full Documentation

See `apps/api/MIGRATION_GUIDE.md` for complete documentation.

## Current Status

✅ All 10 migrations are applied to Neon database

- Last checked: 2026-01-15
- Database: Neon.tech (neondb)
- Location: `apps/api/migrations/`
