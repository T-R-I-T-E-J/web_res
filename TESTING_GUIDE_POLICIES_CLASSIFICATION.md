# Testing Guide: Policies vs Classification Fix

## Pre-Testing Database Setup

### 1. Run Migrations

```bash
cd apps/api
npm run migration:run

# Or manually run the SQL files in order:
# 1. 20260206_create_classification_categories.sql
# 2. 20260206_cleanup_invalid_downloads.sql (review output first)
```

### 2. Verify Database State

```sql
-- Check categories are properly set up
SELECT id, name, slug, page, "order", is_active 
FROM categories 
ORDER BY page, "order";

-- Expected output:
-- | name                    | slug                    | page           | order |
-- |-------------------------|-------------------------|----------------|-------|
-- | Medical Classification  | medical_classification  | classification | 1     |
-- | IPC License             | ipc_license             | classification | 2     |
-- | National Classification | national_classification | classification | 3     |
-- | General Classification  | classification          | classification | 4     |
-- | Rules                   | rules                   | policies       | 1     |
-- | Selection               | selection               | policies       | 2     |
-- | Calendar                | calendar                | policies       | 3     |
-- | Match                   | match                   | policies       | 5     |

-- Check downloads are valid
SELECT id, title, href, 
  CASE 
    WHEN href LIKE 'http%' THEN '✅ External'
    WHEN href LIKE '/uploads/%' THEN '✅ Valid'
    WHEN href LIKE '/api/%' THEN '✅ Valid'
    ELSE '❌ Invalid'
  END as status
FROM downloads 
WHERE is_active = true;

-- All should show ✅
```

### 3. Clean Up Bad Data (if needed)

```sql
-- Mark invalid downloads as inactive
UPDATE downloads 
SET is_active = false 
WHERE is_active = true
  AND href NOT LIKE 'http%'
  AND href NOT LIKE '/uploads/%'
  AND href NOT LIKE '/api/%';
```

---

## Testing Checklist

### Backend API Tests

#### ✅ Test 1: Categories Endpoint - Policies

```bash
curl "http://localhost:4000/api/v1/categories?page=policies"
```

**Expected:**
- Returns array of categories
- All have `"page": "policies"`
- Categories: Rules, Selection, Calendar, Match

#### ✅ Test 2: Categories Endpoint - Classification

```bash
curl "http://localhost:4000/api/v1/categories?page=classification"
```

**Expected:**
- Returns array of categories
- All have `"page": "classification"`
- Categories: Medical Classification, IPC License, National Classification, General Classification

#### ✅ Test 3: Downloads Endpoint - Policies

```bash
curl "http://localhost:4000/api/v1/downloads?page=policies"
```

**Expected:**
- Returns array of downloads
- All downloads belong to policies categories
- Should NOT include classification documents

#### ✅ Test 4: Downloads Endpoint - Classification

```bash
curl "http://localhost:4000/api/v1/downloads?page=classification"
```

**Expected:**
- Returns array of downloads
- All downloads belong to classification categories
- Should NOT include policies documents

#### ✅ Test 5: Downloads Endpoint - No Filter

```bash
curl "http://localhost:4000/api/v1/downloads"
```

**Expected:**
- Returns ALL active downloads (both policies and classification)

---

### Frontend Admin Panel Tests

#### ✅ Test 6: Admin Policies Page

1. Navigate to: `http://localhost:3000/admin/policies`
2. Login as admin
3. Verify:
   - [ ] Page loads without errors
   - [ ] Shows list of policy documents (or empty state)
   - [ ] Does NOT show classification documents
   - [ ] Download links work (if any documents exist)

#### ✅ Test 7: Admin Classification Page

1. Navigate to: `http://localhost:3000/admin/classification`
2. Login as admin
3. Verify:
   - [ ] Page loads without errors
   - [ ] Shows "No documents found" initially (expected if no classification docs exist)
   - [ ] Does NOT show policies documents

#### ✅ Test 8: Create Policy Document

1. Navigate to: `http://localhost:3000/admin/policies/create`
2. Fill in form:
   - Title: "Test Policy Document"
   - Description: "Test description"
   - Category: Select "Rules" (or any policies category)
   - Upload type: File
   - File: Upload a PDF file
3. Click "Create Policy"
4. Verify:
   - [ ] Success message appears
   - [ ] Redirects to `/admin/policies`
   - [ ] New document appears in list
   - [ ] Document has valid href starting with `/uploads/documents/`

#### ✅ Test 9: Create Classification Document

1. Navigate to: `http://localhost:3000/admin/classification/create`
2. Fill in form:
   - Title: "Test Classification Document"
   - Description: "Test description"
   - Category: Select "Medical Classification" (or any classification category)
   - Upload type: File
   - File: Upload a PDF file
3. Click "Create Document"
4. Verify:
   - [ ] Success message appears
   - [ ] Redirects to `/admin/classification`
   - [ ] New document appears in list
   - [ ] Document does NOT appear in Policies admin

#### ✅ Test 10: File Type Validation

1. Try to upload a `.json` or `.txt` file in Policies create
2. Verify:
   - [ ] Alert shows: "Only PDF and DOC/DOCX files are allowed"
   - [ ] File is rejected

3. Try to upload a `.json` or `.txt` file in Classification create
4. Verify:
   - [ ] Alert shows: "Only PDF and DOC/DOCX files are allowed"
   - [ ] File is rejected

#### ✅ Test 11: File Size Validation

1. Try to upload a file > 10MB in Policies create
2. Verify:
   - [ ] Alert shows: "File size exceeds 10MB limit"
   - [ ] File is rejected

3. Try to upload a file > 10MB in Classification create
4. Verify:
   - [ ] Alert shows: "File size exceeds 10MB limit"
   - [ ] File is rejected

---

### Frontend Public Pages Tests

#### ✅ Test 12: Public Policies Page

1. Navigate to: `http://localhost:3000/policies`
2. Verify:
   - [ ] Page loads without errors
   - [ ] Shows categories: Rules, Selection, Calendar, Match
   - [ ] Shows only policy documents
   - [ ] Does NOT show classification documents
   - [ ] Download links work correctly

#### ✅ Test 13: Public Classification Page

1. Navigate to: `http://localhost:3000/classification`
2. Verify:
   - [ ] Page loads without errors
   - [ ] Shows categories: Medical Classification, IPC License, National Classification, etc.
   - [ ] Shows only classification documents
   - [ ] Does NOT show policies documents
   - [ ] Download links work correctly

#### ✅ Test 14: Content Separation

1. Open Policies page and Classification page side-by-side
2. Verify:
   - [ ] They show DIFFERENT content
   - [ ] No document appears on both pages
   - [ ] Categories are different on each page

---

### File Download Tests

#### ✅ Test 15: Download Policy Document

1. Go to public Policies page
2. Click download on a document
3. Verify:
   - [ ] Browser opens/downloads the file
   - [ ] File is the correct PDF/DOC
   - [ ] No 404 error

#### ✅ Test 16: Download Classification Document

1. Go to public Classification page
2. Click download on a document
3. Verify:
   - [ ] Browser opens/downloads the file
   - [ ] File is the correct PDF/DOC
   - [ ] No 404 error

#### ✅ Test 17: Direct File URL Access

1. From admin panel, copy a document's href (e.g., `/uploads/documents/doc_12345.pdf`)
2. Access directly: `http://localhost:4000/uploads/documents/doc_12345.pdf`
3. Verify:
   - [ ] File serves correctly
   - [ ] Content-Type header is correct (application/pdf)
   - [ ] No 404 error

---

### Edge Case Tests

#### ✅ Test 18: Empty State - No Policies

1. Remove all policies from database
2. Go to public Policies page
3. Verify:
   - [ ] Shows "No documents available" or similar
   - [ ] No errors in console

#### ✅ Test 19: Empty State - No Classifications

1. Remove all classifications from database
2. Go to public Classification page
3. Verify:
   - [ ] Shows "No documents available" or similar
   - [ ] No errors in console

#### ✅ Test 20: Category with No Documents

1. Ensure a category exists but has no documents
2. Go to relevant public page
3. Verify:
   - [ ] Category appears in list
   - [ ] Shows 0 documents or empty state
   - [ ] No errors

---

## Browser Console Checks

During all tests, monitor browser console for:

### ❌ Should NOT See:
- 404 errors for API calls
- 404 errors for file downloads
- TypeScript/React errors
- CORS errors
- Authentication errors (when logged in)

### ✅ Should See:
- Successful API responses (200 OK)
- Console logs showing fetched data (optional, can be removed)

---

## Database Validation Queries

Run these after creating test documents:

### Verify Document Distribution

```sql
-- Count documents by page
SELECT 
    c.page,
    COUNT(d.id) as total_documents
FROM downloads d
JOIN categories c ON d.category_id = c.id
WHERE d.is_active = true
GROUP BY c.page;

-- Expected:
-- | page           | total_documents |
-- |----------------|-----------------|
-- | policies       | X               |
-- | classification | Y               |
```

### Verify File Paths

```sql
-- Check all hrefs are valid
SELECT title, href
FROM downloads
WHERE is_active = true
  AND (
    href NOT LIKE 'http%' 
    AND href NOT LIKE '/uploads/%'
    AND href NOT LIKE '/api/%'
  );

-- Expected: No results (empty set)
```

### Verify Category Relationships

```sql
-- Check documents are linked to correct categories
SELECT 
    d.title,
    c.name as category_name,
    c.page as page_type,
    d.href
FROM downloads d
JOIN categories c ON d.category_id = c.id
WHERE d.is_active = true
ORDER BY c.page, d.created_at DESC;
```

---

## Troubleshooting

### Issue: Classification Admin Still Empty

**Cause:** No classification documents exist yet

**Solution:**
1. Create a new classification document via admin
2. Ensure you select a classification category (Medical Classification, IPC License, etc.)
3. Verify it appears in admin classification list

### Issue: Policies Shows Classification Docs

**Cause:** Backend not filtering properly OR documents have wrong category_id

**Check:**
```sql
-- Find documents with wrong categories
SELECT d.id, d.title, c.page
FROM downloads d
JOIN categories c ON d.category_id = c.id
WHERE d.is_active = true;
```

**Solution:** Update category_id to correct category

### Issue: Downloads Return 404

**Cause:** File doesn't exist on disk OR wrong path in database

**Check:**
1. Look in `apps/api/uploads/documents/` directory
2. Verify file exists
3. Check database href matches actual file path

```sql
SELECT id, title, href FROM downloads WHERE is_active = true;
```

### Issue: File Upload Fails

**Cause:** Backend validation OR multer config issue

**Check:**
1. File type is PDF/DOC/DOCX
2. File size < 10MB
3. Backend logs for error details
4. Multer config in `apps/api/src/config/multer.config.ts`

---

## Success Criteria

✅ **All Tests Pass:**
- [ ] All 20 test cases above pass
- [ ] No 404 errors in browser network tab
- [ ] No console errors
- [ ] Files download successfully
- [ ] Policies and Classification show different content
- [ ] Admin panels show correct filtered data

✅ **Database is Clean:**
- [ ] All downloads have valid hrefs
- [ ] Categories properly distributed between pages
- [ ] No orphaned documents

✅ **User Experience:**
- [ ] Upload flow is smooth
- [ ] Download works immediately
- [ ] Clear separation between Policies and Classification
- [ ] File type validation provides helpful messages

---

## Production Deployment Checklist

Before deploying to production:

1. [ ] Run all migrations on production database
2. [ ] Backup production database first
3. [ ] Review and clean up existing invalid downloads
4. [ ] Test file serving in production environment
5. [ ] Verify environment variables are set (NEXT_PUBLIC_API_URL)
6. [ ] Test file uploads in production
7. [ ] Verify CORS settings for file serving
8. [ ] Check CDN/proxy configuration (if applicable)
9. [ ] Monitor error logs after deployment
10. [ ] Create test documents in each category

---

## Rollback Plan

If issues occur in production:

1. **Database Rollback:**
   ```sql
   -- Revert page field changes
   UPDATE categories SET page = 'policies' WHERE slug = 'classification';
   
   -- Re-enable disabled downloads (if cleanup was run)
   UPDATE downloads SET is_active = true 
   WHERE id IN ('list-of-ids-that-were-disabled');
   ```

2. **Code Rollback:**
   ```bash
   git revert <commit-hash>
   ```

3. **Quick Fix (Temporary):**
   - Revert frontend changes only
   - Keep backend changes
   - Use client-side filtering as fallback

---

## Contact & Support

If you encounter issues during testing:

1. Check browser console for error messages
2. Check backend logs: `apps/api/api_debug.log`
3. Review database state with validation queries above
4. Document the exact steps to reproduce
5. Include screenshots/error messages

**Common Issues:**
- File 404: Check path in database and file on disk
- Empty admin: Create new documents with correct categories
- Wrong content: Verify category page field in database
