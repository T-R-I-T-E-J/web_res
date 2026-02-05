# ⚡ Quick Start: Fix Policies vs Classification Issues

**Time Required:** 30-60 minutes
**Difficulty:** 🟢 Easy (follow steps exactly)

---

## 🎯 What This Fixes

| Issue | Status After Fix |
|-------|------------------|
| ❌ Policies & Classification show same content | ✅ Show different content |
| ❌ Admin Classification is empty | ✅ Shows classification documents |
| ❌ File downloads return 404 | ✅ Downloads work |
| ❌ .json files uploaded instead of PDFs | ✅ Only PDF/DOC allowed |

---

## 📋 Prerequisites

- [ ] Access to production database
- [ ] Access to backend server (to restart)
- [ ] Access to frontend deployment
- [ ] Backup of production database (recommended)

---

## 🚀 Step-by-Step Implementation

### Step 1: Database Changes (5 min)

**Connect to your database** and run:

```sql
-- 1. Create classification categories
INSERT INTO categories (name, slug, page, "order", is_active) VALUES
  ('Medical Classification', 'medical_classification', 'classification', 1, true),
  ('IPC License', 'ipc_license', 'classification', 2, true),
  ('National Classification', 'national_classification', 'classification', 3, true)
ON CONFLICT (slug) DO UPDATE SET
  page = EXCLUDED.page,
  name = EXCLUDED.name;

-- 2. Update existing classification category
UPDATE categories 
SET page = 'classification', "order" = 4
WHERE slug = 'classification';

-- 3. Ensure policies categories are correct
UPDATE categories 
SET page = 'policies' 
WHERE slug IN ('rules', 'selection', 'calendar', 'match')
  AND page != 'policies';

-- 4. Verify changes
SELECT name, slug, page, "order" FROM categories ORDER BY page, "order";
```

**Expected output:**
```
 name                    | slug                    | page           | order
-------------------------|-------------------------|----------------|-------
 Medical Classification  | medical_classification  | classification | 1
 IPC License             | ipc_license             | classification | 2
 National Classification | national_classification | classification | 3
 General Classification  | classification          | classification | 4
 Rules                   | rules                   | policies       | 1
 Selection               | selection               | policies       | 2
 Calendar                | calendar                | policies       | 3
 Match                   | match                   | policies       | 5
```

✅ **If you see the above, proceed to Step 2**

---

### Step 2: Deploy Backend Changes (10 min)

The code changes are already in your repository. Deploy them:

```bash
# Option A: If you have CI/CD
git push origin main  # Or your production branch

# Option B: Manual deployment
cd apps/api
npm install  # If needed
npm run build
npm run start:prod  # Or pm2 restart, etc.
```

**Verify backend is running:**
```bash
curl http://localhost:4000/api/v1/health
# Should return: { "status": "ok" }
```

---

### Step 3: Test Backend API (5 min)

```bash
# Test 1: Policies categories
curl "http://localhost:4000/api/v1/categories?page=policies"
# Should return: Array with Rules, Selection, Calendar, Match

# Test 2: Classification categories
curl "http://localhost:4000/api/v1/categories?page=classification"
# Should return: Array with Medical Classification, IPC License, etc.

# Test 3: Policies downloads
curl "http://localhost:4000/api/v1/downloads?page=policies"
# Should return: Array of policy documents (may be empty initially)

# Test 4: Classification downloads
curl "http://localhost:4000/api/v1/downloads?page=classification"
# Should return: Array of classification documents (may be empty initially)
```

✅ **If all 4 tests return valid JSON, proceed to Step 4**

---

### Step 4: Deploy Frontend Changes (10 min)

```bash
# Option A: If using Vercel/Netlify
git push origin main  # Auto-deploys

# Option B: Manual build
cd apps/web
npm install  # If needed
npm run build
# Then deploy the build output
```

**Wait for deployment to complete** (usually 2-5 minutes)

---

### Step 5: Verify Frontend (5 min)

Open your browser:

1. **Visit Policies Page:**
   - URL: `https://yoursite.com/policies`
   - Should show: Rules, Selection, Calendar, Match categories
   - Should NOT show: Classification documents

2. **Visit Classification Page:**
   - URL: `https://yoursite.com/classification`
   - Should show: Medical Classification, IPC License, etc.
   - Should NOT show: Policies documents

3. **Compare:**
   - Pages should show DIFFERENT content

✅ **If pages show different content, proceed to Step 6**

---

### Step 6: Clean Up Bad Data (10 min - OPTIONAL)

**First, check for invalid downloads:**

```sql
SELECT id, title, href 
FROM downloads 
WHERE is_active = true
  AND href NOT LIKE 'http%'
  AND href NOT LIKE '/uploads/%'
  AND href NOT LIKE '/api/%';
```

**If you see any results** (invalid paths), mark them as inactive:

```sql
UPDATE downloads 
SET is_active = false 
WHERE href NOT LIKE 'http%'
  AND href NOT LIKE '/uploads/%'
  AND href NOT LIKE '/api/%';
```

**Verify:**
```sql
-- Should return 0 rows
SELECT COUNT(*) FROM downloads 
WHERE is_active = true
  AND href NOT LIKE 'http%'
  AND href NOT LIKE '/uploads/%'
  AND href NOT LIKE '/api/%';
```

✅ **If count is 0, you're clean!**

---

### Step 7: Test End-to-End (10-15 min)

#### Test A: Create Policy Document

1. Login to admin: `https://yoursite.com/admin`
2. Navigate to: **Policies** section
3. Click: **Add Document** or **Create**
4. Fill form:
   - Title: "Test Policy 2026"
   - Description: "Testing new system"
   - Category: Select "Rules" or another policies category
   - Upload: Choose a PDF file
5. Click: **Create** or **Submit**
6. Verify:
   - ✅ Success message
   - ✅ Redirects to policies list
   - ✅ New document appears

#### Test B: Create Classification Document

1. Navigate to: **Classification** section in admin
2. Click: **Add Document**
3. Fill form:
   - Title: "Test Classification Doc"
   - Description: "Testing new system"
   - Category: Select "Medical Classification" or another
   - Upload: Choose a PDF file
4. Click: **Create**
5. Verify:
   - ✅ Success message
   - ✅ Document appears in classification list
   - ✅ Does NOT appear in policies list

#### Test C: File Validation

1. Try to upload a `.json` or `.txt` file
2. Verify:
   - ✅ Alert: "Only PDF and DOC/DOCX files are allowed"
   - ✅ File rejected

3. Try to upload a file > 10MB
4. Verify:
   - ✅ Alert: "File size exceeds 10MB limit"
   - ✅ File rejected

#### Test D: Download Files

1. Go to public Policies page
2. Click download on any document
3. Verify:
   - ✅ File opens or downloads
   - ✅ No 404 error

4. Go to public Classification page
5. Click download on any document
6. Verify:
   - ✅ File opens or downloads
   - ✅ No 404 error

---

## ✅ Success Checklist

After completing all steps, verify:

- [ ] Database has 8 categories (4 policies + 4 classification)
- [ ] Backend API returns different data for ?page=policies vs ?page=classification
- [ ] Frontend deployed successfully
- [ ] Policies page shows different content than Classification page
- [ ] Admin can create policy documents (appear only in Policies)
- [ ] Admin can create classification documents (appear only in Classification)
- [ ] File uploads validate type (only PDF/DOC/DOCX)
- [ ] File uploads validate size (< 10MB)
- [ ] File downloads work (no 404)
- [ ] No console errors in browser

---

## ⚠️ Troubleshooting

### Issue: "Categories not found"

**Symptom:** API returns empty array for categories

**Solution:**
```sql
-- Check if categories exist
SELECT COUNT(*) FROM categories;

-- If 0, run Step 1 again
```

---

### Issue: "Admin Classification still empty"

**Symptom:** Admin Classification shows "No documents found"

**This is expected!** Classification is now a separate system.

**Solution:** Create a new classification document:
1. Go to Admin → Classification → Create
2. Fill form and upload PDF
3. Select a classification category
4. Document will now appear

---

### Issue: "Downloads still return 404"

**Symptom:** Clicking download shows "File wasn't available"

**Check:**
```bash
# 1. Verify file exists on disk
ls apps/api/uploads/documents/
# Should show files

# 2. Check database paths
psql -d your_database -c "SELECT id, title, href FROM downloads WHERE is_active = true LIMIT 5;"
# All href should start with /uploads/ or http

# 3. Check backend static file serving
curl -I http://localhost:4000/uploads/documents/some-file.pdf
# Should return: 200 OK
```

**Solution:** If files missing, re-upload them via admin panel

---

### Issue: "Both pages show same content"

**Symptom:** Policies and Classification show identical documents

**Check:**
```sql
-- Verify categories have correct page
SELECT slug, page FROM categories;

-- Check download category assignments
SELECT d.id, d.title, c.page 
FROM downloads d 
JOIN categories c ON d.category_id = c.id 
LIMIT 10;
```

**Solution:** Ensure backend and frontend are both deployed

---

### Issue: "File upload rejected"

**Symptom:** "Only PDF and DOC/DOCX files are allowed"

**This is correct!** The fix adds validation.

**Solution:** 
- Only upload PDF, DOC, or DOCX files
- Files must be < 10MB
- If you need to upload other types, modify the code

---

## 🔄 Rollback Instructions

If something goes wrong:

### 1. Database Rollback

```sql
-- Revert classification category to policies page
UPDATE categories 
SET page = 'policies' 
WHERE slug IN ('classification', 'medical_classification', 'ipc_license', 'national_classification');
```

### 2. Code Rollback

```bash
# Find the commit before changes
git log --oneline

# Revert to previous version
git revert <commit-hash>
git push origin main
```

### 3. Emergency Fix (Temporary)

If you need immediate rollback without code changes:

```sql
-- Set all categories to 'policies' page temporarily
UPDATE categories SET page = 'policies';

-- This makes everything work like before
-- (Both pages will show same content again)
```

---

## 📞 Need Help?

**Check these resources:**

1. **Full Technical Guide:** `POLICIES_CLASSIFICATION_FIX_COMPLETE.md`
2. **Architecture Diagrams:** `ARCHITECTURE_DIAGRAM_FIX.md`
3. **Detailed Testing:** `TESTING_GUIDE_POLICIES_CLASSIFICATION.md`
4. **Executive Summary:** `EXECUTIVE_SUMMARY_FIX.md`

**Common Error Messages:**

| Error | Document |
|-------|----------|
| Database errors | Run Step 1 SQL again |
| API 500 errors | Check backend logs |
| Frontend blank page | Check browser console |
| 404 on downloads | Verify file paths in DB |

---

## ⏱️ Time Breakdown

- Step 1 (Database): 5 minutes
- Step 2 (Backend Deploy): 10 minutes
- Step 3 (API Test): 5 minutes
- Step 4 (Frontend Deploy): 10 minutes
- Step 5 (Frontend Verify): 5 minutes
- Step 6 (Cleanup): 10 minutes (optional)
- Step 7 (E2E Test): 15 minutes

**Total: 30-60 minutes**

---

## 🎉 You're Done!

After completing all steps:

✅ Policies and Classification are separated
✅ Admin panels work correctly
✅ File downloads work
✅ File uploads validated
✅ Production is stable

**Next Steps:**
1. Monitor production logs for 24-48 hours
2. Communicate changes to admin users
3. Create any additional classification categories as needed
4. Re-upload any documents that were marked inactive

---

## 📝 Quick Reference Commands

```bash
# Check backend health
curl http://localhost:4000/api/v1/health

# Test policies API
curl "http://localhost:4000/api/v1/downloads?page=policies"

# Test classification API
curl "http://localhost:4000/api/v1/downloads?page=classification"

# Check database
psql -d your_database -c "SELECT name, page FROM categories;"

# View backend logs
tail -f apps/api/api_debug.log

# Restart backend
pm2 restart api  # Or your restart command
```

**Bookmark this file for future reference!** 🔖
