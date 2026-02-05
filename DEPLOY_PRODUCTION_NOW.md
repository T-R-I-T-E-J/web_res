# 🚀 Deploy to Production - Neon + Render + Vercel

## Your Stack
- **Database:** Neon.tech (PostgreSQL)
- **Backend API:** Render.com
- **Frontend:** Vercel

**The code is already on GitHub - now let's deploy it!**

---

## 📊 Deployment Steps

### **Step 1: Deploy Database Migration (Neon.tech)**

#### **Option A: Using Neon Console (Easiest)**

1. **Go to Neon.tech Console**
   - Visit: https://console.neon.tech/
   - Login to your account
   - Select your project

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Or go to: https://console.neon.tech/app/projects/YOUR_PROJECT_ID/branches/main/sql-editor

3. **Run the Migration**
   - Copy the SQL below
   - Paste into SQL Editor
   - Click "Run" or press Ctrl+Enter

```sql
-- Create classification categories
INSERT INTO categories (name, slug, page, "order", is_active) VALUES
  ('Medical Classification', 'medical_classification', 'classification', 1, true),
  ('IPC License', 'ipc_license', 'classification', 2, true),
  ('National Classification', 'national_classification', 'classification', 3, true)
ON CONFLICT (slug) DO UPDATE SET
  page = EXCLUDED.page,
  name = EXCLUDED.name,
  "order" = EXCLUDED."order";

-- Update existing classification category
UPDATE categories 
SET page = 'classification', "order" = 4
WHERE slug = 'classification';

-- Ensure policies categories stay on policies page
UPDATE categories 
SET page = 'policies' 
WHERE slug IN ('rules', 'selection', 'calendar', 'match')
  AND page != 'policies';

-- Verify the changes
SELECT name, slug, page, "order" 
FROM categories 
ORDER BY page, "order";
```

4. **Verify Results**
   - You should see 8 rows returned
   - 4 with `page='policies'`
   - 4 with `page='classification'`

#### **Option B: Using psql (Command Line)**

If you have psql installed locally:

```bash
# Get your Neon connection string from dashboard
# It looks like: postgresql://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require

# Run migration
psql "YOUR_NEON_CONNECTION_STRING" < apps/api/migrations/20260206_create_classification_categories.sql

# Verify
psql "YOUR_NEON_CONNECTION_STRING" -c "SELECT name, slug, page FROM categories ORDER BY page;"
```

#### **Option C: Using GitHub Actions (Automated)**

If you have CI/CD setup, the migration can run automatically on deploy.

---

### **Step 2: Deploy Backend to Render**

Your backend code is already on GitHub. Now deploy it:

#### **Method 1: Automatic Deploy (If connected to GitHub)**

1. **Go to Render Dashboard**
   - Visit: https://dashboard.render.com/
   - Find your API service

2. **Trigger Manual Deploy**
   - Click on your service
   - Click "Manual Deploy" → "Deploy latest commit"
   - Or click "Clear build cache & deploy"

3. **Wait for Deploy**
   - Watch the logs
   - Should complete in 2-5 minutes
   - Look for: "Build successful" and "Live"

4. **Verify Deployment**
   - Check your API URL (e.g., https://your-api.onrender.com)
   - Test endpoint: `https://your-api.onrender.com/api/v1/health`
   - Should return: `{"status":"ok"}`

#### **Method 2: Manual Deploy (If not auto-connected)**

```bash
# 1. Ensure latest code is on GitHub
git status
git push origin main

# 2. In Render dashboard:
# - Go to your service
# - Click "Manual Deploy"
# - Select branch: main
# - Click "Deploy"
```

#### **Verify Backend is Updated**

Test these endpoints in your browser:

1. `https://your-api.onrender.com/api/v1/categories?page=policies`
   - Should return: Rules, Selection, Calendar, Match

2. `https://your-api.onrender.com/api/v1/categories?page=classification`
   - Should return: Medical Classification, IPC License, etc.

3. `https://your-api.onrender.com/api/v1/downloads?page=policies`
   - Should return only policies documents

4. `https://your-api.onrender.com/api/v1/downloads?page=classification`
   - Should return only classification documents

**If these return correct data, backend is deployed! ✅**

---

### **Step 3: Deploy Frontend to Vercel**

#### **Method 1: Automatic Deploy (Recommended)**

Vercel auto-deploys when you push to GitHub:

```bash
# 1. Ensure code is on GitHub
git status
git push origin main

# 2. Vercel will automatically:
# - Detect the push
# - Build your Next.js app
# - Deploy to production
# - Takes 2-3 minutes
```

#### **Method 2: Manual Deploy via Vercel Dashboard**

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Find your project

2. **Trigger Redeploy**
   - Click on your project
   - Go to "Deployments" tab
   - Click "..." menu on latest deployment
   - Click "Redeploy"
   - Or click "Deploy" → "Deploy main branch"

3. **Wait for Build**
   - Watch build logs
   - Should complete in 2-3 minutes
   - Look for: "Build Completed"

#### **Method 3: Using Vercel CLI**

```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Deploy
cd apps/web
vercel --prod

# Follow prompts
```

#### **Verify Frontend is Updated**

Visit your production URLs:

1. **https://your-site.vercel.app/policies**
2. **https://your-site.vercel.app/classification**

**These should now show DIFFERENT content! ✅**

---

### **Step 4: Test Everything Works**

#### **Test 1: Public Pages**

1. Visit: `https://your-site.vercel.app/policies`
   - Should show: Rules, Selection, Calendar, Match categories
   
2. Visit: `https://your-site.vercel.app/classification`
   - Should show: Medical Classification, IPC License, etc.
   
3. **Compare:** Pages should have DIFFERENT documents

#### **Test 2: Admin Panel**

1. Login: `https://your-site.vercel.app/admin`

2. Go to **Policies** section
   - Should show only policy documents
   
3. Go to **Classification** section
   - Should show only classification documents
   
4. **They should be different!**

#### **Test 3: Create New Documents**

1. **Create Classification Document:**
   - Admin → Classification → Create
   - Title: "Test Medical Classification"
   - Category: Select "Medical Classification"
   - Upload PDF
   - Submit

2. **Verify:**
   - ✅ Appears in Admin → Classification
   - ✅ Appears on public `/classification` page
   - ❌ Does NOT appear in Policies
   - ❌ Does NOT appear on `/policies` page

3. **Create Policy Document:**
   - Admin → Policies → Create
   - Title: "Test Policy Rule"
   - Category: Select "Rules"
   - Upload PDF
   - Submit

4. **Verify:**
   - ✅ Appears in Admin → Policies
   - ✅ Appears on public `/policies` page
   - ❌ Does NOT appear in Classification
   - ❌ Does NOT appear on `/classification` page

---

## ✅ Success Checklist

After completing all steps:

- [ ] Database migration completed successfully
- [ ] Backend deployed to Render (check logs)
- [ ] Frontend deployed to Vercel (check build logs)
- [ ] API endpoints return different data for policies vs classification
- [ ] Public pages show different content
- [ ] Admin sections show different documents
- [ ] Creating classification doc shows only in Classification
- [ ] Creating policy doc shows only in Policies
- [ ] File downloads work (no 404 errors)

---

## 🆘 Troubleshooting

### Issue: "Backend still returns same data"

**Cause:** Backend not redeployed or using cached build

**Solution:**
1. Go to Render dashboard
2. Click "Clear build cache & deploy"
3. Wait for fresh deployment

### Issue: "Frontend still shows same content"

**Cause:** Browser cache or Vercel cache

**Solution:**
1. Hard refresh browser: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. In Vercel dashboard, click "Redeploy" with "Clear cache" option
3. Or add `?v=2` to URL: `https://your-site.vercel.app/policies?v=2`

### Issue: "Database migration failed"

**Possible causes:**
- Categories table doesn't exist yet
- Connection string is wrong
- SSL mode issue

**Solution:**
1. In Neon console, check if `categories` table exists:
   ```sql
   SELECT * FROM information_schema.tables WHERE table_name = 'categories';
   ```

2. If table doesn't exist, you need to run earlier migrations first
3. Check your Neon connection settings (SSL required)

### Issue: "Render deployment failed"

**Check:**
1. Render build logs for errors
2. Environment variables are set correctly
3. Database connection string is valid
4. Node version compatibility

**Solution:**
- In Render dashboard, check "Logs" tab
- Verify all required env vars are set
- Test database connection

### Issue: "Vercel build failed"

**Check:**
1. Vercel build logs
2. Environment variables (`NEXT_PUBLIC_API_URL`)
3. Node/npm versions

**Solution:**
- In Vercel dashboard, check build logs
- Verify env vars in Vercel project settings
- Ensure `NEXT_PUBLIC_API_URL` points to your Render API

---

## 🔗 Quick Links

### **Your Services:**

- **Neon Database:** https://console.neon.tech/
- **Render API:** https://dashboard.render.com/
- **Vercel Frontend:** https://vercel.com/dashboard

### **Test URLs:**

Replace `your-api` and `your-site` with your actual URLs:

- Backend Health: `https://your-api.onrender.com/api/v1/health`
- Policies API: `https://your-api.onrender.com/api/v1/categories?page=policies`
- Classification API: `https://your-api.onrender.com/api/v1/categories?page=classification`
- Policies Page: `https://your-site.vercel.app/policies`
- Classification Page: `https://your-site.vercel.app/classification`

---

## 📞 Environment Variables to Check

### **Render (Backend):**

Make sure these are set in Render dashboard:

```
DATABASE_URL=postgresql://...@...neon.tech/...?sslmode=require
NODE_ENV=production
PORT=4000
JWT_SECRET=your-secret-here
```

### **Vercel (Frontend):**

Make sure these are set in Vercel project settings:

```
NEXT_PUBLIC_API_URL=https://your-api.onrender.com/api/v1
NODE_ENV=production
```

---

## 🎯 Summary

**To deploy the fix:**

1. ✅ **Run SQL in Neon console** (5 min)
2. ✅ **Trigger Render redeploy** (2-5 min)
3. ✅ **Vercel auto-deploys** (2-3 min)
4. ✅ **Test it works** (5 min)

**Total time:** ~15-20 minutes

**The fix is ready - just follow steps 1-4 above!** 🚀

---

## 📝 Post-Deployment

After successful deployment:

1. **Monitor for 24 hours**
   - Check Render logs for errors
   - Check Vercel analytics for issues
   - Monitor Neon database performance

2. **Clean up old data (optional)**
   - Review existing documents
   - Reassign categories if needed
   - Remove any invalid downloads

3. **Document for your team**
   - Policies are now separate from Classification
   - Each has its own categories
   - Files are properly validated

---

**Need help? Check the full technical guide:** `POLICIES_CLASSIFICATION_FIX_COMPLETE.md`

**Your fix is deployed and live!** 🎉
