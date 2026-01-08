# 🚀 Railway Deployment - Quick Reference Card

## 📍 Current Status

✅ **Code Pushed to GitHub**

- Repository: `https://github.com/T-R-I-T-E-J/web_res.git`
- Latest Commit: `e3768f9` - "feat: Add Railway DATABASE_URL support and complete deployment guide"
- Branch: `main`

✅ **Backend Ready for Deployment**

- DATABASE_URL support added (Railway compatible)
- Configuration supports both Railway and local development
- All dependencies up to date

---

## 🎯 Next Steps - Deploy to Railway

### **1. Sign Up & Create Project (5 minutes)**

1. Go to: **https://railway.app**
2. Click **"Login with GitHub"**
3. Click **"New Project"**
4. Select **"Deploy from GitHub repo"**
5. Choose: **`T-R-I-T-E-J/web_res`**

### **2. Configure Service**

Set these in Railway dashboard:

- **Root Directory**: `apps/api`
- **Build Command**: `cd apps/api && npm install && npm run build`
- **Start Command**: `cd apps/api && npm run start:prod`

### **3. Add PostgreSQL Database**

1. Click **"New"** → **"Database"** → **"PostgreSQL"**
2. Railway auto-injects `DATABASE_URL` ✅

### **4. Set Environment Variables**

Copy these to Railway Variables tab:

```bash
NODE_ENV=production
JWT_SECRET=<generate-using-command-below>
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=<generate-using-command-below>
JWT_REFRESH_EXPIRES_IN=30d
CORS_ORIGIN=https://web-res-api.vercel.app
API_PREFIX=api/v1
ENCRYPTION_KEY=<generate-using-command-below>
MAX_FILE_SIZE=10485760
UPLOAD_DIR=/app/uploads
THROTTLE_TTL=60
THROTTLE_LIMIT=100
LOG_LEVEL=info
```

**Generate Secrets:**

```powershell
# Run these locally to generate secure keys:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### **5. Deploy & Get URL**

1. Railway auto-deploys (wait 2-5 minutes)
2. Go to **Settings** → **Domains** → **Generate Domain**
3. Copy your URL: `https://your-app.up.railway.app`

### **6. Update Frontend**

1. Go to Vercel: https://vercel.com/t-r-i-t-e-js-projects/web-res-api/settings/environment-variables
2. Update: `NEXT_PUBLIC_API_URL=https://your-app.up.railway.app/api/v1`
3. Redeploy frontend

### **7. Test**

```bash
# Health check
curl https://your-app.up.railway.app/api/v1/health

# Should return: {"status":"ok","timestamp":"..."}
```

---

## 📚 Full Documentation

For detailed instructions, see:

- **`RAILWAY_DEPLOYMENT_COMPLETE.md`** - Complete step-by-step guide
- **`RAILWAY_QUICK_START.md`** - Quick start guide
- **`BACKEND_DEPLOYMENT_GUIDE.md`** - Platform comparison

---

## 🆘 Troubleshooting

| Issue                     | Solution                                          |
| ------------------------- | ------------------------------------------------- |
| Build fails               | Check logs in Railway dashboard                   |
| Database connection fails | Verify PostgreSQL service is running              |
| CORS errors               | Ensure `CORS_ORIGIN` matches frontend URL exactly |
| App crashes               | Check environment variables are set               |

---

## ✅ Deployment Checklist

- [ ] Sign up for Railway
- [ ] Create project from GitHub
- [ ] Configure service (root dir, commands)
- [ ] Add PostgreSQL database
- [ ] Generate and set environment variables
- [ ] Deploy and monitor logs
- [ ] Generate Railway domain
- [ ] Test health endpoint
- [ ] Update frontend API URL
- [ ] Test full integration

---

## 💡 Key Features

✅ **DATABASE_URL Support** - Works with Railway's auto-injected connection string
✅ **Backward Compatible** - Still works with individual DB\_\* env vars for local dev
✅ **Auto-Deploy** - Pushes to `main` branch trigger automatic deployments
✅ **Production Ready** - SSL, connection pooling, error handling built-in

---

**Need Help?** Check `RAILWAY_DEPLOYMENT_COMPLETE.md` for detailed instructions!
