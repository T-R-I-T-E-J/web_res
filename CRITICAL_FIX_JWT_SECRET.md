# CRITICAL FIX: JWT_SECRET Missing in Vercel

## Root Cause Identified

The frontend middleware (`apps/web/src/middleware.ts`) uses `process.env.JWT_SECRET` to verify JWT tokens from the backend.

**However, this environment variable is NOT set in Vercel!**

This means:

1. User logs in successfully → Backend sets cookie with JWT
2. User tries to access `/admin` → Frontend middleware tries to verify JWT
3. **Verification FAILS** because JWT_SECRET is missing or doesn't match
4. Middleware redirects back to `/login`

## Immediate Fix Required

### Step 1: Get the JWT_SECRET from Backend

The JWT_SECRET must be the **EXACT SAME** value in both backend and frontend.

**Option A: Check Render Environment Variables**

1. Go to: https://dashboard.render.com/web/srv-d5j33k6r433s738sffr0/env
2. Find the `JWT_SECRET` variable
3. Copy its value

**Option B: Check Backend .env.example**
The default value is in `apps/api/.env.example`:

```
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### Step 2: Add JWT_SECRET to Vercel

1. Go to: https://vercel.com/t-r-i-t-e-js-projects/web-res-api/settings/environment-variables
2. Click "Add New"
3. **Key:** `JWT_SECRET`
4. **Value:** (paste the EXACT value from Render)
5. **Environments:** Select all (Production, Preview, Development)
6. Click "Save"

### Step 3: Redeploy Frontend

After adding the environment variable:

1. Go to: https://vercel.com/t-r-i-t-e-js-projects/web-res-api
2. Click on the latest deployment
3. Click "Redeploy"
4. Wait for deployment to complete (~1-2 minutes)

### Step 4: Test Login

1. Clear browser cookies for the site
2. Go to: https://web-res-api.vercel.app/login
3. Login with: `admin@psci.in` / `Admin@123`
4. **You should now be redirected to `/admin`!**

## Why This Fixes It

### Before Fix:

```
Backend JWT_SECRET: "your-super-secret-jwt-key-change-this-in-production"
Frontend JWT_SECRET: undefined (or "default-secret-change-in-production")
```

Result: Token verification fails → Redirect to login

### After Fix:

```
Backend JWT_SECRET: "your-super-secret-jwt-key-change-this-in-production"
Frontend JWT_SECRET: "your-super-secret-jwt-key-change-this-in-production"
```

Result: Token verification succeeds → Access granted to `/admin`

## Verification Steps

After applying the fix, verify:

1. **Environment Variable Set:**
   - Check Vercel dashboard shows `JWT_SECRET` in environment variables

2. **Deployment Complete:**
   - Vercel shows "Ready" status
   - Latest deployment includes the new environment variable

3. **Login Works:**
   - Login redirects to `/admin`
   - No redirect loop
   - Can access admin pages

4. **Token Verification:**
   - Open browser DevTools → Console
   - Look for middleware logs (if enabled)
   - Should show: `[Middleware] Token verification result: { roles: ['admin'], pathname: '/admin' }`

## Additional Recommendations

### 1. Create .env.example for Frontend

Create `apps/web/.env.example`:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=https://web-res.onrender.com

# JWT Secret (must match backend)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Optional: Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 2. Document Environment Variables

Add to your deployment documentation:

**Required Vercel Environment Variables:**

- `JWT_SECRET` - Must match the backend JWT secret exactly
- `NEXT_PUBLIC_API_URL` - Backend API URL (optional, for client-side API calls)

**Required Render Environment Variables:**

- `JWT_SECRET` - Must match the frontend JWT secret exactly
- `CORS_ORIGIN` - Frontend URL (e.g., `https://web-res-api.vercel.app`)
- `DATABASE_URL` - Neon PostgreSQL connection string

### 3. Security Note

The `JWT_SECRET` should be:

- **At least 32 characters long**
- **Randomly generated**
- **Never committed to Git**
- **Same across all environments** (or use different secrets per environment)

To generate a secure secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Troubleshooting

### If login still doesn't work after adding JWT_SECRET:

1. **Verify the secret matches:**

   ```bash
   # On Render, check the JWT_SECRET value
   # On Vercel, check the JWT_SECRET value
   # They MUST be identical
   ```

2. **Check deployment logs:**
   - Vercel: Look for build errors
   - Render: Look for runtime errors

3. **Enable debug logging:**
   Uncomment lines 156-157 in `apps/web/src/middleware.ts`:

   ```typescript
   console.log("[Middleware] Visiting:", pathname);
   console.log(
     "[Middleware] All cookies:",
     request.cookies
       .getAll()
       .map((c) => `${c.name}=${c.value.substring(0, 10)}...`)
   );
   ```

4. **Test token verification manually:**
   - Copy the `auth_token` cookie value from browser
   - Use https://jwt.io to decode it
   - Verify it's signed with the correct secret

## Summary

**The fix is simple:**

1. Get `JWT_SECRET` from Render
2. Add it to Vercel environment variables
3. Redeploy Vercel
4. Test login

This should resolve the redirect loop issue completely!
