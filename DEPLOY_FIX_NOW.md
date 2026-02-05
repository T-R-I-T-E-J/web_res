# 🚀 DEPLOY THE FIX NOW - Step by Step

## Current Issue
The code changes are committed but **NOT deployed yet**. That's why both pages still show the same data.

---

## ⚡ QUICK FIX (15 minutes)

### Step 1: Run Database Migration

**Option A: Using psql command line**

```bash
# Navigate to migrations folder
cd apps/api/migrations

# Run the migration
psql -U postgres -d psci_platform -f 20260206_create_classification_categories.sql

# If prompted for password, check your .env file for DB_PASSWORD
```

**Option B: Using pgAdmin (GUI)**

1. Open pgAdmin: http://localhost:8081
2. Login: admin@psci.in / admin123
3. Connect to your database: `psci_platform`
4. Open Query Tool
5. Copy and paste the content from:
   `apps/api/migrations/20260206_create_classification_categories.sql`
6. Click Execute (F5)

**Option C: Copy the SQL here:**

```sql
-- Run this in your database:

INSERT INTO categories (name, slug, page, "order", is_active) VALUES
  ('Medical Classification', 'medical_classification', 'classification', 1, true),
  ('IPC License', 'ipc_license', 'classification', 2, true),
  ('National Classification', 'national_classification', 'classification', 3, true)
ON CONFLICT (slug) DO UPDATE SET
  page = EXCLUDED.page,
  name = EXCLUDED.name,
  "order" = EXCLUDED."order";

UPDATE categories 
SET page = 'classification', "order" = 4
WHERE slug = 'classification';

UPDATE categories 
SET page = 'policies' 
WHERE slug IN ('rules', 'selection', 'calendar', 'match')
  AND page != 'policies';
```

**Verify it worked:**

```sql
-- Should show 8 categories total (4 policies + 4 classification)
SELECT name, slug, page, "order" FROM categories ORDER BY page, "order";
```

---

### Step 2: Restart Backend API

```bash
# Stop current backend (Ctrl+C if running in terminal)
# Or if using pm2:
pm2 stop api

# Restart it
cd apps/api
npm run start:dev

# Or for production:
npm run build
npm run start:prod
```

**Verify backend is running:**

Open browser: http://localhost:4000/api/v1/health

Should return: `{"status":"ok"}`

---

### Step 3: Restart Frontend

```bash
# Stop current frontend (Ctrl+C if running)
# Restart it
cd apps/web
npm run dev
```

**Verify frontend is running:**

Open browser: http://localhost:3000

---

### Step 4: Test the Fix

#### Test 1: Check API Endpoints

**Open these URLs in browser:**

1. http://localhost:4000/api/v1/categories?page=policies
   - Should show: Rules, Selection, Calendar, Match

2. http://localhost:4000/api/v1/categories?page=classification
   - Should show: Medical Classification, IPC License, National Classification, etc.

3. http://localhost:4000/api/v1/downloads?page=policies
   - Should show only policy documents

4. http://localhost:4000/api/v1/downloads?page=classification
   - Should show only classification documents

#### Test 2: Check Frontend Pages

1. Visit: http://localhost:3000/policies
2. Visit: http://localhost:3000/classification
3. **Compare:** They should show DIFFERENT content

#### Test 3: Check Admin Panel

1. Login to admin: http://localhost:3000/admin
2. Go to **Policies** section
3. Go to **Classification** section
4. **They should show different documents**

#### Test 4: Create New Documents

1. Admin → Classification → Create
2. Add a test document with "Medical Classification" category
3. Verify it appears ONLY in Classification (not in Policies)

---

## ✅ Success Criteria

After completing steps 1-4, you should have:

- [ ] Database has 8 categories (4 policies + 4 classification)
- [ ] Backend API returns different data for `?page=policies` vs `?page=classification`
- [ ] Frontend Policies page ≠ Classification page
- [ ] Admin Policies section ≠ Classification section
- [ ] Creating classification doc shows only in Classification
- [ ] Creating policy doc shows only in Policies

---

## 🆘 Troubleshooting

### Issue: "psql command not found"

**Solution:** Use pgAdmin GUI instead (Option B above)

### Issue: "Database connection refused"

**Solution:** Start Docker containers first:

```bash
docker-compose up -d
```

### Issue: "Still seeing same data"

**Possible causes:**

1. **Migration not run** → Run Step 1 again
2. **Backend not restarted** → Kill all node processes and restart
3. **Browser cache** → Hard refresh (Ctrl+Shift+R) or clear cache
4. **Old data in database** → Run this to check:

```sql
-- Check if categories have correct page values
SELECT name, page FROM categories;

-- Check if any downloads exist
SELECT COUNT(*) FROM downloads WHERE is_active = true;
```

### Issue: "Categories table doesn't exist"

**Solution:** You need to run earlier migrations first:

```bash
cd apps/api
npm run migration:run
```

---

## 🎯 Quick Commands Summary

```bash
# 1. Run migration (choose one method from Step 1)
psql -U postgres -d psci_platform -f apps/api/migrations/20260206_create_classification_categories.sql

# 2. Restart backend
cd apps/api
npm run start:dev

# 3. Restart frontend  
cd apps/web
npm run dev

# 4. Test in browser
# - http://localhost:4000/api/v1/categories?page=policies
# - http://localhost:4000/api/v1/categories?page=classification
# - http://localhost:3000/policies
# - http://localhost:3000/classification
```

---

## 📞 Need Help?

If you encounter errors:

1. Copy the exact error message
2. Check which step failed
3. Refer to troubleshooting section above

**The fix is ready - it just needs to be deployed!** 🚀
