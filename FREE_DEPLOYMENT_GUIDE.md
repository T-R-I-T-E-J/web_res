# 🚀 Free Full Stack Deployment Guide (Testing)

This guide helps you deploy your **Next.js Frontend**, **NestJS Backend**, and **PostgreSQL Database** for **FREE** using the best available options for testing.

## 🏗️ Architecture

- **Frontend**: **Vercel** (Best for Next.js, Free)
- **Backend**: **Render** (Free Web Service, spins down on inactivity)
- **Database**: **Neon.tech** (Free Serverless PostgreSQL, specific for Vercel/Modern stack)

> **⚠️ Limitation**: On free tiers, file uploads will not persist permanently because both Render and Vercel use ephemeral file systems. For production, you would need AWS S3 or Cloudinary. For testing, uploads will work temporarily on Render until the service restarts.

---

## 🛠️ Step 1: Database Setup (Neon)

1. Go to [Neon.tech](https://neon.tech) and Sign Up.
2. Create a **New Project** (e.g., `para-shooting-db`).
3. It will give you a **Connection String** (Postgres URL).
   - Looks like: `postgres://user:password@ep-xyz.region.aws.neon.tech/neondb?sslmode=require`
   - **Copy this URL**. You will need it for both Backend and Frontend (if direct access is used, but mostly Backend).

---

## 🛠️ Step 2: Backend Deployment (Render)

1. Go to [Render Dashboard](https://dashboard.render.com).
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository: `T-R-I-T-E-J/web_res`.
4. Configure the service:
   - **Name**: `para-shooting-api`
   - **Root Directory**: `apps/api` (Important!)
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start:prod`
   - **Instance Type**: Free
5. **Environment Variables** (Click "Advanced" or "Environment"):
   - `NODE_ENV`: `production`
   - `DB_SYNCHRONIZE`: `true` (⚠️ This auto-creates tables for testing. Disable in real prod!)
   - `DATABASE_URL`: _(Paste your Neon Connection String from Step 1)_
   - `JWT_SECRET`: _(Generate a random long string)_
   - `CORS_ORIGIN`: `https://your-frontend-project.vercel.app` (You can update this later, or use `*` for initial test)
   - `API_PREFIX`: `api/v1`
6. Click **Create Web Service**.
7. Wait for deployment.
8. **Copy your Backend URL**. It will look like: `https://para-shooting-api.onrender.com`.

---

## 🛠️ Step 3: Frontend Deployment (Vercel)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard).
2. **Add New...** -> **Project**.
3. Import `T-R-I-T-E-J/web_res`.
4. **Project Settings**:
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/web` (Click Edit to set this!)
5. **Environment Variables**:
   - `NEXT_PUBLIC_API_URL`: _(Paste your Render Backend URL from Step 2)_\
     Example: `https://para-shooting-api.onrender.com/api/v1`
     _(Note: Append `/api/v1` if your backend prefix is set to that)_
6. Click **Deploy**.

---

## 🔄 Verification

1. Open your **Vercel Frontend URL**.
2. Go to the login page.
3. Since the database is new, you need an initial admin user.
   - You might need to seed the database or register if registration is open.
   - OR, check the Backend Logs on Render to see if it seeded any data.

### Troubleshooting "Free Tier" Issues

- **Backend Sleeping**: Render Free services "sleep" after 15 mins of inactivity. The first request will take ~30 seconds to wake it up. Be patient!
- **Database Tables Missing**: Ensure `DB_SYNCHRONIZE=true` was set in Render env vars, then redeploy or restart the service to trigger schema creation.

---

**Enjoy your free testing environment!** 🚀
