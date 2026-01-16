# 🔧 Cookie Setting Fix - Final Update

## ✅ Issue Identified

**Problem:** The login API route was forwarding `Set-Cookie` headers from the backend, but the cookies weren't being set correctly in the browser.

**Root Cause:** Simply forwarding headers doesn't work properly with Next.js API routes. We need to use the `NextResponse.cookies` API to set cookies correctly.

---

## 📝 Changes Made

### **File: `apps/web/src/app/api/v1/auth/login/route.ts`**

**Before (Broken):**

```typescript
// Just forwarding headers - doesn't work properly
const setCookieHeaders = response.headers.getSetCookie();
if (setCookieHeaders && setCookieHeaders.length > 0) {
  setCookieHeaders.forEach((cookie) => {
    nextResponse.headers.append("Set-Cookie", cookie);
  });
}
```

**After (Fixed):**

```typescript
// Parse and set cookies using NextResponse.cookies API
const setCookieHeaders = response.headers.getSetCookie();

if (setCookieHeaders && setCookieHeaders.length > 0) {
  setCookieHeaders.forEach((cookieString) => {
    // Parse the cookie to extract name and value
    const [nameValue, ...attributes] = cookieString.split(";");
    const [name, value] = nameValue.split("=");

    if (name && value) {
      // Set cookie using NextResponse.cookies API
      nextResponse.cookies.set({
        name: name.trim(),
        value: value.trim(),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax", // Changed from 'none' - we're same-domain now
        path: "/",
        maxAge: 24 * 60 * 60, // 1 day
      });
    }
  });
}
```

### **File: `apps/web/src/app/api/v1/auth/logout/route.ts`**

**Changed to:**

```typescript
// Clear the auth_token cookie
nextResponse.cookies.delete("auth_token");
```

---

## 🔍 Why This Fixes It

### **The Problem with Header Forwarding:**

1. Backend sends: `Set-Cookie: auth_token=xyz; HttpOnly; Secure; SameSite=None`
2. We forwarded this header as-is
3. Browser saw `SameSite=None` but we're **same-domain** now
4. Browser rejected the cookie or set it incorrectly

### **The Solution:**

1. Parse the cookie name and value from backend
2. **Re-create the cookie** with correct attributes using `NextResponse.cookies.set()`
3. Use `SameSite=lax` (appropriate for same-domain)
4. Browser accepts and stores the cookie correctly ✅

---

## 🚀 Deployment Status

- **Commit:** `74b6932`
- **Status:** Pushed to GitHub
- **Vercel:** Will auto-deploy in ~2 minutes
- **New Deployment ID:** Will be generated automatically

---

## 🧪 Testing Instructions

**Wait ~2 minutes for deployment, then:**

### **Step 1: Clear Everything**

```
1. Open DevTools (F12)
2. Application → Storage → Clear site data
3. Close DevTools
4. Close browser tab completely
5. Open new tab
```

### **Step 2: Test Login**

```
1. Go to: https://web-res-api.vercel.app/login
2. Enter:
   - Email: admin@psci.in
   - Password: Admin@123
3. Click "Sign In"
4. EXPECTED: Redirect to /admin ✅
```

### **Step 3: Verify Cookie**

```
1. Open DevTools (F12)
2. Application → Cookies → web-res-api.vercel.app
3. Check for auth_token:
   - Name: auth_token
   - Value: (JWT token)
   - Domain: .vercel.app
   - Path: /
   - HttpOnly: ✓
   - Secure: ✓
   - SameSite: Lax
```

### **Step 4: Check Console**

```
1. DevTools → Console
2. Should see NO errors
3. No "Failed to fetch"
4. No CORS errors
```

---

## 📊 Complete Fix Timeline

| Time    | Action                                   | Status      |
| ------- | ---------------------------------------- | ----------- |
| T-60min | Identified cross-domain cookie issue     | ✅          |
| T-45min | Created Next.js API routes               | ✅          |
| T-30min | Updated NEXT_PUBLIC_API_URL to `/api/v1` | ✅          |
| T-15min | Fixed cookie setting in API routes       | ✅          |
| T-0min  | Deployed to production                   | 🔄 Building |

---

## 🎯 What Changed

### **Cookie Attributes:**

- **SameSite:** `none` → `lax` (correct for same-domain)
- **Setting Method:** Header forwarding → `NextResponse.cookies.set()`
- **Domain:** Automatically set to Vercel domain
- **Secure:** `true` in production
- **HttpOnly:** `true` (prevents JavaScript access)

### **Why SameSite=lax:**

- We're now **same-domain** (frontend and API both on Vercel)
- `SameSite=none` is for **cross-domain** cookies
- `SameSite=lax` is the correct choice for same-domain auth cookies
- Provides better security while allowing the cookie to work

---

## 🔐 Security Implications

**Improved Security:**

- ✅ `SameSite=lax` prevents CSRF attacks
- ✅ `HttpOnly` prevents XSS cookie theft
- ✅ `Secure` ensures HTTPS-only transmission
- ✅ Same-domain reduces attack surface

**No Security Regression:**

- All security features maintained
- Actually **more secure** than cross-domain cookies
- Follows Next.js best practices

---

## 📚 Files Modified

| File                                           | Change                              |
| ---------------------------------------------- | ----------------------------------- |
| `apps/web/src/app/api/v1/auth/login/route.ts`  | Use `NextResponse.cookies.set()`    |
| `apps/web/src/app/api/v1/auth/logout/route.ts` | Use `NextResponse.cookies.delete()` |

---

## ✅ Expected Results

After this deployment:

- ✅ Login works and redirects to `/admin`
- ✅ Cookie is set correctly on Vercel domain
- ✅ Middleware can read and verify the cookie
- ✅ Protected routes are accessible
- ✅ No "Failed to fetch" errors
- ✅ No CORS errors
- ✅ No cookie-related console errors

---

## 🚨 If It Still Doesn't Work

**Check these in order:**

1. **Deployment Status:**
   - Go to: https://vercel.com/t-r-i-t-e-js-projects/web-res-api
   - Verify latest deployment (commit `74b6932`) is "Ready"

2. **Clear Browser State:**
   - Clear ALL site data (not just cookies)
   - Close and reopen browser
   - Try in incognito mode

3. **Check Network Tab:**
   - DevTools → Network
   - Find POST to `/api/v1/auth/login`
   - Check Response Headers for `Set-Cookie`
   - Should see: `auth_token=...; Path=/; HttpOnly; Secure; SameSite=Lax`

4. **Check Console:**
   - Any errors during login?
   - Any errors from middleware?
   - Screenshot and share

---

**Last Updated:** 2026-01-17T03:02:00+05:30  
**Commit:** `74b6932`  
**Status:** Deployed, waiting for Vercel build  
**Expected:** Login should work after deployment completes! ✅
