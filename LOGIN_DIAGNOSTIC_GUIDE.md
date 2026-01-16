# Login Redirect Issue - Diagnostic Guide

## Current Status

You are experiencing a login redirect loop where:

1. You enter correct credentials (`admin@psci.in` / `Admin@123`)
2. Login appears successful
3. But you are NOT redirected to `/admin` dashboard

## Fixes Already Applied

### ✅ Backend Fixes (Pushed to `T-R-I-T-E-J/web_res`)

1. **Cookie SameSite Policy** - Changed from `'lax'` to `'none'` in production
2. **CORS Origin** - Changed from `*` to `https://web-res-api.vercel.app`

### ✅ Frontend Fixes (Pushed to `Rengoku30/demowebsite`)

1. **Redirect Method** - Changed from `router.push()` to `window.location.replace()`

## Manual Diagnostic Steps

### Step 1: Check Browser Console

1. Open https://web-res-api.vercel.app/login
2. Press `F12` to open DevTools
3. Go to **Console** tab
4. Clear the console
5. Try to log in
6. **Look for:**
   - Any red error messages
   - Any warnings about cookies or CORS
   - Any messages about redirects

### Step 2: Check Network Tab

1. In DevTools, go to **Network** tab
2. Clear network log
3. Try to log in
4. Find the request to `/api/v1/auth/login`
5. Click on it
6. **Check Response Headers:**
   ```
   Look for:
   - Set-Cookie: auth_token=...
   - Access-Control-Allow-Origin: https://web-res-api.vercel.app
   - Access-Control-Allow-Credentials: true
   ```
7. **Check Response Body:**
   ```json
   Should contain:
   {
     "success": true,
     "data": {
       "message": "Login successful",
       "user": {
         "id": "1",
         "email": "admin@psci.in",
         "roles": ["admin"]
       }
     }
   }
   ```

### Step 3: Check Cookies

1. In DevTools, go to **Application** tab
2. Expand **Cookies** in the left sidebar
3. Click on `https://web-res-api.vercel.app`
4. **Look for `auth_token` cookie**
5. **If cookie exists, check:**
   - Name: `auth_token`
   - Value: (should be a long JWT string)
   - Domain: `.vercel.app` or `web-res-api.vercel.app`
   - Path: `/`
   - Secure: ✓ (checked)
   - HttpOnly: ✓ (checked)
   - SameSite: `None`

### Step 4: Check Current URL After Login

After clicking "Sign In", check:

- Does the URL change at all?
- Does it stay at `/login`?
- Does it briefly change then redirect back?

## Common Issues & Solutions

### Issue 1: Cookie Not Being Set

**Symptoms:**

- No `auth_token` cookie in Application tab
- No `Set-Cookie` header in Network response

**Possible Causes:**

1. Backend deployment hasn't finished
2. CORS configuration not updated
3. Browser blocking third-party cookies

**Solution:**

1. Check Render deployment status: https://dashboard.render.com/web/srv-d5j33k6r433s738sffr0
2. Verify `CORS_ORIGIN` is `https://web-res-api.vercel.app` (not `*`)
3. Try in Incognito mode

### Issue 2: Cookie Set But Not Sent on Redirect

**Symptoms:**

- Cookie exists in Application tab
- But redirect to `/admin` fails
- Middleware redirects back to `/login`

**Possible Causes:**

1. Cookie domain mismatch
2. Cookie SameSite policy issue
3. Middleware not reading cookie correctly

**Solution:**
Check the cookie's Domain and SameSite attributes

### Issue 3: CORS Error

**Symptoms:**

- Console shows CORS error
- Network tab shows failed request

**Possible Causes:**

1. Backend CORS not configured correctly
2. Frontend making request to wrong URL

**Solution:**
Verify backend `CORS_ORIGIN` environment variable

## Verification Checklist

Run through this checklist and report back what you find:

- [ ] **Backend Deployed?**
  - Go to: https://dashboard.render.com/web/srv-d5j33k6r433s738sffr0
  - Status should be "Live" (green)
  - Latest deploy should be within last 10 minutes

- [ ] **Frontend Deployed?**
  - Go to: https://vercel.com/t-r-i-t-e-js-projects/web-res-api
  - Latest deployment should be "Ready"
  - Should show recent commit

- [ ] **Environment Variables Correct?**
  - Render `CORS_ORIGIN` = `https://web-res-api.vercel.app`
  - Render `JWT_SECRET` = (should match between backend and any frontend config)

- [ ] **Login API Response?**
  - Status: 200 OK
  - Contains `user` object with `roles: ["admin"]`
  - Contains `Set-Cookie` header

- [ ] **Cookie Set in Browser?**
  - `auth_token` exists in Application > Cookies
  - SameSite = `None`
  - Secure = ✓

- [ ] **Console Errors?**
  - No CORS errors
  - No JavaScript errors
  - No cookie warnings

## What to Report Back

Please check the above and tell me:

1. **Backend Deployment Status:**
   - Is it "Live"?
   - When was the last deployment?

2. **Login API Response:**
   - What status code? (200, 401, 500?)
   - Does response contain `user.roles: ["admin"]`?
   - Is there a `Set-Cookie` header?

3. **Cookie Status:**
   - Is `auth_token` cookie set?
   - What are its attributes (Domain, SameSite, Secure)?

4. **Console Errors:**
   - Any red errors?
   - Any CORS warnings?

5. **Current Behavior:**
   - Does URL change after login?
   - Where does it redirect to (if anywhere)?

## Quick Test Commands

You can also test the API directly:

### Test 1: Check Backend Health

```bash
curl https://web-res.onrender.com/api/v1/health
```

Should return: `{"success":true,"data":{"status":"ok",...}}`

### Test 2: Test Login API

```bash
curl -X POST https://web-res.onrender.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -H "Origin: https://web-res-api.vercel.app" \
  -d '{"email":"admin@psci.in","password":"Admin@123"}' \
  -v
```

Look for:

- `< HTTP/1.1 200 OK`
- `< Set-Cookie: auth_token=...`
- `< Access-Control-Allow-Origin: https://web-res-api.vercel.app`

## Next Steps

Based on what you find, we can:

1. Fix any remaining backend configuration issues
2. Adjust frontend redirect logic
3. Debug middleware cookie handling
4. Check for browser-specific issues

Please run through the diagnostic steps and report back what you find!
