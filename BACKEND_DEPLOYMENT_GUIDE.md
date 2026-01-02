# Backend Deployment Guide - NestJS API

## ⚠️ **Important: Backend Deployment Considerations**

Your NestJS backend uses **PostgreSQL database** and requires:

- Database connection (TypeORM + PostgreSQL)
- File uploads (Multer)
- Session management
- Long-running processes

### **Deployment Options:**

---

## **Option 1: Vercel (Serverless) - LIMITED**

### ⚠️ **Limitations:**

- ❌ **No persistent database** (need external PostgreSQL like Supabase, Neon, Railway)
- ❌ **No file system** (uploads need cloud storage like S3, Cloudinary)
- ❌ **10-second timeout** on Hobby plan (may not work for complex queries)
- ❌ **Cold starts** (first request after inactivity is slow)
- ⚠️ **Not ideal for NestJS** with database connections

### ✅ **If you still want to try Vercel:**

You'll need to:

1. Use external PostgreSQL (Supabase, Neon, PlanetScale)
2. Use cloud storage for uploads (AWS S3, Cloudinary)
3. Modify code for serverless compatibility

---

## **Option 2: Railway (Recommended for NestJS + PostgreSQL) ⭐**

### ✅ **Advantages:**

- ✅ **Built-in PostgreSQL** database
- ✅ **Persistent storage** for file uploads
- ✅ **No timeouts** (long-running processes OK)
- ✅ **Always-on** (no cold starts)
- ✅ **Free tier** available ($5 credit/month)
- ✅ **Perfect for NestJS** with TypeORM

### 📋 **Railway Deployment Steps:**

#### 1. **Sign Up**

- Go to: https://railway.app
- Sign in with GitHub

#### 2. **Create New Project**

- Click "New Project"
- Select "Deploy from GitHub repo"
- Choose: `T-R-I-T-E-J/web_res`

#### 3. **Configure Service**

- **Root Directory**: `apps/api`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm run start:prod`
- **Port**: `8080` (or use `PORT` env variable)

#### 4. **Add PostgreSQL Database**

- Click "New" → "Database" → "PostgreSQL"
- Railway automatically creates database
- Connection string auto-injected as `DATABASE_URL`

#### 5. **Set Environment Variables**

```bash
NODE_ENV=production
PORT=${{PORT}}  # Railway provides this
DATABASE_URL=${{Postgres.DATABASE_URL}}  # Auto-injected
JWT_SECRET=your-secret-key-here
CORS_ORIGIN=https://web-res-api.vercel.app
API_PREFIX=api/v1
```

#### 6. **Deploy**

- Railway automatically deploys on git push
- You get a URL like: `https://your-app.railway.app`

---

## **Option 3: Render (Alternative to Railway)**

### ✅ **Advantages:**

- ✅ **Free tier** (with limitations)
- ✅ **PostgreSQL** included
- ✅ **Persistent storage**
- ✅ **Good for NestJS**

### 📋 **Render Deployment Steps:**

#### 1. **Sign Up**

- Go to: https://render.com
- Sign in with GitHub

#### 2. **Create Web Service**

- Click "New" → "Web Service"
- Connect GitHub repo: `T-R-I-T-E-J/web_res`

#### 3. **Configure**

- **Name**: `para-shooting-api`
- **Root Directory**: `apps/api`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm run start:prod`
- **Plan**: Free

#### 4. **Add PostgreSQL**

- Create new PostgreSQL database
- Copy connection string to environment variables

#### 5. **Environment Variables**

```bash
NODE_ENV=production
DATABASE_URL=<your-postgres-url>
JWT_SECRET=your-secret-key
CORS_ORIGIN=https://web-res-api.vercel.app
```

---

## **Option 4: Heroku (Classic Choice)**

### ✅ **Advantages:**

- ✅ **Mature platform**
- ✅ **PostgreSQL** add-on
- ✅ **Good documentation**

### ⚠️ **Disadvantages:**

- ⚠️ **No free tier** anymore (minimum $5/month)

---

## **Option 5: DigitalOcean App Platform**

### ✅ **Advantages:**

- ✅ **$5/month** starter tier
- ✅ **Managed PostgreSQL**
- ✅ **Good performance**

---

## **Comparison Table:**

| Platform         | Free Tier        | PostgreSQL       | File Storage | Cold Starts   | Best For        |
| ---------------- | ---------------- | ---------------- | ------------ | ------------- | --------------- |
| **Railway** ⭐   | $5 credit/month  | ✅ Built-in      | ✅ Yes       | ❌ No         | NestJS + DB     |
| **Render**       | ✅ Yes (limited) | ✅ Yes           | ✅ Yes       | ⚠️ Yes (free) | Small apps      |
| **Vercel**       | ✅ Yes           | ❌ External only | ❌ No        | ✅ Yes        | Frontend only   |
| **Heroku**       | ❌ No            | ✅ Add-on        | ✅ Yes       | ❌ No         | Production apps |
| **DigitalOcean** | ❌ No ($5/mo)    | ✅ Managed       | ✅ Yes       | ❌ No         | Scalable apps   |

---

## **My Recommendation: Railway** 🚂

For your NestJS + PostgreSQL + File Uploads setup, **Railway is the best choice**:

1. **Easy Setup**: Connect GitHub, configure, deploy
2. **Built-in Database**: PostgreSQL included
3. **File Storage**: Persistent volumes for uploads
4. **No Cold Starts**: Always-on backend
5. **Free Credits**: $5/month free tier
6. **Auto-Deploy**: Push to GitHub = auto deploy

---

## **Quick Start: Deploy to Railway**

### **Step 1: Prepare Your Code**

Create `apps/api/railway.json`:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install && npm run build"
  },
  "deploy": {
    "startCommand": "npm run start:prod",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### **Step 2: Update package.json**

Ensure `start:prod` script exists:

```json
{
  "scripts": {
    "start:prod": "node dist/main"
  }
}
```

### **Step 3: Deploy**

1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose `T-R-I-T-E-J/web_res`
5. Set Root Directory: `apps/api`
6. Add PostgreSQL database
7. Set environment variables
8. Deploy!

---

## **Environment Variables for Railway**

```bash
# Application
NODE_ENV=production
PORT=${{PORT}}

# Database (auto-injected by Railway)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this

# CORS (your frontend URL)
CORS_ORIGIN=https://web-res-api.vercel.app

# API
API_PREFIX=api/v1

# File Uploads
UPLOAD_DIR=/app/uploads
MAX_FILE_SIZE=10485760

# Optional: External Services
SENTRY_DSN=
REDIS_URL=
```

---

## **After Deployment**

### **Update Frontend Environment Variable**

Once your backend is deployed, update your frontend:

1. Go to Vercel: https://vercel.com/t-r-i-t-e-js-projects/web-res-api/settings/environment-variables
2. Add/Update:
   ```
   NEXT_PUBLIC_API_URL=https://your-app.railway.app/api/v1
   ```
3. Redeploy frontend

---

## **Testing Your Backend**

Once deployed, test these endpoints:

```bash
# Health check
curl https://your-app.railway.app/api/v1/health

# Test CORS
curl -H "Origin: https://web-res-api.vercel.app" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://your-app.railway.app/api/v1/health

# Test API
curl https://your-app.railway.app/api/v1/events
```

---

## **Cost Estimate**

### **Railway (Recommended)**

- **Free Tier**: $5 credit/month
- **Usage**: ~$5-10/month for small app
- **Includes**: PostgreSQL + App hosting

### **Render**

- **Free Tier**: Yes (with cold starts)
- **Paid**: $7/month (no cold starts)
- **Database**: $7/month extra

### **Vercel (Not Recommended for Backend)**

- **Free**: Yes, but requires external DB
- **External PostgreSQL**: $5-20/month (Supabase, Neon)
- **Total**: $5-20/month

---

## **Next Steps**

1. **Choose a platform** (I recommend Railway)
2. **Deploy backend** following the guide above
3. **Get backend URL** (e.g., `https://your-app.railway.app`)
4. **Update frontend** environment variable
5. **Test integration**

Would you like me to help you deploy to Railway? I can guide you through the process step by step!
