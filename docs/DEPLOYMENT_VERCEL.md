# Deploying to Vercel

Vercel is the creators of Next.js and is generally the **best platform** for hosting Next.js applications like your frontend.

## 1. Prerequisites

Just like Netlify, Vercel is best for the **Frontend (`apps/web`)**.
Your Backend (`apps/api`) and Database need to be hosted on a VPS or cloud provider (Railway, Render, AWS, etc.) because they require a persistent environment.

## 2. Deploy via Git (Recommended)

1.  **Push your code** to GitHub, GitLab, or Bitbucket.
2.  **Log in to [Vercel](https://vercel.com)**.
3.  Click **"Add New..."** > **"Project"**.
4.  Import your repository.
5.  **Configure Project**:
    - **Framework Preset**: Next.js (should be auto-detected).
    - **Root Directory**: Click "Edit" and select `apps/web`. **This is crucial.**
6.  **Environment Variables**:
    Add the variables from your `apps/web/.env.example` file here:

    | Name                  | Value (Example)                       |
    | --------------------- | ------------------------------------- |
    | `NEXT_PUBLIC_API_URL` | `https://api.your-backend.com/api/v1` |
    | `JWT_SECRET`          | `(your secure secret)`                |
    | `NODE_ENV`            | `production`                          |

7.  Click **Deploy**.

## 3. Why Vercel?

- **Native Support**: Zero configuration for Next.js features (Image Optimization, ISR, Middleware).
- **Performance**: Edge implementations are often faster.
- **Monorepo Support**: excellent handling of monorepos like yours.

## 4. Troubleshooting

- **404 on API**: Ensure `NEXT_PUBLIC_API_URL` is set to your _public_ backend URL, not localhost.
- **Build Fails**: Check the build logs. Ensure `npm run build` works locally in `apps/web`.
