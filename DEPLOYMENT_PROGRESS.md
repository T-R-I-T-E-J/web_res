# 🚀 Deployment Progress Tracker

As you complete each step, paste the values here so you don't lose them.
**DO NOT COMMIT THIS FILE TO GIT** (It contains secrets!)

## 1. 🟢 Database (Neon.tech)

- **Status**: Pending
- **Action**: Sign up at https://console.neon.tech/signup and create a project.
- **Region**: Select **Singapore** (nearest to India) or **Mumbai** (if available).
- **DATABASE_URL**:
  ```text
  (Paste your neon connection string here, e.g., postgres://...)
  ```

## 2. 🟡 Backend (Render)

- **Status**: Waiting for Step 1
- **Action**: Create Web Service -> Connect GitHub -> `apps/api`.
- **Environment Variables Needed**: `DATABASE_URL` (from above), `JWT_SECRET`, `DB_SYNCHRONIZE=true`.
- **Render API URL**:
  ```text
  (Paste here later, e.g., https://para-shooting-api.onrender.com)
  ```

## 3. 🔴 Frontend (Vercel)

- **Status**: Waiting for Step 2
- **Action**: Import Project -> `apps/web`.
- **Environment Variables Needed**: `NEXT_PUBLIC_API_URL` (from Step 2).
- **Live Website URL**:
  ```text
  (Paste here later)
  ```
