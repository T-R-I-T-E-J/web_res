# 🚀 Vercel Frontend Deployment Guide

## ✅ What We Fixed

1. **`.vercelignore`** - Excludes backend from deployment (fixes 12 function limit)
2. **CSP Headers** - Updated to allow Vercel and Render domains
3. **Monorepo Configuration** - Proper isolation of frontend

---

## 📋 Vercel Project Settings

### **General Settings**

- **Root Directory**: `apps/web`
- **Framework Preset**: **Next.js** (NOT "Other")
- **Node.js Version**: **20.x** (LTS) or **22.x**

### **Build & Development Settings**

#### Install Command

```bash
npm install
```

**⚠️ DO NOT use** `npm install --prefix=../..` - this pulls in the entire monorepo

#### Build Command

```bash
npm run build
```

#### Output Directory

Leave **default** (don't manually set `.next`)

#### Development Command

```bash
npm run dev
```

---

## 🔐 Environment Variables (Production)

Add these in Vercel Dashboard → Settings → Environment Variables:

### Required Variables

```env
# Backend API URL (Render deployment)
NEXT_PUBLIC_API_URL=https://web-res.onrender.com/api/v1

# API URL for server-side rewrites
API_URL=https://web-res.onrender.com

# JWT Secret (must match backend)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Node Environment
NODE_ENV=production
```

### Optional Variables

```env
# If using analytics
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
```

---

## 🔧 After Deployment Checklist

### 1. **Verify Build Success**

- Check Vercel deployment logs
- Should see: ✅ "Build successful"
- Should NOT see: ❌ "12 serverless functions limit"

### 2. **Test API Connection**

Open browser console on your Vercel site and run:

```javascript
fetch("https://web-res.onrender.com/api/v1/health")
  .then((r) => r.json())
  .then(console.log);
```

Should return: `{ "status": "ok", ... }`

### 3. **Test Login**

- Go to `/login`
- Enter credentials
- Check Network tab → should POST to `https://web-res.onrender.com/api/v1/auth/login`
- Should receive JWT token
- Should redirect to `/admin` or `/shooter`

### 4. **Check CSP**

- Open DevTools → Console
- Should NOT see CSP errors
- If you do, verify:
  - Middleware is deployed
  - Nonce is being generated
  - Headers are set correctly

---

## 🐛 Common Issues & Fixes

### Issue: "Unexpected end of JSON input"

**Cause**: Frontend calling wrong API URL or API returning non-JSON

**Fix**:

1. Check Network tab → verify request goes to `https://web-res.onrender.com/api/v1/...`
2. Verify `NEXT_PUBLIC_API_URL` is set in Vercel
3. Redeploy after changing env vars

### Issue: "12 Serverless Functions Limit"

**Cause**: Vercel is deploying backend files

**Fix**:

1. Verify `.vercelignore` exists and is committed
2. Check Root Directory = `apps/web`
3. Redeploy

### Issue: CSP Blocks Resources

**Cause**: Missing domains in CSP

**Fix**:

1. Check `apps/web/src/middleware.ts` has updated `connect-src`
2. Verify nonce is being passed to components
3. Check browser console for specific blocked URL

### Issue: Login POST Returns 404

**Cause**: Using GET instead of POST

**Fix**:

```javascript
// ❌ Wrong
fetch("/api/v1/auth/login");

// ✅ Correct
fetch("https://web-res.onrender.com/api/v1/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
});
```

---

## 📊 Deployment Architecture

```
┌─────────────────────────────────────────┐
│  Vercel (Frontend)                      │
│  https://web-res-api.vercel.app         │
│                                         │
│  - Next.js 14                           │
│  - React 18                             │
│  - Static + SSR pages                   │
│  - Middleware (Auth + CSP)              │
└─────────────┬───────────────────────────┘
              │
              │ API Calls
              │ (NEXT_PUBLIC_API_URL)
              ▼
┌─────────────────────────────────────────┐
│  Render (Backend)                       │
│  https://web-res.onrender.com           │
│                                         │
│  - NestJS API                           │
│  - PostgreSQL (Neon)                    │
│  - JWT Auth                             │
│  - File Uploads                         │
└─────────────────────────────────────────┘
```

---

## 🎯 Next Steps

1. **Push changes** (already done ✅)
2. **Wait for Vercel auto-deploy** (~2-3 minutes)
3. **Verify deployment** using checklist above
4. **Test login flow** end-to-end
5. **Add seed data** to database if needed

---

## 📞 Support

If issues persist:

1. Check Vercel deployment logs
2. Check Render API logs
3. Check browser Network tab
4. Verify all environment variables are set

**Backend Health**: https://web-res.onrender.com/api/v1/health
**Frontend**: https://web-res-api.vercel.app
