# 🚀 Complete Railway Deployment Guide

## ✅ Current Status

**Code Status:**

- ✅ Empty commit pushed to trigger Railway deployment
- ✅ Latest commit: `01efe1d` - "trigger: Force Railway deployment for backend"
- ✅ Repository: `https://github.com/T-R-I-T-E-J/web_res.git`
- ✅ Railway configuration file exists at root: `railway.json`

---

## 📋 Step-by-Step Deployment Instructions

### **Step 1: Access Railway Dashboard**

1. Go to: **https://railway.app**
2. Click **"Login"**
3. Click **"Login with GitHub"**
4. Authorize Railway to access your GitHub account

---

### **Step 2: Create New Project**

1. Click **"New Project"** button
2. Select **"Deploy from GitHub repo"**
3. If prompted, install Railway GitHub App and grant access to repositories
4. Select repository: **`T-R-I-T-E-J/web_res`**
5. Railway will start analyzing your repository

---

### **Step 3: Configure the Backend Service**

Railway should auto-detect your configuration from `railway.json`, but verify these settings:

#### **In Service Settings:**

1. **Service Name**: `api` or `para-shooting-api`
2. **Root Directory**: `apps/api`
3. **Build Command**:
   ```bash
   cd apps/api && npm install && npm run build
   ```
4. **Start Command**:
   ```bash
   cd apps/api && npm run start:prod
   ```
5. **Watch Paths** (optional):
   ```
   apps/api/**
   ```

---

### **Step 4: Add PostgreSQL Database**

1. In your Railway project dashboard, click **"New"**
2. Select **"Database"**
3. Choose **"Add PostgreSQL"**
4. Railway will:
   - Create a PostgreSQL instance
   - Generate a connection string
   - Auto-inject it as `DATABASE_URL` environment variable

**Important:** The database connection string will be automatically available to your backend service.

---

### **Step 5: Configure Environment Variables**

Click on your **API service** → **"Variables"** tab → Add these variables:

#### **Required Variables:**

```bash
# Application Environment
NODE_ENV=production

# JWT Authentication (CRITICAL - Must match frontend)
JWT_SECRET=your-super-secret-jwt-key-change-this-to-something-random-and-secure
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-super-secret-refresh-token-key-change-this-too
JWT_REFRESH_EXPIRES_IN=30d

# CORS - Your Frontend URL (Update this with your actual Vercel URL)
CORS_ORIGIN=https://web-res-api.vercel.app

# API Configuration
API_PREFIX=api/v1

# Encryption Key (Generate using the command below)
ENCRYPTION_KEY=your-64-character-encryption-key-here

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_DIR=/app/uploads

# Rate Limiting
THROTTLE_TTL=60
THROTTLE_LIMIT=100

# Logging
LOG_LEVEL=info
```

#### **Auto-Provided by Railway (DO NOT SET MANUALLY):**

- `PORT` - Railway automatically sets this
- `DATABASE_URL` - Auto-injected from PostgreSQL service

#### **How to Generate Secure Keys:**

Run these commands locally to generate secure keys:

```powershell
# Generate JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate JWT_REFRESH_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate ENCRYPTION_KEY
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and paste into Railway environment variables.

---

### **Step 6: Database Configuration**

Your backend is configured to use `DATABASE_URL` environment variable. Railway provides this automatically.

**Database Config Location:** `apps/api/src/config/database.config.ts`

The configuration supports:

- ✅ PostgreSQL connection via `DATABASE_URL` or individual env vars
- ✅ SSL for production (automatically enabled)
- ✅ Connection pooling (max 20 connections)
- ✅ 30-second connection timeout

**No changes needed** - it will work automatically with Railway's `DATABASE_URL`.

---

### **Step 7: Deploy!**

1. Railway should automatically start deploying after you configure the service
2. If not, click **"Deploy"** button
3. Monitor the deployment:
   - Click on your service
   - Go to **"Deployments"** tab
   - Click on the latest deployment
   - Watch the **build logs** in real-time

**Expected Build Process:**

1. ✅ Cloning repository
2. ✅ Installing dependencies (`npm install`)
3. ✅ Building application (`npm run build`)
4. ✅ Starting application (`npm run start:prod`)

**Build Time:** Typically 2-5 minutes

---

### **Step 8: Get Your Backend URL**

Once deployment succeeds:

1. In Railway dashboard, click on your **API service**
2. Go to **"Settings"** tab
3. Scroll to **"Domains"** section
4. Click **"Generate Domain"**
5. Railway will give you a URL like: `https://your-app-name.up.railway.app`

**Save this URL** - you'll need it for the frontend!

---

### **Step 9: Initialize Database Schema**

Your database needs to be initialized with tables and seed data.

#### **Option A: Auto-Sync (Development Mode)**

If `NODE_ENV` is NOT set to `production`, TypeORM will auto-create tables on first run.

#### **Option B: Manual Migration (Recommended for Production)**

1. Connect to your Railway PostgreSQL database
2. Run the initialization script from `infrastructure/database/01-init.sql`

**Using Railway CLI:**

```powershell
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Run database init
railway run psql -f infrastructure/database/01-init.sql
```

**Or use Railway's Web Terminal:**

1. In Railway dashboard, click on **PostgreSQL** service
2. Go to **"Data"** tab
3. Click **"Query"**
4. Copy and paste contents of `infrastructure/database/01-init.sql`
5. Execute

---

### **Step 10: Verify Deployment**

#### **Test Health Endpoint:**

```bash
curl https://your-app-name.up.railway.app/api/v1/health
```

**Expected Response:**

```json
{
  "status": "ok",
  "timestamp": "2026-01-08T12:46:31.000Z",
  "database": "connected"
}
```

#### **Test CORS:**

```bash
curl -H "Origin: https://web-res-api.vercel.app" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://your-app-name.up.railway.app/api/v1/health
```

Should return CORS headers in response.

#### **Test API Endpoints:**

```bash
# Get events
curl https://your-app-name.up.railway.app/api/v1/events

# Get news
curl https://your-app-name.up.railway.app/api/v1/news

# Get downloads
curl https://your-app-name.up.railway.app/api/v1/downloads
```

---

### **Step 11: Connect Frontend to Backend**

Now update your Vercel frontend to use the Railway backend:

1. Go to: **https://vercel.com/t-r-i-t-e-js-projects/web-res-api/settings/environment-variables**
2. Find or add: `NEXT_PUBLIC_API_URL`
3. Set value to: `https://your-app-name.up.railway.app/api/v1`
4. Select environments: **Production**, **Preview**, **Development**
5. Click **"Save"**

#### **Redeploy Frontend:**

1. Go to: **https://vercel.com/t-r-i-t-e-js-projects/web-res-api/deployments**
2. Click **"..."** menu on latest deployment
3. Click **"Redeploy"**
4. Wait for deployment to complete

---

### **Step 12: Test Full Integration**

1. Visit your frontend: `https://web-res-api.vercel.app`
2. Test these features:
   - ✅ Homepage loads
   - ✅ News articles display
   - ✅ Events display
   - ✅ Downloads work
   - ✅ Admin login (if configured)
   - ✅ File uploads (admin)

---

## 📊 Monitoring Your Deployment

### **View Logs:**

1. Railway Dashboard → Your API Service
2. Click **"Deployments"** tab
3. Click on latest deployment
4. View **"Logs"** in real-time

### **Monitor Metrics:**

Railway provides:

- **CPU Usage**
- **Memory Usage**
- **Network Traffic**
- **Request Count**
- **Response Times**

### **Set Up Alerts:**

1. Go to Service Settings
2. Configure health check endpoint: `/api/v1/health`
3. Set up notifications for downtime

---

## 🔄 Auto-Deployment

Railway automatically deploys when you push to GitHub:

```powershell
# Make changes to backend
cd c:\Users\trite\Downloads\demowebsite\apps\api

# ... make your changes ...

# Commit and push
git add .
git commit -m "update: backend feature"
git push web_res main

# Railway automatically deploys! 🚀
```

---

## 💰 Cost & Usage

### **Free Tier:**

- **$5 credit/month** (resets monthly)
- Includes:
  - App hosting
  - PostgreSQL database
  - Persistent storage
  - Bandwidth

### **Typical Usage for Your App:**

- **Backend API**: ~$3-4/month
- **PostgreSQL**: ~$1-2/month
- **Total**: **Within free tier!** 🎉

### **If You Exceed Free Tier:**

- Add payment method
- Pay only for what you use
- Typically $5-10/month for small apps

---

## 🛠️ Troubleshooting

### **Build Fails:**

**Check:**

- ✅ Root Directory is set to `apps/api`
- ✅ Build command is correct
- ✅ All dependencies in `package.json`
- ✅ No TypeScript errors

**View detailed logs** in Railway dashboard.

### **Database Connection Fails:**

**Check:**

- ✅ PostgreSQL service is running
- ✅ `DATABASE_URL` is injected (should be automatic)
- ✅ Database is initialized with schema

**Test connection:**

```bash
railway run node -e "console.log(process.env.DATABASE_URL)"
```

### **CORS Errors:**

**Check:**

- ✅ `CORS_ORIGIN` matches your frontend URL **exactly**
- ✅ Include protocol: `https://`
- ✅ No trailing slash
- ✅ Frontend is using correct backend URL

### **App Crashes on Startup:**

**Common causes:**

- ❌ Missing environment variables
- ❌ Database not initialized
- ❌ Port binding issues (use Railway's `PORT` env var)

**Check startup logs** for specific error messages.

### **File Uploads Don't Work:**

**Check:**

- ✅ `UPLOAD_DIR` is set to `/app/uploads`
- ✅ Directory has write permissions
- ✅ `MAX_FILE_SIZE` is appropriate

**Note:** Railway provides persistent storage automatically.

---

## 📚 Additional Resources

- **Railway Docs**: https://docs.railway.app
- **Railway Discord**: https://discord.gg/railway
- **Railway Status**: https://status.railway.app
- **NestJS Deployment**: https://docs.nestjs.com/deployment

---

## ✅ Deployment Checklist

Use this checklist to track your progress:

- [ ] Sign up for Railway
- [ ] Create new project from GitHub repo `T-R-I-T-E-J/web_res`
- [ ] Configure service (root dir, build/start commands)
- [ ] Add PostgreSQL database
- [ ] Generate secure keys (JWT_SECRET, ENCRYPTION_KEY, etc.)
- [ ] Set all environment variables
- [ ] Deploy backend
- [ ] Monitor build logs for success
- [ ] Generate Railway domain
- [ ] Initialize database schema
- [ ] Test health endpoint
- [ ] Test CORS configuration
- [ ] Test API endpoints
- [ ] Update frontend `NEXT_PUBLIC_API_URL` on Vercel
- [ ] Redeploy frontend
- [ ] Test full integration
- [ ] Set up monitoring and alerts

---

## 🎉 Success!

Once completed, you'll have:

✅ **Frontend**: https://web-res-api.vercel.app (Vercel)  
✅ **Backend**: https://your-app-name.up.railway.app (Railway)  
✅ **Database**: PostgreSQL on Railway  
✅ **Auto-deploy**: On every git push  
✅ **Monitoring**: Real-time logs and metrics

**Your full-stack application is now live in production!** 🚀

---

## 🆘 Need Help?

If you encounter any issues:

1. **Check Railway logs** for error messages
2. **Review this guide** for missed steps
3. **Test each endpoint** individually
4. **Verify environment variables** are set correctly
5. **Check database connection** and schema

**Common Issues:**

- Missing environment variables → Add them in Railway dashboard
- Database not initialized → Run `01-init.sql` script
- CORS errors → Verify `CORS_ORIGIN` matches frontend URL exactly
- Build failures → Check logs for specific error messages

---

**Last Updated:** 2026-01-08  
**Repository:** https://github.com/T-R-I-T-E-J/web_res  
**Frontend:** https://web-res-api.vercel.app
