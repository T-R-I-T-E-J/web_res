# Vercel Deployment Guide - Step by Step

## 🎯 Prerequisites

Before deploying, ensure you have:

- ✅ GitHub repository: https://github.com/T-R-I-T-E-J/web_res.git
- ✅ Vercel account (sign up at https://vercel.com)
- ✅ `vercel.json` configured (already done ✓)
- ✅ All changes committed and pushed (already done ✓)

---

## 📋 Deployment Steps

### Method 1: Deploy via Vercel Dashboard (Recommended)

#### Step 1: Go to Vercel Dashboard

1. Visit: https://vercel.com/login
2. Sign in with GitHub (recommended) or email

#### Step 2: Import Your Repository

1. Click **"Add New..."** → **"Project"**
2. Click **"Import Git Repository"**
3. Find and select: `T-R-I-T-E-J/web_res`
4. Click **"Import"**

#### Step 3: Configure Project Settings

**Framework Preset**: Next.js (should auto-detect)

**Root Directory**:

```
apps/web
```

⚠️ **IMPORTANT**: Since you have a monorepo, you MUST set the root directory to `apps/web`

**Build and Output Settings**:

- Build Command: `npm run build` (auto-detected)
- Output Directory: `.next` (auto-detected)
- Install Command: `npm install` (auto-detected)

**Environment Variables** (Click "Add" for each):

Required variables:

```
NEXT_PUBLIC_API_URL=https://your-backend-api-url.com/api
```

Optional but recommended:

```
NODE_ENV=production
```

#### Step 4: Deploy

1. Click **"Deploy"**
2. Wait for build to complete (2-5 minutes)
3. You'll get a deployment URL like: `https://web-res-xxx.vercel.app`

---

### Method 2: Deploy via Vercel CLI

#### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

#### Step 2: Login to Vercel

```bash
vercel login
```

#### Step 3: Navigate to Web App Directory

```bash
cd apps/web
```

#### Step 4: Deploy

```bash
# First deployment (interactive)
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Select your account
# - Link to existing project? No
# - Project name? web_res (or your choice)
# - Directory? ./ (current directory)
# - Override settings? No

# Production deployment
vercel --prod
```

---

## ⚙️ Important Configuration for Monorepo

### Vercel Dashboard Settings

After importing, configure these settings:

1. **Project Settings** → **General**
   - Root Directory: `apps/web`
   - Framework Preset: Next.js
   - Node.js Version: 18.x or 20.x

2. **Project Settings** → **Environment Variables**
   Add all required environment variables

3. **Project Settings** → **Git**
   - Production Branch: `main`
   - Automatic deployments: Enabled

---

## 🔐 Environment Variables Setup

### Required Variables

Go to **Project Settings** → **Environment Variables** and add:

| Variable Name         | Value                | Environment                      |
| --------------------- | -------------------- | -------------------------------- |
| `NEXT_PUBLIC_API_URL` | Your backend API URL | Production, Preview, Development |
| `NODE_ENV`            | `production`         | Production                       |

### How to Add:

1. Click **"Add New"**
2. Enter variable name
3. Enter value
4. Select environments (Production, Preview, Development)
5. Click **"Save"**

---

## 🎨 Custom Domain (Optional)

### Add Your Domain

1. Go to **Project Settings** → **Domains**
2. Click **"Add"**
3. Enter your domain (e.g., `parashootingindia.org`)
4. Follow DNS configuration instructions
5. Add these DNS records at your domain registrar:

**For root domain (parashootingindia.org)**:

```
Type: A
Name: @
Value: 76.76.21.21
```

**For www subdomain**:

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

---

## 🔍 Troubleshooting

### Build Fails

**Error**: "No such file or directory"

- **Fix**: Ensure Root Directory is set to `apps/web`

**Error**: "Module not found"

- **Fix**: Check that all dependencies are in `apps/web/package.json`
- Run `npm install` locally to verify

**Error**: TypeScript errors

- **Fix**: Run `npm run build` locally first
- Fix all TypeScript errors before deploying

### 404 Errors on Routes

**Problem**: Deep links return 404

- **Fix**: Already solved! Your `vercel.json` has the correct rewrites

### Environment Variables Not Working

**Problem**: `undefined` for env vars

- **Fix**:
  1. Ensure variables are prefixed with `NEXT_PUBLIC_` for client-side
  2. Redeploy after adding variables
  3. Check variable names match exactly

### API Calls Fail

**Problem**: Network errors, CORS issues

- **Fix**:
  1. Verify `NEXT_PUBLIC_API_URL` is correct
  2. Ensure backend allows CORS from Vercel domain
  3. Check backend is accessible publicly

---

## 📊 Post-Deployment Checklist

After deployment completes:

- [ ] Visit deployment URL
- [ ] Test homepage loads
- [ ] Test deep links (e.g., `/events/test`, `/news/test`)
- [ ] Test page refreshes (F5 on any page)
- [ ] Test dynamic routes
- [ ] Verify images load
- [ ] Check browser console for errors
- [ ] Test API integration (login, data fetching)
- [ ] Verify security headers (DevTools → Network)
- [ ] Test on mobile device
- [ ] Check Lighthouse score

---

## 🔄 Continuous Deployment

Vercel automatically deploys when you push to GitHub:

**Production Deployments**:

- Triggered by: Push to `main` branch
- URL: Your custom domain or `web-res.vercel.app`

**Preview Deployments**:

- Triggered by: Push to any other branch
- URL: Unique preview URL for each branch/PR

**To Deploy Updates**:

```bash
git add .
git commit -m "your changes"
git push web_res main
```

Vercel will automatically build and deploy! 🚀

---

## 📈 Monitoring

### Vercel Analytics

Enable in **Project Settings** → **Analytics**:

- Real User Monitoring (RUM)
- Core Web Vitals
- Page views and performance

### Deployment Notifications

Set up in **Project Settings** → **Notifications**:

- Slack integration
- Discord webhooks
- Email notifications

---

## 🆘 Getting Help

If you encounter issues:

1. **Check Deployment Logs**
   - Vercel Dashboard → Deployments → Click deployment → View logs

2. **Check Function Logs**
   - Vercel Dashboard → Deployments → Click deployment → Functions tab

3. **Vercel Support**
   - Documentation: https://vercel.com/docs
   - Community: https://github.com/vercel/vercel/discussions

---

## 📝 Quick Commands Reference

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy (from apps/web directory)
cd apps/web
vercel

# Deploy to production
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs [deployment-url]

# Remove deployment
vercel rm [deployment-name]
```

---

## ✅ Expected Result

After successful deployment:

- ✅ Live URL: `https://web-res-xxx.vercel.app`
- ✅ All routes work (no 404s)
- ✅ Page refreshes work
- ✅ Deep links work
- ✅ Security headers applied
- ✅ Static assets cached
- ✅ API integration working
- ✅ Auto-deployment on git push

---

**Ready to deploy!** Follow the steps above and your app will be live in minutes! 🎉
