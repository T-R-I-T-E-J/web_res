# Phase 2 - Next Steps Guide

> **Quick Setup Guide for Results PDF Integration**

---

## 🎯 **Current Status**

✅ **Backend Code**: 100% Complete  
✅ **Database Schema**: Designed  
✅ **API Endpoints**: Implemented  
✅ **Security**: Configured  
❌ **Database Migration**: Not run yet  
❌ **Frontend Connection**: Not connected yet

---

## 📋 **Step-by-Step Setup** (30 minutes total)

### **Step 1: Run Database Migration** (5 minutes)

#### Option A: Using psql (Recommended)

```bash
# Connect to your database
psql -h localhost -U psci_admin -d psci_platform

# Run migration
\i apps/api/migrations/003_create_results_table.sql

# Verify table created
\dt results
\d results

# Exit
\q
```

#### Option B: Using Docker

```bash
# Copy migration to container
docker cp apps/api/migrations/003_create_results_table.sql psci-db:/tmp/

# Execute migration
docker exec -it psci-db psql -U psci_admin -d psci_platform -f /tmp/003_create_results_table.sql

# Verify
docker exec -it psci-db psql -U psci_admin -d psci_platform -c "\d results"
```

#### Option C: Using GUI (pgAdmin, DBeaver, etc.)

```sql
-- Open your database tool
-- Connect to psci_platform database
-- Copy and paste contents of:
-- apps/api/migrations/003_create_results_table.sql
-- Execute
```

**Verification**:

```sql
-- Should return results table structure
SELECT * FROM results;

-- Should return 0 rows (table is empty)
SELECT COUNT(*) FROM results;
```

---

### **Step 2: Restart Backend** (2 minutes)

```bash
# Stop current backend (Ctrl+C in terminal)

# Restart
cd apps/api
npm run start:dev

# Wait for "🚀 Para Shooting Committee API is running"
```

**Verification**:

```bash
# Should return 200 OK
curl http://localhost:8080/api/v1/health

# Should return empty array []
curl http://localhost:8080/api/v1/results
```

---

### **Step 3: Test Backend Upload** (10 minutes)

#### 3.1: Create Test PDF

```bash
# Create a simple test PDF (or use any PDF file)
echo "Test PDF Content" > test.pdf
```

#### 3.2: Login as Admin

```bash
# Login
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test.user.flow2@woxsen.edu.in",
    "password": "Password@123"
  }' | jq

# Copy the access_token from response
# Or save it to a file:
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test.user.flow2@woxsen.edu.in",
    "password": "Password@123"
  }' | jq -r '.access_token' > token.txt
```

#### 3.3: Upload PDF

```bash
# Upload test PDF
curl -X POST http://localhost:8080/api/v1/results/upload \
  -H "Authorization: Bearer $(cat token.txt)" \
  -F "file=@test.pdf" \
  -F "title=Test Result 2025" \
  -F "date=2025" \
  -F "description=Test upload" | jq

# Expected response:
# {
#   "id": "uuid...",
#   "title": "Test Result 2025",
#   "date": "2025",
#   "fileName": "test.pdf",
#   "url": "http://localhost:8080/results/uuid-test.pdf",
#   ...
# }
```

#### 3.4: Verify Upload

```bash
# List results (should show 1 result)
curl http://localhost:8080/api/v1/results | jq

# Check database
psql -U psci_admin -d psci_platform -c "SELECT id, title, date FROM results;"

# Check file exists
ls -la results/
```

---

### **Step 4: Connect Frontend** (15 minutes)

#### 4.1: Update Admin Upload Page

**File**: `apps/web/src/app/(dashboard)/admin/scores/page.tsx`

**Current Code** (Mock):

```typescript
const handleUpload = () => {
  setIsUploading(true);
  setTimeout(() => setIsUploading(false), 2000);
};
```

**New Code** (Real API):

```typescript
const handleUpload = async () => {
  if (!selectedFile) {
    alert("Please select a file");
    return;
  }

  setIsUploading(true);

  try {
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("title", title || "Untitled Result");
    formData.append("date", new Date().getFullYear().toString());
    formData.append("description", description || "");

    const token = localStorage.getItem("access_token");

    const response = await fetch(
      "http://localhost:8080/api/v1/results/upload",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Upload failed");
    }

    const result = await response.json();
    console.log("Upload successful:", result);
    alert("PDF uploaded successfully!");

    // Reset form
    setSelectedFile(null);
    setTitle("");
    setDescription("");
  } catch (error) {
    console.error("Upload error:", error);
    alert(`Upload failed: ${error.message}`);
  } finally {
    setIsUploading(false);
  }
};
```

#### 4.2: Update Results Page

**File**: `apps/web/src/app/(public)/results/page.tsx`

**Add API fetch**:

```typescript
"use client";

import { useEffect, useState } from "react";

interface Result {
  id: string;
  title: string;
  date: string;
  description?: string;
  fileName: string;
  url: string;
  uploadedAt: string;
}

export default function ResultsPage() {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/results");
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Failed to fetch results:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Competition Results</h1>
      {results.map((result) => (
        <div key={result.id}>
          <h2>{result.title}</h2>
          <p>Date: {result.date}</p>
          <p>{result.description}</p>
          <a href={result.url} target="_blank" download>
            Download PDF
          </a>
        </div>
      ))}
    </div>
  );
}
```

---

### **Step 5: Test End-to-End** (5 minutes)

#### 5.1: Test Admin Upload

```
1. Open http://localhost:3000/admin/scores
2. Login as admin (test.user.flow2@woxsen.edu.in / Password@123)
3. Select a PDF file
4. Enter title and date
5. Click Upload
6. Should see success message
```

#### 5.2: Test Public View

```
1. Open http://localhost:3000/results
2. Should see uploaded PDF in list
3. Click download link
4. PDF should download
```

#### 5.3: Test Delete (Optional)

```bash
# Get result ID from list
RESULT_ID="<copy-id-from-list>"

# Delete
curl -X DELETE http://localhost:8080/api/v1/results/$RESULT_ID \
  -H "Authorization: Bearer $(cat token.txt)"

# Verify deleted (should return empty array)
curl http://localhost:8080/api/v1/results | jq
```

---

## ✅ **Verification Checklist**

### Backend

- [ ] Database migration ran successfully
- [ ] Results table exists
- [ ] Backend restarted without errors
- [ ] GET /api/v1/results returns empty array
- [ ] POST /api/v1/results/upload works (with admin token)
- [ ] Uploaded file appears in results/ directory
- [ ] GET /api/v1/results returns uploaded result

### Frontend

- [ ] Admin upload page loads
- [ ] File selection works
- [ ] Upload button triggers API call
- [ ] Success message shows after upload
- [ ] Results page loads
- [ ] Results page shows uploaded PDFs
- [ ] Download link works

---

## 🐛 **Troubleshooting**

### Issue: "Table already exists"

```sql
-- Check if table exists
SELECT * FROM information_schema.tables WHERE table_name = 'results';

-- If exists, drop and recreate (CAUTION: deletes data)
DROP TABLE IF EXISTS results CASCADE;
-- Then run migration again
```

### Issue: "Foreign key constraint fails"

```sql
-- Check users table exists
SELECT * FROM users LIMIT 1;

-- If no users, create admin user first
-- Then run migration
```

### Issue: "Cannot POST /api/v1/results/upload"

```bash
# Check backend is running
curl http://localhost:8080/api/v1/health

# Check ResultsModule is registered
# Should see "ResultsModule" in startup logs
```

### Issue: "403 Forbidden on upload"

```bash
# Verify admin role
curl http://localhost:8080/api/v1/auth/me \
  -H "Authorization: Bearer $(cat token.txt)" | jq

# Should show "roles": ["admin"]
```

### Issue: "CORS error in browser"

```typescript
// Check backend CORS config in apps/api/src/main.ts
app.enableCors({
  origin: "http://localhost:3000", // Must match frontend URL
  credentials: true,
});
```

---

## 📊 **Success Criteria**

**Phase 2 is complete when**:

- ✅ Database migration successful
- ✅ Backend endpoints working
- ✅ Admin can upload PDFs
- ✅ Public can view/download PDFs
- ✅ Files stored correctly
- ✅ Frontend connected to backend

---

## 🎯 **Next Steps After Completion**

1. **Phase 3**: Deploy to production

   - Deploy database to Supabase
   - Deploy backend to Railway
   - Deploy frontend to Netlify
   - Migrate to Cloudflare R2 (optional)

2. **Enhancements** (Optional):
   - Add pagination for results list
   - Add search/filter by year
   - Add file preview
   - Add bulk upload
   - Add virus scanning

---

## 📚 **Documentation**

- **API Documentation**: `docs/PDF_UPLOAD_IMPLEMENTATION.md`
- **Database Schema**: `apps/api/migrations/003_create_results_table.sql`
- **Entity**: `apps/api/src/results/entities/result.entity.ts`
- **Controller**: `apps/api/src/results/results.controller.ts`
- **Service**: `apps/api/src/results/services/results.service.ts`

---

**Estimated Time**: 30 minutes  
**Difficulty**: Easy  
**Prerequisites**: Database running, Backend running, Admin user exists

**Ready to start? Begin with Step 1: Run Database Migration!** 🚀
