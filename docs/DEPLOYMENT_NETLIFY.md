# Deploying to Netlify

This guide explains how to deploy the frontend of the **Para Shooting Committee of India** application to Netlify.

## prerequisites

Since this is a full-stack application with a logical backend (NestJS) and Database (PostgreSQL), **Netlify can only host the Frontend (Next.js)**.

You must host the Backend and Database elsewhere (e.g., Railway, Render, DigitalOcean, AWS) and provide the URL to the Netlify deployment.

## 1. Prepare existing configuration

We have already configured `netlify.toml` in the root directory and installed `@netlify/plugin-nextjs` in environment.

**Configuration Check:**

- `netlify.toml`: Points to `apps/web` as the base directory.
- `apps/web/next.config.js`: Ensure clean configuration.

## 2. Deploy via Git (Recommended)

1.  **Push your code** to GitHub, GitLab, or Bitbucket.
2.  **Log in to Netlify** and click **"Add new site"** > **"Import an existing project"**.
3.  Select your repository.
4.  Netlify should detect the configuration from `netlify.toml`:
    - **Base directory**: `apps/web`
    - **Build command**: `npm run build`
    - **Publish directory**: `.next` (or let the plugin handle it)
5.  **Environment Variables**:
    You MUST set the following Environment Variables in the "Site settings" > "Build & deploy" > "Environment" section:

    | Key                    | Value (Example)                            | Description                        |
    | ---------------------- | ------------------------------------------ | ---------------------------------- |
    | `NEXT_PUBLIC_API_URL`  | `https://api.your-backend-host.com/api/v1` | URL of your live Backend API.      |
    | `NEXT_PUBLIC_APP_NAME` | `Para Shooting Committee of India`         | App Title.                         |
    | `JWT_SECRET`           | `(your secure secret)`                     | Must match the backend JWT secret. |
    | `NODE_ENV`             | `production`                               | Set to production.                 |

6.  Click **Deploy**.

## 3. Deploy via CLI (Manual)

If you have the Netlify CLI installed (`npm install -g netlify-cli`):

1.  Open your terminal in the project root.
2.  Run:
    ```bash
    netlify login
    netlify deploy --build --prod
    ```
3.  Follow the prompts.
    - **Base directory**: `apps/web`
    - **Build Settings**: Accept defaults detected from `netlify.toml`.

## Important Notes on the Backend

Your frontend will NOT work correctly if it cannot reach the backend.

- Ensure your backend `CORS` settings allow requests from your Netlify domain (e.g., `https://your-site.netlify.app`).
- If you haven't deployed the backend yet, the frontend will load but verify API calls will fail.

## Troubleshooting

- **Build Failures**: Check the "Deploy Log" in Netlify.
- **404 on API Calls**: Check the Chrome DevTools Network tab to ensure `NEXT_PUBLIC_API_URL` is correct and not `localhost`.
