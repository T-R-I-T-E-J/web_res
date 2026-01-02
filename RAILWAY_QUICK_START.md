# 🚂 Deploy Backend to Railway - Quick Start

## Why Railway?

Your NestJS backend needs:

- ✅ **PostgreSQL Database** - Railway provides it built-in
- ✅ **File Storage** - Railway has persistent volumes
- ✅ **No Cold Starts** - Always-on backend
- ✅ **Free Tier** - $5 credit/month

**Vercel is NOT suitable** for your backend because it's serverless and doesn't support:

- ❌ Persistent database connections
- ❌ File uploads to local filesystem
- ❌ Long-running processes

---

## 🚀 Deploy in 5 Minutes

### **Step 1: Sign Up for Railway**

1. Go to: **https://railway.app**
2. Click **"Login"**
3. Click **"Login with GitHub"**
4. Authorize Railway

### **Step 2: Create New Project**

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. If prompted, install Railway GitHub App
4. Select repository: **`T-R-I-T-E-J/web_res`**

### **Step 3: Configure the Service**

Railway will detect your code. Configure it:

**Settings to Update:**

1. **Root Directory**:

   ```
   apps/api
   ```

2. **Build Command**:

   ```
   npm install && npm run build
   ```

3. **Start Command**:

   ```
   npm run start:prod
   ```

4. **Watch Paths** (optional):
   ```
   apps/api/**
   ```

### **Step 4: Add PostgreSQL Database**

1. In your project, click **"New"**
2. Select **"Database"**
3. Choose **"Add PostgreSQL"**
4. Railway creates database automatically
5. Connection string is auto-injected as `DATABASE_URL`

### **Step 5: Set Environment Variables**

Click on your service → **"Variables"** tab → Add these:

```bash
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-change-this-to-something-random
CORS_ORIGIN=https://web-res-api.vercel.app
API_PREFIX=api/v1
```

**Note**: Railway auto-provides these:

- `PORT` - Automatically set
- `DATABASE_URL` - From PostgreSQL service

### **Step 6: Deploy!**

1. Click **"Deploy"**
2. Wait 2-5 minutes for build
3. You'll get a URL like: `https://your-app.up.railway.app`

---

## 📋 Environment Variables Reference

### **Required:**

| Variable      | Value                            | Description                           |
| ------------- | -------------------------------- | ------------------------------------- |
| `NODE_ENV`    | `production`                     | Environment mode                      |
| `JWT_SECRET`  | Your secret key                  | JWT signing key (MUST match frontend) |
| `CORS_ORIGIN` | `https://web-res-api.vercel.app` | Your frontend URL                     |
| `API_PREFIX`  | `api/v1`                         | API route prefix                      |

### **Auto-Provided by Railway:**

| Variable       | Source             | Description                |
| -------------- | ------------------ | -------------------------- |
| `PORT`         | Railway            | Port to listen on          |
| `DATABASE_URL` | PostgreSQL service | Database connection string |

### **Optional:**

| Variable        | Example        | Description            |
| --------------- | -------------- | ---------------------- |
| `UPLOAD_DIR`    | `/app/uploads` | File upload directory  |
| `MAX_FILE_SIZE` | `10485760`     | Max upload size (10MB) |

---

## 🔗 Connect Frontend to Backend

Once your backend is deployed:

### **1. Get Your Backend URL**

In Railway dashboard, you'll see your deployment URL:

```
https://your-app.up.railway.app
```

### **2. Update Frontend Environment Variable**

Go to Vercel:

1. Visit: https://vercel.com/t-r-i-t-e-js-projects/web-res-api/settings/environment-variables
2. Add or update:
   ```
   NEXT_PUBLIC_API_URL=https://your-app.up.railway.app/api/v1
   ```
3. Select all environments: Production, Preview, Development
4. Click **"Save"**

### **3. Redeploy Frontend**

1. Go to: https://vercel.com/t-r-i-t-e-js-projects/web-res-api/deployments
2. Click "..." on latest deployment
3. Click **"Redeploy"**

---

## 🧪 Test Your Backend

### **Health Check**

```bash
curl https://your-app.up.railway.app/api/v1/health
```

Expected response:

```json
{
  "status": "ok",
  "timestamp": "2026-01-02T..."
}
```

### **Test CORS**

```bash
curl -H "Origin: https://web-res-api.vercel.app" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://your-app.up.railway.app/api/v1/health
```

Should return CORS headers.

### **Test API Endpoints**

```bash
# Get events
curl https://your-app.up.railway.app/api/v1/events

# Get news
curl https://your-app.up.railway.app/api/v1/news
```

---

## 📊 Monitor Your Deployment

### **View Logs**

In Railway dashboard:

1. Click on your service
2. Go to **"Deployments"** tab
3. Click on latest deployment
4. View **"Logs"** in real-time

### **Check Metrics**

Railway provides:

- CPU usage
- Memory usage
- Network traffic
- Request count

---

## 💰 Cost & Usage

### **Free Tier**

- **$5 credit/month** for free
- Resets monthly
- Includes:
  - App hosting
  - PostgreSQL database
  - Persistent storage

### **Typical Usage**

For a small app:

- **App**: ~$3-5/month
- **Database**: Included
- **Total**: Within free tier!

### **If You Exceed Free Tier**

- Add payment method
- Pay only for what you use
- ~$5-10/month for small apps

---

## 🔄 Auto-Deployment

Railway automatically deploys when you push to GitHub:

```bash
# Make changes to backend
cd apps/api
# ... make changes ...

# Commit and push
git add .
git commit -m "update backend"
git push web_res main

# Railway automatically deploys! 🚀
```

---

## 🛠️ Troubleshooting

### **Build Fails**

**Check:**

- Root Directory is set to `apps/api`
- Build command is correct
- All dependencies in `package.json`

**View logs** in Railway dashboard

### **Database Connection Fails**

**Check:**

- PostgreSQL service is running
- `DATABASE_URL` is injected
- TypeORM configuration uses `process.env.DATABASE_URL`

### **CORS Errors**

**Check:**

- `CORS_ORIGIN` matches your frontend URL exactly
- Include protocol: `https://`
- No trailing slash

### **App Crashes**

**Check logs** for errors:

1. Railway dashboard
2. Click service
3. View "Logs"

---

## 📚 Additional Resources

- **Railway Docs**: https://docs.railway.app
- **Railway Discord**: https://discord.gg/railway
- **Railway Status**: https://status.railway.app

---

## ✅ Deployment Checklist

- [ ] Sign up for Railway
- [ ] Create new project from GitHub
- [ ] Set Root Directory to `apps/api`
- [ ] Configure build and start commands
- [ ] Add PostgreSQL database
- [ ] Set environment variables
- [ ] Deploy backend
- [ ] Get backend URL
- [ ] Update frontend `NEXT_PUBLIC_API_URL`
- [ ] Redeploy frontend
- [ ] Test health endpoint
- [ ] Test CORS
- [ ] Test API endpoints
- [ ] Monitor logs for errors

---

## 🎉 You're Done!

Once completed, you'll have:

✅ **Frontend**: https://web-res-api.vercel.app (Vercel)  
✅ **Backend**: https://your-app.up.railway.app (Railway)  
✅ **Database**: PostgreSQL on Railway  
✅ **Auto-deploy**: On git push

**Your full-stack app is now live!** 🚀

---

**Need help?** Let me know which step you're on and I'll guide you through it!
