# Vercel Full Stack Deployment Guide

This repository is configured to deploy both the Next.js Frontend and the NestJS Backend to Vercel, along with a Vercel Postgres database.

## 🏗️ Structure

- **Frontend**: `apps/web` (Next.js) -> Deploys as a standard Vercel project.
- **Backend**: `apps/api` (NestJS) -> Deploys as a Serverless Function (configured via `api/index.ts` and `vercel.json`).
- **Database**: Vercel Postgres -> Managed database.

## ⚠️ Critical Limitations (Read Before Deploying)

### 1. File Uploads

**Problem**: This application currently saves uploaded files to the local disk (`apps/api/uploads`).
**Constraint**: Vercel Serverless Functions have an **ephemeral file system**. Files uploaded to `uploads/` will be **deleted** immediately after the request finishes.
**Solution**: For production, you **MUST** refactor the `MulterConfig` to use an external storage provider like:

- Vercel Blob (Recommended for Vercel)
- AWS S3
- Cloudinary
  **Current State**: Uploads will appear to work but files will disappear.

### 2. Cold Starts

**Constraint**: NestJS can be heavy for serverless cold starts.
**Mitigation**: The `api/setup.ts` refactor helps, but the first request after inactivity might be slow (2-3s).

---

## 🚀 Step 1: Create the Database

1. Go to your Vercel Dashboard.
2. Click **"Storage"** -> **"Create Database"** -> **"Postgres"**.
3. Give it a name (e.g., `web-res-db`).
4. Select a region (should match your function region, commonly `iad1` or `bom1` for India).
5. Once created, go to the **".env.local"** tab or **Quickstart** section to view the secrets.
6. Copy the `POSTGRES_URL`.

---

## 🚀 Step 2: Deploy the Backend (API)

Since Vercel projects map to a specific root directory, you should create a **separate project** for the API.

1. **Import Project**:
   - In Vercel, click **"Add New..."** -> **"Project"**.
   - Select your git repository (`web_res`).
   - Project Name: `web-res-api` (or similar).

2. **Configure Project**:
   - **Root Directory**: Click "Edit" and select `apps/api`.
   - **Framework Preset**: generic (or "Other"). Do NOT select NestJS if it tries to override build settings incorrectly, but usually "Other" is best for this custom serverless setup.
   - **Build Command**: `npm run build` (default is fine, or leave empty if using serverless mode purely).
     - _Note_: Vercel will install dependencies.

3. **Environment Variables**:
   Add the following variables in the Project Settings:
   - `DATABASE_URL`: Paste the `POSTGRES_URL` from Step 1.
   - `JWT_SECRET`: Generate a strong secret.
   - `JWT_REFRESH_SECRET`: Generate a strong secret.
   - `CORS_ORIGIN`: Your frontend URL (you can update this after deploying frontend, or use `*` for initial test).
   - `NODE_ENV`: `production`

4. **Deploy**:
   - Click **Deploy**.
   - Vercel will build and deploy the function to `/api`.
   - Your API URL will be: `https://web-res-api.vercel.app`.
   - Test it: `https://web-res-api.vercel.app/api/v1/health` (Assuming default prefix).

---

## 🚀 Step 3: Deploy the Frontend (Web)

1. **Import Project**:
   - In Vercel, click **"Add New..."** -> **"Project"**.
   - Select the same git repository (`web_res`).
   - Project Name: `web_res` (or similar).

2. **Configure Project**:
   - **Root Directory**: Click "Edit" and select `apps/web`.
   - **Framework Preset**: Next.js (Auto-detected).

3. **Environment Variables**:
   - `NEXT_PUBLIC_API_URL`: The URL of your backend from Step 2 (e.g., `https://web-res-api.vercel.app/api/v1`).
     - **Important**: Include the `/api/v1` suffix if your API prefix is defaults.

4. **Deploy**:
   - Click **Deploy**.

---

## 🔄 Final Steps

1. **Update CORS on Backend**:
   - Once Frontend is live (e.g., `https://web-res.vercel.app`), go back to the **Backend Project Settings**.
   - Update `CORS_ORIGIN` to `https://web-res.vercel.app`.
   - Redeploy the Backend (Growth/Redeploy).

2. **Database Migration**:
   - The backend is configured to `synchronize: true` in production?
   - **Check**: `apps/api/src/config/database.config.ts`.
   - Currently, it sets `synchronize: process.env.NODE_ENV !== 'production'`.
   - **Recommended**: You should run migrations manually or enable sync for the first run if empty.
   - To run migrations against production DB from local:
     - Create a `.env.production` locally with `DATABASE_URL=...` (remote).
     - Run `npm run typeorm migration:run` (check script aliases).

## ✅ Verification

- Visit Frontend URL.
- Check "News" or similar dynamic pages to verify API connection.
- Check "Admin" login.
