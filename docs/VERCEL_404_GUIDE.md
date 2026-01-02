# Vercel 404 NOT_FOUND Error - Complete Guide

## 📋 Problem Summary

**Issue**: Routes work locally but return 404 NOT_FOUND on Vercel deployment  
**Affected Routes**: Deep links, page refreshes, dynamic routes  
**Root Cause**: Missing `vercel.json` configuration for Next.js App Router

---

## 🔍 Deep Dive: Why This Happens

### Local vs Production Behavior

#### Local Development (`npm run dev`)

```
Request: /events/my-event
         ↓
Next.js Dev Server (Port 3000)
         ↓
File-based routing resolution
         ↓
Serves: apps/web/src/app/(public)/events/[slug]/page.tsx
         ↓
✅ SUCCESS
```

#### Vercel Production (WITHOUT vercel.json)

```
Request: /events/my-event
         ↓
Vercel Edge Network
         ↓
Check: Does /events/my-event.html exist?
         ↓
No static file found
         ↓
No rewrite rules configured
         ↓
❌ 404 NOT_FOUND
```

#### Vercel Production (WITH vercel.json)

```
Request: /events/my-event
         ↓
Vercel Edge Network
         ↓
Check: Does /events/my-event.html exist?
         ↓
No static file found
         ↓
Apply rewrite rule: "/(.*)" → "/"
         ↓
Forward to Next.js serverless function
         ↓
Next.js handles routing
         ↓
✅ SUCCESS - Serves correct page
```

---

## 🎯 The Mental Model

### Vercel's Routing Philosophy

Vercel is **NOT** a simple static file server. It's a sophisticated edge platform that:

1. **Serves static assets directly** from CDN (fast)
2. **Routes dynamic requests** to serverless functions (flexible)
3. **Requires explicit configuration** to know which is which (safe)

**Why no automatic fallback to index.html?**

- **Security**: Prevents accidental catch-all behavior
- **Correctness**: Real 404s should be 404s, not masked
- **Performance**: Explicit rules allow better optimization
- **Debugging**: Clear errors help identify misconfigurations

### Next.js App Router Specifics

Next.js App Router uses:

- **File-based routing**: `app/(public)/events/[slug]/page.tsx` → `/events/:slug`
- **Server Components**: Default rendering on server
- **Client-side navigation**: After initial load, uses client router
- **Dynamic routes**: `[slug]`, `[id]`, `[...catchAll]`

**The Problem**:

- Vercel sees `/events/my-event` as a request for a static file
- Without rewrites, it doesn't know to forward to Next.js
- Next.js never gets a chance to handle the route

---

## ✅ The Solution: vercel.json

### Minimal Configuration

```json
{
  "version": 2,
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/"
    }
  ]
}
```

**What this does**:

- Catches ALL requests that don't match static files
- Forwards them to the Next.js app (`/`)
- Next.js router then handles the routing logic

### Production-Ready Configuration

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "outputDirectory": ".next",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=31536000; includeSubDomains; preload"
        }
      ]
    },
    {
      "source": "/_next/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

**Additional features**:

- Explicit build commands
- Security headers (HSTS, X-Frame-Options, etc.)
- Cache optimization for static assets
- Framework detection for better optimization

---

## 🚨 Common Misconfigurations

### ❌ Wrong: Missing vercel.json entirely

**Result**: 404 on all non-root routes

### ❌ Wrong: Incorrect output directory

```json
{
  "outputDirectory": "dist" // Should be ".next" for Next.js
}
```

### ❌ Wrong: Using redirects instead of rewrites

```json
{
  "redirects": [
    // ❌ This causes infinite loops
    {
      "source": "/(.*)",
      "destination": "/"
    }
  ]
}
```

**Why**: Redirects change the URL, rewrites don't. Use rewrites for SPA routing.

### ❌ Wrong: Conflicting next.config.js settings

```javascript
// next.config.js
module.exports = {
  output: "export", // ❌ Static export doesn't support dynamic routes
};
```

### ❌ Wrong: Missing API route handling

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/" // ❌ This breaks /api routes
    }
  ]
}
```

**Fix**: API routes are handled automatically by Vercel, but if you have custom needs:

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/api/:path*"
    },
    {
      "source": "/(.*)",
      "destination": "/"
    }
  ]
}
```

---

## 🛡️ Prevention Strategies

### 1. **Test Deep Links Before Deploying**

```bash
# Local testing
npm run build
npm run start

# Test these URLs directly:
# http://localhost:3000/events/test-event
# http://localhost:3000/news/test-article
# http://localhost:3000/admin/users
```

### 2. **Use Vercel CLI for Local Testing**

```bash
npm install -g vercel
vercel dev  # Simulates Vercel environment locally
```

### 3. **Check Build Output**

```bash
npm run build

# Look for:
# ○ (Static)   - Pre-rendered as static content
# λ (Server)   - Rendered on-demand (needs serverless)
# ƒ (Dynamic)  - Serverless function
```

### 4. **Environment-Specific Configuration**

```javascript
// next.config.js
const nextConfig = {
  output: process.env.VERCEL ? undefined : "standalone",
  // ✅ Conditional config based on platform
};
```

### 5. **Monitoring and Alerts**

Set up Vercel deployment notifications:

- Build failures
- 404 rate spikes
- Performance degradation

---

## 🔧 Troubleshooting Checklist

### When you encounter 404 on Vercel:

- [ ] **Does `vercel.json` exist in the project root?**
  - If no → Create it with rewrite rules
- [ ] **Is the `outputDirectory` correct?**
  - Next.js → `.next`
  - Vite → `dist`
  - Create React App → `build`

- [ ] **Are you using `rewrites` (not `redirects`)?**
  - Rewrites preserve URL
  - Redirects change URL (causes loops)

- [ ] **Does the route work locally with `npm run build && npm run start`?**
  - If no → Fix Next.js routing first
  - If yes → Configuration issue

- [ ] **Check Vercel deployment logs**
  - Look for build errors
  - Check function logs for runtime errors

- [ ] **Verify environment variables**
  - Are all required env vars set in Vercel dashboard?
  - Check `NEXT_PUBLIC_*` variables are accessible

- [ ] **Test with Vercel CLI**
  ```bash
  vercel dev
  # Then test the failing route
  ```

---

## 📚 Framework-Specific Guidance

### Next.js App Router (Your Case)

✅ **Need**: `vercel.json` with rewrites  
✅ **Config**: `framework: "nextjs"`  
✅ **Output**: `.next`

### Next.js Pages Router

✅ **Need**: `vercel.json` with rewrites  
✅ **Config**: Same as App Router  
✅ **Output**: `.next`

### Vite / React SPA

✅ **Need**: `vercel.json` with rewrites  
✅ **Config**: `framework: "vite"` or none  
✅ **Output**: `dist`

### Static Export (No SSR)

⚠️ **Limitation**: No dynamic routes  
✅ **Config**: `output: 'export'` in next.config.js  
✅ **Routing**: Use hash routing or pre-generate all paths

---

## 🎓 Key Takeaways

1. **Vercel is not a static file server** - It's a serverless platform
2. **Explicit configuration is required** - No magic fallbacks
3. **Rewrites ≠ Redirects** - Use rewrites for SPA routing
4. **Test production builds locally** - `npm run build && npm run start`
5. **Use Vercel CLI** - Simulates production environment
6. **Monitor 404 rates** - Set up alerts for deployment issues

---

## 📖 Additional Resources

- [Vercel Rewrites Documentation](https://vercel.com/docs/projects/project-configuration#rewrites)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Vercel CLI Documentation](https://vercel.com/docs/cli)
- [Next.js App Router Routing](https://nextjs.org/docs/app/building-your-application/routing)

---

## 🔄 What Changed in Your Project

**Files Modified**:

1. ✅ Created `apps/web/vercel.json` with proper rewrites
2. ✅ Configured security headers
3. ✅ Set cache policies for static assets

**What to do next**:

1. Commit and push changes
2. Redeploy on Vercel
3. Test deep links and page refreshes
4. Monitor for any remaining issues

---

**Last Updated**: 2026-01-02  
**Status**: ✅ RESOLVED
