# 🔴 Policies vs Classification Issues - Complete Root Cause Analysis & Fixes

## Executive Summary

**Status:** 🔴 Critical Production Issues Identified
**Affected Features:** Policies, Classification, File Downloads
**Impact:** Data confusion, empty admin panels, broken downloads

---

## 🧠 Root Cause Analysis

### Issue #1: Categories vs Downloads Confusion

**The Problem:**
The system uses TWO separate concepts that are being confused:

1. **Categories Table**: Defines organizational categories (e.g., "Rules", "Selection", "Classification")
   - Has a `page` field that determines WHERE categories appear ("policies" or "classification")
   - Located at: `apps/api/src/categories/`

2. **Downloads Table**: Stores actual documents/files
   - Has a `category` field (string slug like "rules", "selection")
   - Has a `categoryId` field (foreign key to Categories)
   - Located at: `apps/api/src/downloads/`

**Current Bad Data Flow:**
```
Classification Page → /categories?page=classification
                   ↓
          Returns categories WHERE page='classification'
                   ↓
          BUT only 1 category has page='classification' (added by migration)
                   ↓
          Classification downloads have category='classification', 'medical_classification', etc.
                   ↓
          These are NOT in categories table OR have page='policies'
```

**Why Policies Shows Same Data:**
```sql
-- Current database state (from migration 20260109):
INSERT INTO categories (name, slug, page) VALUES
  ('Rules', 'rules', 'policies'),
  ('Selection', 'selection', 'policies'),
  ('Calendar', 'calendar', 'policies'),
  ('Classification', 'classification', 'policies'),  -- ❌ page='policies'!
  ('Match', 'match', 'policies');

-- Then migration 20260205 tried to fix:
UPDATE categories SET page='classification' WHERE slug='classification';
```

**Result:** The "Classification" category now has `page='classification'`, but:
- Admin policies filter EXCLUDES classification-related categories at the download level
- Frontend Policies page calls `/categories?page=policies` (returns Rules, Selection, Calendar, Match)
- Frontend Classification page calls `/categories?page=classification` (returns only Classification category)
- BOTH pages call `/downloads` and get ALL downloads, then filter client-side
- Admin Classification filters downloads by hardcoded category strings

### Issue #2: Admin Classification Shows "No Documents"

**Root Cause:**
```typescript
// apps/web/src/app/(dashboard)/admin/classification/page.tsx:40-42
const classItems = data.filter((item: ClassificationItem) => 
  ['classification', 'medical_classification', 'ipc_license', 'national_classification'].includes(item.category)
)
```

**Why It Fails:**
- Downloads in DB likely have `category='rules'`, `'selection'`, etc. (NOT classification-related)
- The filter looks for documents with category slugs that don't exist in the data
- In production, someone added documents via Policies admin, which assigns non-classification categories

**Evidence:**
From screenshots, Policies admin shows documents like:
- "as" → Category: Nrai-2025
- "asdas" → Category: Rules
- "asddasd" → Category: Rules

None have category = 'classification', so Classification admin shows empty.

### Issue #3: File Downloads Broken

**Root Cause #1: Invalid File Paths**
```typescript
// apps/web/src/app/(dashboard)/admin/policies/create/page.tsx:122
return `/uploads/documents/${filename}`;

// But the admin displays:
href: "MEDICAL_LABORATORY_REPORT_2.json"
href: "Razorpay_Rize_Company_Registration_Services_Refund_T_C.json"
```

These are bare filenames, NOT full paths. When user clicks download:
```
<a href="MEDICAL_LABORATORY_REPORT_2.json" target="_blank">
```
Browser tries: `https://yoursite.com/MEDICAL_LABORATORY_REPORT_2.json` → 404

**Root Cause #2: Wrong File Type Stored**
Users uploaded `.json` files instead of PDFs, and no validation prevented it.

**Root Cause #3: Backend Serves Files Correctly, But URLs Are Wrong**
```typescript
// apps/api/src/app.module.ts:101-104
ServeStaticModule.forRoot({
  rootPath: join(process.cwd(), 'uploads'),
  serveRoot: '/uploads',
}),
```

✅ Files ARE being served at `/uploads/documents/filename.pdf`
❌ But database stores wrong paths like just `filename.json`

---

## 📦 Database Schema Review

### Current Schema (Correct Structure):

**categories table:**
```sql
id          | uuid (PK)
name        | varchar      -- Display name: "Rules", "Classification"
slug        | varchar      -- URL-friendly: "rules", "classification"
page        | varchar      -- Filter: "policies" or "classification"
order       | int
is_active   | boolean
```

**downloads table:**
```sql
id          | uuid (PK)
title       | varchar
description | text
file_type   | varchar      -- "PDF", "DOC", "Link"
size        | varchar
href        | varchar      -- ❌ This stores broken paths
category    | varchar      -- Legacy string: "rules", "selection"
category_id | uuid (FK)    -- Links to categories.id
is_active   | boolean
```

**Current Data Issues:**
1. `categories.page` field determines Policies vs Classification pages
2. BUT documents are being assigned categories with `page='policies'`
3. Downloads have `href` with invalid paths (just filenames)
4. No validation prevents wrong file types

---

## ✅ Complete Fix Implementation

### Fix #1: Separate Categories by Page Type

**Create proper classification categories:**

```sql
-- Create dedicated classification categories
INSERT INTO categories (name, slug, page, "order", is_active) VALUES
  ('Medical Classification', 'medical_classification', 'classification', 1, true),
  ('IPC License', 'ipc_license', 'classification', 2, true),
  ('National Classification', 'national_classification', 'classification', 3, true),
  ('General Classification', 'classification', 'classification', 4, true)
ON CONFLICT (slug) DO UPDATE SET
  page = EXCLUDED.page,
  name = EXCLUDED.name;

-- Ensure policies categories stay on policies page
UPDATE categories SET page = 'policies' 
WHERE slug IN ('rules', 'selection', 'calendar', 'match')
  AND page != 'policies';
```

### Fix #2: Update Admin Classification to Use categoryId

**Backend: Add filtering by page type**

Create new endpoint or update service:

```typescript
// apps/api/src/downloads/downloads.service.ts

async findByPage(page: 'policies' | 'classification'): Promise<Download[]> {
  // Get categories for this page
  const categories = await this.categoriesService.findAll(page);
  const categoryIds = categories.map(c => c.id);
  
  if (categoryIds.length === 0) {
    return [];
  }
  
  return this.downloadRepository.find({
    where: {
      categoryId: In(categoryIds),
      isActive: true
    },
    relations: ['categoryRel'],
    order: { createdAt: 'DESC' }
  });
}
```

**Controller update:**

```typescript
// apps/api/src/downloads/downloads.controller.ts

@Public()
@Get()
findAll(@Query('page') page?: 'policies' | 'classification') {
  if (page) {
    return this.downloadsService.findByPage(page);
  }
  return this.downloadsService.findAll();
}
```

### Fix #3: Update Frontend Admin Classification

```typescript
// apps/web/src/app/(dashboard)/admin/classification/page.tsx

const fetchClassification = async () => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'
    // ✅ Use page filter instead of category string filter
    const res = await fetch(`${baseUrl}/downloads?page=classification`, {
      credentials: 'include',
    })
    if (res.ok) {
      const json = await res.json()
      const data = Array.isArray(json) ? json : (json.data || [])
      setItems(data) // Already filtered by backend
    }
  } catch (error) {
    console.error('Failed to fetch classification:', error)
  } finally {
    setLoading(false)
  }
}
```

### Fix #4: Update Frontend Public Classification Page

```typescript
// apps/web/src/app/(public)/classification/page.tsx:42-45

// ✅ Filter downloads by classification page, not all downloads
const docRes = await fetch(`${apiUrl}/downloads?page=classification`, { 
  credentials: 'include' 
})
const docsData = await docRes.json()
const documentsArray = Array.isArray(docsData) ? docsData : (docsData.data || [])
```

### Fix #5: Update Frontend Policies Page (Already Correct)

```typescript
// apps/web/src/app/(public)/policies/page.tsx:36
// ✅ This is already correct
const catRes = await fetch(`${apiUrl}/categories?page=policies`, { 
  credentials: 'include',
  cache: 'no-store'
})

// ❌ BUT change downloads fetch:
const docRes = await fetch(`${apiUrl}/downloads?page=policies`, { 
  credentials: 'include' 
})
```

### Fix #6: Update Admin Policies Page

```typescript
// apps/web/src/app/(dashboard)/admin/policies/page.tsx

const fetchPolicies = async () => {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'
    // ✅ Use page filter
    const res = await fetch(`${API_URL}/downloads?page=policies`, {
      credentials: 'include',
    })
    if (res.ok) {
      const json = await res.json()
      const data = Array.isArray(json) ? json : (json.data || [])
      setItems(data) // No client-side filtering needed
    }
  } catch (error) {
    console.error('Failed to fetch policies:', error)
  } finally {
    setLoading(false)
  }
}
```

### Fix #7: File Upload Path Generation

**Update both create pages to ensure full paths:**

```typescript
// apps/web/src/app/(dashboard)/admin/policies/create/page.tsx
// apps/web/src/app/(dashboard)/admin/classification/create/page.tsx

const uploadDocument = async (apiUrl: string) => {
  if (!file) return null;

  const uploadFormData = new FormData()
  uploadFormData.append('document', file)

  const uploadRes = await fetch(`${apiUrl}/upload/document`, {
    method: 'POST',
    credentials: 'include',
    body: uploadFormData
  })

  if (!uploadRes.ok) {
    throw new Error('File upload failed');
  }

  const uploadJson = await uploadRes.json();
  let filename: string | undefined;

  if (uploadJson.data?.file?.filename) {
    filename = uploadJson.data.file.filename;
  } else if (uploadJson.file?.filename) {
    filename = uploadJson.file.filename;
  }

  if (!filename) {
    throw new Error('Upload successful but filename missing in response');
  }

  // ✅ ALWAYS return full path with /uploads prefix
  return `/uploads/documents/${filename}`;
}

const createDownloadEntry = async (finalHref: string, apiUrl: string) => {
  // Validate href is a full URL or starts with /uploads
  if (!finalHref.startsWith('http') && !finalHref.startsWith('/uploads')) {
    throw new Error('Invalid file path. Must start with http or /uploads');
  }

  const payload = {
    ...formData,
    href: finalHref,
    isActive: true
  }

  // ... rest of code
}
```

### Fix #8: Add File Type Validation

**Frontend validation (both create pages):**

```typescript
// Add to handleFileChange
const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files[0]) {
    const selectedFile = e.target.files[0]
    
    // ✅ Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 
                         'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!allowedTypes.includes(selectedFile.type)) {
      alert('Only PDF and DOC/DOCX files are allowed');
      e.target.value = '';
      return;
    }
    
    // ✅ Validate file size (10MB)
    const MAX_SIZE_BYTES = 10 * 1024 * 1024;
    if (selectedFile.size > MAX_SIZE_BYTES) {
      alert('File size exceeds 10MB limit');
      e.target.value = '';
      return;
    }

    setFile(selectedFile)
    const sizeInMB = (selectedFile.size / (1024 * 1024)).toFixed(2)
    setFormData(prev => ({
      ...prev,
      size: `${sizeInMB} MB`,
      fileType: getFileType(selectedFile.name)
    }))
  }
}
```

**Backend validation:**

```typescript
// apps/api/src/upload/upload.controller.ts

const documentConfig = {
  storage: memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    // ✅ Only allow PDF and DOC files
    const allowedMimes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and DOC/DOCX files are allowed'), false);
    }
  },
};
```

### Fix #9: Clean Up Broken Data

**SQL to find and fix broken downloads:**

```sql
-- Find downloads with invalid hrefs
SELECT id, title, href, category 
FROM downloads 
WHERE href NOT LIKE 'http%' 
  AND href NOT LIKE '/uploads/%'
  AND is_active = true;

-- Option 1: Mark as inactive (safe)
UPDATE downloads 
SET is_active = false 
WHERE href NOT LIKE 'http%' 
  AND href NOT LIKE '/uploads/%'
  AND is_active = true;

-- Option 2: Delete completely (if confirmed bad data)
DELETE FROM downloads 
WHERE href NOT LIKE 'http%' 
  AND href NOT LIKE '/uploads/%'
  AND id IN ('list-of-bad-ids');
```

---

## 🎯 Implementation Checklist

### Backend Changes

- [ ] **1. Create classification categories SQL script**
  - File: `apps/api/migrations/20260205_fix_classification_categories.sql`
  - Create 4 classification categories with `page='classification'`
  - Ensure policies categories have `page='policies'`

- [ ] **2. Update DownloadsService**
  - File: `apps/api/src/downloads/downloads.service.ts`
  - Add `findByPage(page: string)` method
  - Use proper JOIN with categories table

- [ ] **3. Update DownloadsController**
  - File: `apps/api/src/downloads/downloads.controller.ts`
  - Modify `findAll()` to accept `page` query parameter
  - Return filtered results by page

- [ ] **4. Add file type validation**
  - File: `apps/api/src/upload/upload.controller.ts`
  - Update `documentConfig` to restrict MIME types
  - Return clear error messages

- [ ] **5. Run migration**
  ```bash
  cd apps/api
  npm run migration:run
  ```

### Frontend Admin Changes

- [ ] **6. Fix Admin Classification page**
  - File: `apps/web/src/app/(dashboard)/admin/classification/page.tsx`
  - Change fetch to use `?page=classification`
  - Remove hardcoded category filter

- [ ] **7. Fix Admin Policies page**
  - File: `apps/web/src/app/(dashboard)/admin/policies/page.tsx`
  - Change fetch to use `?page=policies`
  - Remove hardcoded category exclusion

- [ ] **8. Fix Classification Create page**
  - File: `apps/web/src/app/(dashboard)/admin/classification/create/page.tsx`
  - Ensure categories fetch uses `?page=classification`
  - Add file type validation
  - Ensure href uses full path

- [ ] **9. Fix Policies Create page**
  - File: `apps/web/src/app/(dashboard)/admin/policies/create/page.tsx`
  - Ensure categories fetch uses `?page=policies`
  - Add file type validation
  - Ensure href uses full path

- [ ] **10. Fix Classification Edit page**
  - File: `apps/web/src/app/(dashboard)/admin/classification/[id]/edit/page.tsx`
  - Same changes as create page

- [ ] **11. Fix Policies Edit page**
  - File: `apps/web/src/app/(dashboard)/admin/policies/[id]/edit/page.tsx`
  - Same changes as create page

### Frontend Public Changes

- [ ] **12. Fix Public Classification page**
  - File: `apps/web/src/app/(public)/classification/page.tsx`
  - Change downloads fetch to use `?page=classification`

- [ ] **13. Fix Public Policies page**
  - File: `apps/web/src/app/(public)/policies/page.tsx`
  - Change downloads fetch to use `?page=policies`

### Data Cleanup

- [ ] **14. Audit production database**
  - Find downloads with invalid hrefs
  - Check which documents should be policies vs classification
  - Reassign category_id values

- [ ] **15. Fix or remove broken downloads**
  - Either mark inactive or delete
  - Re-upload files with correct paths

### Testing

- [ ] **16. Test Admin Classification**
  - Verify empty state shows initially
  - Create new classification document
  - Verify it appears in list
  - Verify it does NOT appear in Policies

- [ ] **17. Test Admin Policies**
  - Create new policy document
  - Verify it appears in Policies list
  - Verify it does NOT appear in Classification

- [ ] **18. Test Public Pages**
  - Verify Policies page shows only policies
  - Verify Classification page shows only classifications
  - Pages should show different content

- [ ] **19. Test File Downloads**
  - Upload PDF via Policies admin
  - Click download on public Policies page
  - Verify file opens/downloads correctly
  - Repeat for Classification

- [ ] **20. Test File Validation**
  - Try uploading .json file → Should be rejected
  - Try uploading 15MB file → Should be rejected
  - Try uploading PDF → Should succeed

---

## 📊 Expected Results After Fixes

### Admin Panel

**Policies Section:**
- Shows only documents with `category_id` linked to categories where `page='policies'`
- Categories dropdown shows: Rules, Selection, Calendar, Match
- All uploaded files have valid paths: `/uploads/documents/filename.pdf`

**Classification Section:**
- Shows only documents with `category_id` linked to categories where `page='classification'`
- Categories dropdown shows: Medical Classification, IPC License, National Classification, General Classification
- All uploaded files have valid paths: `/uploads/documents/filename.pdf`

### Public Website

**Policies Page (`/policies`):**
- Shows categories: Rules, Selection, Calendar, Match
- Shows documents assigned to those categories
- Download links work correctly

**Classification Page (`/classification`):**
- Shows categories: Medical Classification, IPC License, National Classification, General Classification
- Shows documents assigned to those categories
- Download links work correctly
- **DIFFERENT content than Policies page**

### File Downloads

✅ All file hrefs in database: `/uploads/documents/actual-filename.pdf` or `https://external-url.com`
✅ Files accessible at: `https://yoursite.com/uploads/documents/filename.pdf`
✅ Only PDF/DOC/DOCX files accepted
✅ File size limited to 10MB

---

## 🔍 Validation Commands

### Check Categories

```sql
SELECT id, name, slug, page, "order", is_active 
FROM categories 
ORDER BY page, "order";

-- Expected:
-- | id | name                    | slug                    | page           | order |
-- |----|-------------------------|-------------------------|----------------|-------|
-- | .. | Medical Classification  | medical_classification  | classification | 1     |
-- | .. | IPC License             | ipc_license             | classification | 2     |
-- | .. | National Classification | national_classification | classification | 3     |
-- | .. | General Classification  | classification          | classification | 4     |
-- | .. | Rules                   | rules                   | policies       | 1     |
-- | .. | Selection               | selection               | policies       | 2     |
-- | .. | Calendar                | calendar                | policies       | 3     |
-- | .. | Match                   | match                   | policies       | 5     |
```

### Check Downloads

```sql
-- Count by page
SELECT c.page, COUNT(d.id) as document_count
FROM downloads d
JOIN categories c ON d.category_id = c.id
WHERE d.is_active = true
GROUP BY c.page;

-- Expected:
-- | page           | document_count |
-- |----------------|----------------|
-- | policies       | 5              |
-- | classification | 3              |

-- Check hrefs are valid
SELECT id, title, href, 
  CASE 
    WHEN href LIKE 'http%' THEN '✅ External URL'
    WHEN href LIKE '/uploads/%' THEN '✅ Valid Path'
    ELSE '❌ Invalid Path'
  END as status
FROM downloads 
WHERE is_active = true;
```

### API Testing

```bash
# Test categories endpoint
curl "http://localhost:4000/api/v1/categories?page=policies"
curl "http://localhost:4000/api/v1/categories?page=classification"

# Test downloads endpoint
curl "http://localhost:4000/api/v1/downloads?page=policies"
curl "http://localhost:4000/api/v1/downloads?page=classification"

# Test file serving
curl -I "http://localhost:4000/uploads/documents/test.pdf"
# Should return 200 OK with Content-Type: application/pdf
```

---

## 🚨 Common Pitfalls to Avoid

1. **Don't filter by `category` string field** - Use `categoryId` FK relationship
2. **Don't store just filename in href** - Always use full path `/uploads/documents/filename`
3. **Don't allow any file type** - Validate MIME types server-side
4. **Don't fetch all downloads then filter client-side** - Filter at API level
5. **Don't confuse category slug with category page** - They're different concepts

---

## 📝 Summary

The issues stem from architectural confusion between:
1. Categories (organizational structure) 
2. Downloads (actual documents)
3. Page assignment (policies vs classification)

The fix involves:
1. Properly separating categories by `page` field
2. Using proper JOIN queries instead of string matching
3. Fixing file paths to use full URLs
4. Adding file type validation
5. Updating all frontend pages to use page-based filtering

After implementation, Policies and Classification will be completely separate systems sharing the same technical infrastructure but showing different data.
