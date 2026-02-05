# Architecture Diagram: Policies vs Classification Separation

## System Architecture After Fix

```
┌─────────────────────────────────────────────────────────────────┐
│                         DATABASE LAYER                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐    │
│  │                   categories table                      │    │
│  ├────────────────────────────────────────────────────────┤    │
│  │ id   │ name                   │ slug      │ page       │    │
│  │──────────────────────────────────────────────────────│    │
│  │ 1    │ Rules                  │ rules     │ policies   │    │
│  │ 2    │ Selection              │ selection │ policies   │    │
│  │ 3    │ Medical Classification │ medical..│ classification│  │
│  │ 4    │ IPC License            │ ipc_lic.. │ classification│  │
│  └────────────────────────────────────────────────────────┘    │
│                           ▲                                       │
│                           │ Foreign Key (category_id)            │
│                           │                                       │
│  ┌────────────────────────────────────────────────────────┐    │
│  │                   downloads table                       │    │
│  ├────────────────────────────────────────────────────────┤    │
│  │ id │ title │ href                    │ category_id     │    │
│  │────────────────────────────────────────────────────────│    │
│  │ A  │ Rule1 │ /uploads/documents/a.pdf│ 1 (rules)       │    │
│  │ B  │ Med   │ /uploads/documents/b.pdf│ 3 (medical...)  │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

                            ▲
                            │
                            │ SQL JOIN on category_id
                            │
┌─────────────────────────────────────────────────────────────────┐
│                          API LAYER                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   GET /api/v1/categories?page=policies                           │
│   ┌──────────────────────────────────────┐                      │
│   │ CategoriesService.findAll(page)      │                      │
│   │ → Returns categories WHERE page='...'│                      │
│   └──────────────────────────────────────┘                      │
│                                                                   │
│   GET /api/v1/downloads?page=policies                            │
│   ┌──────────────────────────────────────┐                      │
│   │ DownloadsService.findByPage(page)    │                      │
│   │ 1. Get categories for page           │                      │
│   │ 2. JOIN downloads WHERE category_id  │                      │
│   │    IN (category_ids)                 │                      │
│   │ 3. Return filtered downloads         │                      │
│   └──────────────────────────────────────┘                      │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

                            ▲
                            │
                            │ HTTP Request
                            │
┌─────────────────────────────────────────────────────────────────┐
│                      FRONTEND LAYER                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────┐              ┌──────────────────┐        │
│  │  Policies Page   │              │Classification Page│        │
│  │  /policies       │              │ /classification  │        │
│  ├──────────────────┤              ├──────────────────┤        │
│  │ Fetch:           │              │ Fetch:           │        │
│  │ categories?      │              │ categories?      │        │
│  │   page=policies  │              │   page=classification│    │
│  │                  │              │                  │        │
│  │ downloads?       │              │ downloads?       │        │
│  │   page=policies  │              │   page=classification│    │
│  │                  │              │                  │        │
│  │ Shows:           │              │ Shows:           │        │
│  │ • Rules          │              │ • Medical Class  │        │
│  │ • Selection      │              │ • IPC License    │        │
│  │ • Calendar       │              │ • National Class │        │
│  │ • Match          │              │ • General Class  │        │
│  └──────────────────┘              └──────────────────┘        │
│                                                                   │
│  ┌──────────────────┐              ┌──────────────────┐        │
│  │Admin Policies    │              │Admin Classification│      │
│  │/admin/policies   │              │/admin/classification│      │
│  ├──────────────────┤              ├──────────────────┤        │
│  │ Fetch:           │              │ Fetch:           │        │
│  │ downloads?       │              │ downloads?       │        │
│  │   page=policies  │              │   page=classification│    │
│  │                  │              │                  │        │
│  │ Manages:         │              │ Manages:         │        │
│  │ • Policy docs    │              │ • Class docs     │        │
│  │ • Upload to      │              │ • Upload to      │        │
│  │   policies cats  │              │   class cats     │        │
│  └──────────────────┘              └──────────────────┘        │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

                            ▲
                            │
                            │ User Interaction
                            │
┌─────────────────────────────────────────────────────────────────┐
│                         USER LAYER                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  👤 Public User                    👤 Admin User                 │
│  ├─ Views Policies Page            ├─ Manages Policy Docs       │
│  │  (Rules, Selection, etc.)       │  in Admin Panel             │
│  │                                  │                             │
│  └─ Views Classification Page      └─ Manages Classification    │
│     (Medical, IPC, etc.)              Docs in Admin Panel        │
│                                                                   │
│  ✅ Sees DIFFERENT content          ✅ Two separate sections     │
│  ✅ Clear separation                ✅ Independent management     │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow: Creating a Policy Document

```
1. Admin navigates to /admin/policies/create
   ↓
2. Form loads categories with page='policies'
   GET /api/v1/categories?page=policies
   ← Returns: [Rules, Selection, Calendar, Match]
   ↓
3. Admin fills form:
   - Title: "New Rule 2026"
   - Description: "..."
   - Category: "Rules" (id=1, page='policies')
   - File: uploads rule.pdf
   ↓
4. Frontend validates file:
   - ✅ Type is PDF
   - ✅ Size < 10MB
   ↓
5. File upload:
   POST /api/v1/upload/document
   FormData: { document: File }
   ↓
6. Backend saves file:
   uploads/documents/doc_123456_abc.pdf
   ← Returns: { filename: 'doc_123456_abc.pdf' }
   ↓
7. Frontend creates download entry:
   POST /api/v1/downloads
   {
     title: "New Rule 2026",
     categoryId: "1",  ← Links to Rules (policies)
     href: "/uploads/documents/doc_123456_abc.pdf"
   }
   ↓
8. Backend saves to database:
   downloads table:
   - id: X
   - title: "New Rule 2026"
   - category_id: 1
   - href: "/uploads/documents/doc_123456_abc.pdf"
   ↓
9. SUCCESS! Document appears in:
   ✅ Admin Policies list
   ✅ Public Policies page
   ❌ NOT in Classification pages
```

---

## Data Flow: Creating a Classification Document

```
1. Admin navigates to /admin/classification/create
   ↓
2. Form loads categories with page='classification'
   GET /api/v1/categories?page=classification
   ← Returns: [Medical Class, IPC License, National Class]
   ↓
3. Admin fills form:
   - Title: "Medical Guidelines"
   - Category: "Medical Classification" (id=3, page='classification')
   - File: uploads guidelines.pdf
   ↓
4. Frontend validates file:
   - ✅ Type is PDF
   - ✅ Size < 10MB
   ↓
5. File upload:
   POST /api/v1/upload/document
   ← Returns: { filename: 'doc_789012_def.pdf' }
   ↓
6. Frontend creates download entry:
   POST /api/v1/downloads
   {
     title: "Medical Guidelines",
     categoryId: "3",  ← Links to Medical (classification)
     href: "/uploads/documents/doc_789012_def.pdf"
   }
   ↓
7. Backend saves to database:
   downloads table:
   - id: Y
   - title: "Medical Guidelines"
   - category_id: 3
   - href: "/uploads/documents/doc_789012_def.pdf"
   ↓
8. SUCCESS! Document appears in:
   ✅ Admin Classification list
   ✅ Public Classification page
   ❌ NOT in Policies pages
```

---

## Data Flow: Viewing Public Policies Page

```
User visits /policies
   ↓
Frontend makes 2 requests:

1. GET /api/v1/categories?page=policies
   ↓
   Backend queries:
   SELECT * FROM categories 
   WHERE page = 'policies' 
   AND is_active = true
   ↓
   Returns: [
     { id: 1, name: "Rules", slug: "rules" },
     { id: 2, name: "Selection", slug: "selection" },
     ...
   ]

2. GET /api/v1/downloads?page=policies
   ↓
   Backend queries:
   SELECT d.* 
   FROM downloads d
   JOIN categories c ON d.category_id = c.id
   WHERE c.page = 'policies'
   AND d.is_active = true
   ORDER BY d.created_at DESC
   ↓
   Returns: [
     { 
       id: A, 
       title: "Rule1", 
       href: "/uploads/documents/a.pdf",
       categoryId: 1 
     },
     ...
   ]

   ↓
Page renders:
   ┌─────────────────────┐
   │     Policies        │
   ├─────────────────────┤
   │ Rules               │
   │  • Rule1 [Download] │
   │  • Rule2 [Download] │
   │                     │
   │ Selection           │
   │  • Policy1 [Download]│
   ├─────────────────────┤
```

---

## Data Flow: File Download

```
User clicks "Download" on a document
   ↓
Browser navigates to: /uploads/documents/doc_123456_abc.pdf
   ↓
Next.js rewrites to: {API_URL}/uploads/documents/doc_123456_abc.pdf
   ↓
NestJS ServeStaticModule serves file from:
   process.cwd() + /uploads/documents/doc_123456_abc.pdf
   ↓
Browser receives file:
   Content-Type: application/pdf
   Content-Disposition: inline (or attachment)
   ↓
User sees/downloads the PDF
```

---

## Key Concepts Visualized

### Before Fix (WRONG) ❌

```
categories table
├─ rules (page='policies')
├─ selection (page='policies')
└─ classification (page='policies')  ← WRONG PAGE!

Frontend Policies:
  GET /downloads  ← ALL documents
  Filter on client: category != 'classification'

Frontend Classification:
  GET /downloads  ← ALL documents (same call!)
  Filter on client: category == 'classification'

Result: Both pages fetch same data, filter differently
```

### After Fix (CORRECT) ✅

```
categories table
├─ rules (page='policies')
├─ selection (page='policies')
├─ medical_classification (page='classification')  ← CORRECT!
└─ ipc_license (page='classification')             ← CORRECT!

Frontend Policies:
  GET /downloads?page=policies  ← Only policies documents
  No client-side filtering needed

Frontend Classification:
  GET /downloads?page=classification  ← Only classification documents
  No client-side filtering needed

Result: Each page fetches different data from backend
```

---

## File Storage Structure

```
project-root/
├─ apps/
│  ├─ api/
│  │  └─ uploads/              ← Served by ServeStaticModule
│  │     ├─ documents/          ← Policy & Classification files
│  │     │  ├─ doc_123456_abc.pdf
│  │     │  ├─ doc_789012_def.pdf
│  │     │  └─ doc_345678_ghi.docx
│  │     ├─ profiles/           ← User profile pictures
│  │     └─ results/            ← Competition results
│  └─ web/
└─ ...

URL Mapping:
  /uploads/documents/doc_123456_abc.pdf
    → apps/api/uploads/documents/doc_123456_abc.pdf

  /uploads/profiles/profile_xyz.jpg
    → apps/api/uploads/profiles/profile_xyz.jpg
```

---

## Security & Validation Flow

```
File Upload Request
   ↓
┌───────────────────────────────────┐
│ Frontend Validation (Create Page) │
├───────────────────────────────────┤
│ • File type: PDF, DOC, DOCX       │
│ • File size: < 10MB               │
│ • Shows error if invalid          │
└───────────────────────────────────┘
   ↓ (if valid)
   ↓
┌───────────────────────────────────┐
│ Backend Validation (Multer Config)│
├───────────────────────────────────┤
│ • Check MIME type                 │
│ • Check file extension            │
│ • Reject if mismatch              │
│ • Generate secure filename        │
└───────────────────────────────────┘
   ↓ (if valid)
   ↓
┌───────────────────────────────────┐
│ File Storage                      │
├───────────────────────────────────┤
│ • Save to uploads/documents/      │
│ • Return path to frontend         │
└───────────────────────────────────┘
   ↓
   ↓
┌───────────────────────────────────┐
│ Database Record                   │
├───────────────────────────────────┤
│ • Store full path in href         │
│ • Link to correct category        │
│ • Set is_active = true            │
└───────────────────────────────────┘
```

---

## Error Prevention

### Invalid Path Prevention

```
❌ BEFORE:
href: "filename.json"  ← Just filename, no path
href: "REPORT.json"    ← Wrong extension
href: "#"              ← Placeholder

✅ AFTER:
href: "/uploads/documents/doc_123456_abc.pdf"  ← Full path
href: "https://external-site.com/doc.pdf"      ← External URL
```

### Category Assignment Prevention

```
❌ BEFORE:
Policy created with category='classification'
  → Shows on both pages

✅ AFTER:
Policy form only shows policies categories
  → categoryId links to category with page='policies'
  → Only shows on policies pages
```

---

## Rollback Safety

```
Database Changes:
  Migration adds data (categories)
  ✅ Does NOT delete anything
  ✅ Can be reverted with UPDATE statement

Code Changes:
  Adds new query parameter (?page=)
  ✅ Legacy API still works (no ?page)
  ✅ Backward compatible

Data Cleanup:
  Marks invalid downloads as inactive
  ✅ Does NOT delete records
  ✅ Can be reversed (set is_active=true)
```

---

## Performance Impact

### Before Fix
```
Frontend Policies Page:
  GET /downloads (returns 100 documents)
  Filter client-side (keep 50, discard 50)

Frontend Classification Page:
  GET /downloads (returns 100 documents)
  Filter client-side (keep 50, discard 50)

Total: 200 documents transferred, 100 used
```

### After Fix
```
Frontend Policies Page:
  GET /downloads?page=policies (returns 50 documents)
  No filtering needed

Frontend Classification Page:
  GET /downloads?page=classification (returns 50 documents)
  No filtering needed

Total: 100 documents transferred, 100 used
✅ 50% reduction in data transfer
```

---

## Summary

This architecture ensures:

1. **Data Separation:** Categories have `page` field determining destination
2. **Proper Filtering:** Backend JOINs downloads with categories by page
3. **Valid Paths:** Files always have full paths (/uploads/... or https://...)
4. **Type Safety:** Frontend + backend validate file types
5. **Performance:** Reduced data transfer with backend filtering
6. **Maintainability:** Clear separation between policies and classification

**Result:** Policies and Classification are now completely separate systems.
