# Vercel Deployment Checklist

Use this checklist before every Vercel deployment to avoid routing issues.

## 📋 Pre-Deployment Checklist

### 1. Configuration Files

- [ ] `vercel.json` exists in the app directory
- [ ] `vercel.json` has correct `rewrites` configuration
- [ ] `next.config.js` has correct `output` setting
- [ ] Environment variables documented in `.env.example`

### 2. Local Testing

- [ ] Run `npm run build` successfully
- [ ] Run `npm run start` and test production build
- [ ] Test all deep links manually:
  - [ ] `/events/[slug]`
  - [ ] `/news/[slug]`
  - [ ] `/admin/*` routes
  - [ ] Dynamic routes with IDs
- [ ] Test page refreshes on all routes
- [ ] Verify API calls work with production API URL

### 3. Vercel-Specific Testing (Optional but Recommended)

- [ ] Install Vercel CLI: `npm install -g vercel`
- [ ] Run `vercel dev` to simulate Vercel environment
- [ ] Test routes in Vercel dev environment
- [ ] Check build output types (Static/Server/Dynamic)

### 4. Environment Variables

- [ ] All required env vars set in Vercel dashboard
- [ ] `NEXT_PUBLIC_*` variables are accessible client-side
- [ ] API URLs point to correct backend
- [ ] No secrets in client-side env vars

### 5. Security Headers

- [ ] HSTS configured
- [ ] X-Frame-Options set
- [ ] X-Content-Type-Options set
- [ ] CSP configured (if applicable)
- [ ] Referrer-Policy set

### 6. Performance Optimization

- [ ] Static assets have cache headers
- [ ] Images optimized with `next/image`
- [ ] Unused dependencies removed
- [ ] Bundle size checked

## 🚀 Deployment Steps

### 1. Pre-Deployment

```bash
# Ensure you're on the correct branch
git branch

# Pull latest changes
git pull origin main

# Install dependencies
npm install

# Run tests (if available)
npm test

# Build locally
npm run build

# Test production build
npm run start
```

### 2. Deploy

```bash
# Commit changes
git add .
git commit -m "feat: description of changes"

# Push to main (triggers Vercel deployment)
git push origin main
```

### 3. Post-Deployment Verification

- [ ] Check Vercel dashboard for deployment status
- [ ] Wait for deployment to complete
- [ ] Check deployment logs for errors
- [ ] Visit production URL

### 4. Testing in Production

**Test these scenarios**:

1. **Homepage**
   - [ ] Loads correctly
   - [ ] All assets load
   - [ ] No console errors

2. **Deep Links**

   ```
   - [ ] /events/test-event
   - [ ] /news/test-article
   - [ ] /admin/dashboard
   - [ ] /admin/users
   ```

3. **Page Refreshes**
   - [ ] Navigate to any page
   - [ ] Press F5 or Ctrl+R
   - [ ] Page loads correctly (no 404)

4. **Dynamic Routes**
   - [ ] Click on event → `/events/[slug]`
   - [ ] Click on news → `/news/[slug]`
   - [ ] Edit pages → `/admin/news/[id]`

5. **API Integration**
   - [ ] Login works
   - [ ] Data fetching works
   - [ ] CRUD operations work
   - [ ] File uploads work

6. **Security Headers**
   - [ ] Open DevTools (F12)
   - [ ] Go to Network tab
   - [ ] Check response headers
   - [ ] Verify security headers present

7. **Performance**
   - [ ] Check Lighthouse score
   - [ ] Verify cache headers on static assets
   - [ ] Check Time to First Byte (TTFB)

## 🔍 Common Issues & Quick Fixes

### Issue: 404 on Deep Links

**Symptoms**: Routes work locally but 404 on Vercel

**Fix**:

```bash
# Check vercel.json exists
ls apps/web/vercel.json

# If missing, create it
# See docs/VERCEL_404_GUIDE.md for template
```

### Issue: Environment Variables Not Working

**Symptoms**: `undefined` for env vars in production

**Fix**:

1. Go to Vercel Dashboard → Settings → Environment Variables
2. Add missing variables
3. Redeploy

### Issue: Build Fails

**Symptoms**: Deployment fails during build

**Fix**:

```bash
# Check build locally
npm run build

# Fix any TypeScript errors
# Fix any linting errors
# Commit and push again
```

### Issue: API Calls Fail

**Symptoms**: Network errors, CORS issues

**Fix**:

1. Check `NEXT_PUBLIC_API_URL` in Vercel
2. Verify backend is accessible
3. Check CORS configuration on backend

### Issue: Infinite Redirects

**Symptoms**: Page keeps redirecting

**Fix**:

- Check `vercel.json` uses `rewrites` not `redirects`
- Verify middleware doesn't cause loops

## 📊 Monitoring

### Set Up Alerts

1. **Vercel Dashboard**
   - Enable deployment notifications
   - Set up Slack/Discord webhooks

2. **Error Tracking**
   - Monitor 404 rates
   - Track error logs
   - Set up Sentry (optional)

3. **Performance**
   - Enable Vercel Analytics
   - Monitor Core Web Vitals
   - Track API response times

### Regular Checks

**Daily**:

- [ ] Check deployment status
- [ ] Review error logs

**Weekly**:

- [ ] Review 404 rates
- [ ] Check performance metrics
- [ ] Update dependencies

**Monthly**:

- [ ] Security audit
- [ ] Performance optimization
- [ ] Dependency updates

## 🛠️ Rollback Procedure

If deployment has critical issues:

1. **Immediate Rollback**

   ```
   Vercel Dashboard → Deployments → Previous Deployment → Promote to Production
   ```

2. **Fix Locally**

   ```bash
   git revert HEAD
   git push origin main
   ```

3. **Or Redeploy Previous Commit**
   ```bash
   git reset --hard <previous-commit-hash>
   git push --force origin main
   ```

## 📚 Reference Documents

- **Vercel 404 Guide**: `docs/VERCEL_404_GUIDE.md`
- **Quick Fix Summary**: `VERCEL_FIX_SUMMARY.md`
- **Vercel Config**: `apps/web/vercel.json`
- **Next.js Config**: `apps/web/next.config.js`
- **Environment Vars**: `apps/web/.env.example`

## ✅ Sign-Off

**Deployment Date**: ******\_******  
**Deployed By**: ******\_******  
**Deployment URL**: ******\_******  
**All Tests Passed**: [ ] Yes [ ] No  
**Issues Found**: ******\_******  
**Notes**: ******\_******

---

**Last Updated**: 2026-01-02  
**Version**: 1.0
