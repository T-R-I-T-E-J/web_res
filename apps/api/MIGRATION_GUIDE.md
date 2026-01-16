# Migration Management Guide

## ⚠️ IMPORTANT: Run commands from the `apps/api` directory!

All migration commands must be run from `apps/api`, not the project root.

```powershell
# Navigate to the API directory first
cd apps/api
```

## Quick Commands

### Check Migration Status

```bash
# Navigate to API directory
cd apps/api

# Set your DATABASE_URL
$env:DATABASE_URL="postgresql://neondb_owner:npg_9eCfYFJguLx7@ep-calm-art-ahbg990f-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"

# Check which migrations are applied
npm run migrate:status
```

### Run All Pending Migrations

```bash
# Navigate to API directory
cd apps/api

# Set your DATABASE_URL
$env:DATABASE_URL="postgresql://neondb_owner:npg_9eCfYFJguLx7@ep-calm-art-ahbg990f-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"

# Run migrations
npm run migrate:sql
```

### Run a Single Migration (for debugging)

```bash
# Navigate to API directory
cd apps/api

# Set your DATABASE_URL
$env:DATABASE_URL="postgresql://neondb_owner:npg_9eCfYFJguLx7@ep-calm-art-ahbg990f-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"

# Run specific migration
node scripts/run-single-migration.js <migration-filename.sql>
```

## Available Scripts

### `check-migration-status.js`

- Shows all migration files and their status (Applied ✅ or Pending ⏳)
- Compares migration files with database records
- Identifies orphaned migrations (in DB but no file)
- **Usage**: `npm run migrate:status`

### `run-migrations.js`

- Runs all pending migrations in order
- Uses transactions (rolls back on error)
- Records applied migrations in `schema_migrations` table
- **Usage**: `npm run migrate:sql`

### `run-single-migration.js`

- Runs a specific migration file
- Shows the SQL being executed
- Provides detailed error messages
- **Usage**: `node scripts/run-single-migration.js <filename>`

### `check-database.js`

- Checks if specific tables exist
- Shows table columns
- Lists applied migrations
- **Usage**: `node scripts/check-database.js`

### `check-news-table.js`

- Detailed view of news_articles table structure
- Shows all columns with types and defaults
- **Usage**: `node scripts/check-news-table.js`

### `list-tables.js`

- Lists all tables in the database
- **Usage**: `node scripts/list-tables.js`

## Current Migration Status

✅ **All 10 migrations are applied to Neon database**

### Applied Migrations:

1. `001_create_news_articles_table.sql` - Creates news_articles table
2. `003-add-encrypted-fields.sql` - Adds encryption fields to users
3. `003_create_results_table.sql` - Creates results table
4. `004-create-events-media.sql` - Creates events and media tables
5. `005_create_downloads_table.sql` - Creates downloads table
6. `20250101_add_documents_to_news.sql` - Adds documents column to news
7. `20250101_add_multiple_urls_to_events.sql` - Adds image_urls to events
8. `20250101_add_multiple_urls_to_news.sql` - Adds image_urls to news ✨
9. `20250101_add_preview_image_to_news.sql` - Adds preview_image_url to news
10. `20260109_create_categories_table.sql` - Creates categories table

## Environment Setup

### Option 1: Set DATABASE_URL each time (Quick)

```powershell
$env:DATABASE_URL="postgresql://neondb_owner:npg_9eCfYFJguLx7@ep-calm-art-ahbg990f-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"
npm run migrate:status
```

### Option 2: Create .env file (Recommended)

Create `apps/api/.env` with:

```env
DATABASE_URL=postgresql://neondb_owner:npg_9eCfYFJguLx7@ep-calm-art-ahbg990f-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
NODE_ENV=development
PORT=4000
# ... other variables from .env.example
```

Then you can just run:

```bash
npm run migrate:status
npm run migrate:sql
```

## Troubleshooting

### Error: "relation does not exist"

- The table hasn't been created yet
- Check migration order (migrations run alphabetically)
- Create a migration to create the missing table

### Error: "constraint already exists"

- Use conditional constraint creation:

```sql
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'constraint_name'
    ) THEN
        ALTER TABLE ... ADD CONSTRAINT ...;
    END IF;
END $$;
```

### Error: "DATABASE_URL not set"

- Set the environment variable before running commands
- Or create a `.env` file in `apps/api/`

## Best Practices

1. **Always check status first**: `npm run migrate:status`
2. **Test migrations locally** before running on production
3. **Use transactions** (already built into scripts)
4. **Name migrations clearly**: `YYYYMMDD_description.sql`
5. **Keep migrations small** and focused on one change
6. **Never edit applied migrations** - create a new one instead
7. **Use IF NOT EXISTS** for idempotent migrations
