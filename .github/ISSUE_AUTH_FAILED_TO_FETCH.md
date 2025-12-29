# 🚨 Critical Bug: "Failed to fetch" on Login - Network Configuration Mismatch

## Problem Description

### What is happening

Users attempting to log in through the frontend are encountering a **"Failed to fetch"** error. The browser's network request to the authentication endpoint is failing at the network level, preventing any authentication from occurring.

### Where it is happening

- **Frontend**: `apps/web/src/app/(auth)/login/page.tsx` (Login page)
- **Backend**: `apps/api/src/main.ts` (Server configuration)
- **Affected Endpoint**: `/auth/login`
- **Environment**: Local development (and potentially all environments)

### Why it is a problem

This is a **critical blocker** that prevents:

- ✗ Any user from logging into the application
- ✗ Testing of authentication flows
- ✗ Access to protected routes and admin functionality
- ✗ Development progress on features requiring authentication

The error occurs **before** any backend validation, indicating a fundamental network/configuration issue rather than a credential or business logic problem.

### Who is affected

- **All users** attempting to log in (admins, regular users, developers)
- **Development team** unable to test authenticated features
- **QA/Testing** blocked from verifying authentication-dependent functionality

---

## Root Cause Analysis

Based on code inspection, there are **three primary root causes**:

### 1. ⚠️ Port and URL Mismatch (Most Likely)

**The Issue**: Inconsistent API URL configuration across the application.

**Evidence**:

- Backend (`apps/api/src/main.ts`): Configured to listen on **port 8080**
- Login page (`apps/web/src/app/(auth)/login/page.tsx`): Has hardcoded fallback to port 8080
- Admin Scores page: Has fallback to **port 8082** (inconsistent!)
- Missing or incorrect `NEXT_PUBLIC_API_URL` in `apps/web/.env.local`

**Impact**: Browser attempts to connect to wrong port/URL → Connection refused → "Failed to fetch"

### 2. 🔒 CORS (Cross-Origin Resource Sharing) Block

**The Issue**: Backend CORS policy may be rejecting legitimate frontend requests.

**Evidence**:

```typescript
// apps/api/src/main.ts
app.enableCors({
  origin: "http://localhost:3000", // Only allows exactly this origin
  credentials: true,
});
```

**Impact**: If frontend is accessed via:

- `http://127.0.0.1:3000` (IP instead of localhost)
- Network IP (e.g., `http://192.168.1.x:3000`)
- Different port during testing

→ Backend rejects the request → Browser reports "Failed to fetch"

### 3. 🛣️ Missing Global API Prefix

**The Issue**: Frontend requests may be missing the `/api/v1` prefix.

**Evidence**:

- Backend sets global prefix: `app.setGlobalPrefix('api/v1')`
- Expected endpoint: `http://localhost:8080/api/v1/auth/login`
- If `API_URL` is just `http://localhost:8080`, request goes to: `http://localhost:8080/auth/login`

**Impact**: Request to non-existent route → 404 or connection failure

---

## Steps to Reproduce

1. **Start the backend server**:

   ```bash
   cd apps/api
   npm run start:dev
   ```

   Verify it's running on port 8080

2. **Start the frontend server**:

   ```bash
   cd apps/web
   npm run dev
   ```

   Verify it's running on port 3000

3. **Attempt to log in**:

   - Navigate to `http://localhost:3000/login`
   - Enter any credentials
   - Click "Sign In"

4. **Observe the error**:

   - Open browser DevTools (F12)
   - Go to **Network** tab
   - See failed request with "Failed to fetch" in Console

5. **Check the request details**:
   - Look for the request URL
   - Check the status (failed, 404, CORS error)
   - Verify the actual endpoint being called

---

## Diagnostic Steps

To identify which root cause is affecting your environment:

### Step 1: Check Network Tab

1. Open browser DevTools → **Network** tab
2. Attempt login
3. Look for the failed request (red row)

**Interpret the status**:

- `(failed)` or `net::ERR_CONNECTION_REFUSED` → **Port/URL mismatch** (Root Cause #1)
- `404 Not Found` → **Missing `/api/v1` prefix** (Root Cause #3)
- `CORS error` in console → **CORS policy issue** (Root Cause #2)

### Step 2: Add Debug Logging

Add this to `apps/web/src/app/(auth)/login/page.tsx` in the `handleSubmit` function:

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  // DEBUG: Log the exact URL being called
  console.log("🔍 API_URL:", API_URL);
  console.log("🔍 Full endpoint:", `${API_URL}/auth/login`);
  console.log("🔍 Current origin:", window.location.origin);

  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });
    // ... rest of code
  } catch (err) {
    console.error("❌ Connection Error:", err);
    console.error("💡 Check if backend is running on port 8080");
    console.error("💡 Verify NEXT_PUBLIC_API_URL in .env.local");
  }
};
```

### Step 3: Verify Backend is Running

```bash
# Check if port 8080 is in use
netstat -ano | findstr :8080

# Or try to access the API directly
curl http://localhost:8080/api/v1/auth/login
```

---

## Scope & Constraints

### ✅ In Scope

- Fix environment variable configuration (`NEXT_PUBLIC_API_URL`)
- Ensure consistent API URL usage across all frontend pages
- Update CORS policy to handle common development scenarios
- Verify global API prefix is correctly applied
- Add better error logging for network failures
- Document correct environment setup

### ❌ Out of Scope

- Authentication logic changes (this is a network issue, not auth logic)
- Database or backend business logic modifications
- Frontend UI/UX improvements (beyond error messaging)
- Production deployment configuration (focus on local dev first)

### 📋 Assumptions

- Backend is intended to run on port 8080
- Frontend is intended to run on port 3000
- API routes should be prefixed with `/api/v1`
- Development uses `localhost` (not network IPs)

### 🔗 Dependencies

- Requires both frontend and backend to be running
- Requires proper `.env.local` configuration
- May require clearing browser cache/cookies after fix

---

## Acceptance Criteria

This issue is considered **resolved** when:

- [ ] **Environment Configuration**

  - [ ] `apps/web/.env.local` exists with correct `NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1`
  - [ ] All frontend pages use the environment variable (no hardcoded URLs)
  - [ ] Documentation updated with required environment variables

- [ ] **CORS Configuration**

  - [ ] Backend CORS policy allows `http://localhost:3000`
  - [ ] Backend CORS policy allows `http://127.0.0.1:3000` (optional but recommended)
  - [ ] CORS errors no longer appear in browser console

- [ ] **API Routing**

  - [ ] All frontend requests include the `/api/v1` prefix
  - [ ] Backend correctly responds to requests at `/api/v1/auth/login`
  - [ ] No 404 errors for authentication endpoints

- [ ] **Error Handling**

  - [ ] Frontend logs clear error messages when network requests fail
  - [ ] Error messages help developers diagnose the issue
  - [ ] User-facing error messages are informative but not technical

- [ ] **Testing**

  - [ ] Login succeeds with valid credentials
  - [ ] Login fails gracefully with invalid credentials (not network error)
  - [ ] Network tab shows successful 200/401 responses (not failed requests)
  - [ ] No "Failed to fetch" errors in console

- [ ] **Documentation**
  - [ ] README includes environment setup instructions
  - [ ] `.env.example` file created with all required variables
  - [ ] Troubleshooting guide added for common network errors

---

## Suggested Labels

- `bug` - This is a defect preventing core functionality
- `critical` - Blocks all authentication and development progress
- `frontend` - Involves frontend configuration and requests
- `backend` - Involves backend CORS and routing configuration
- `configuration` - Root cause is environment/config mismatch
- `developer-experience` - Affects local development setup
- `good-first-issue` - Clear root cause and solution (for new contributors)

---

## Priority

**🔴 CRITICAL**

**Justification**:

- Completely blocks user authentication
- Prevents testing of any authenticated features
- Affects all developers and users
- Must be fixed before any authentication-dependent work can proceed

---

## Environment

- **Branch**: `main` (likely affects all branches)
- **Environment**: Local development (potentially all environments)
- **Backend Port**: 8080
- **Frontend Port**: 3000
- **Browser**: All browsers (Chrome, Edge, Firefox, Safari)
- **OS**: Windows (likely affects all OS)

---

## Recommended Fix (Implementation Guidance)

### 1. Create/Update Environment File

**File**: `apps/web/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

### 2. Update Login Page

**File**: `apps/web/src/app/(auth)/login/page.tsx`

Replace hardcoded URL with:

```typescript
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
```

### 3. Update CORS Configuration

**File**: `apps/api/src/main.ts`

```typescript
app.enableCors({
  origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
  credentials: true,
});
```

### 4. Verify All Frontend API Calls

Search for hardcoded API URLs and replace with environment variable:

```bash
# Search for hardcoded localhost URLs
grep -r "localhost:808" apps/web/src/
```

### 5. Add Environment Example

**File**: `apps/web/.env.example`

```env
# Backend API URL (include /api/v1 prefix)
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

---

## Additional Context

### Related Files

- `apps/web/src/app/(auth)/login/page.tsx` - Login page with fetch call
- `apps/api/src/main.ts` - Backend server configuration
- `apps/web/.env.local` - Frontend environment variables (may not exist)
- Other admin pages with API calls (check for consistency)

### Related Issues

- May be related to inconsistent port configuration across admin pages
- Could affect other API endpoints beyond authentication

### References

- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [NestJS CORS](https://docs.nestjs.com/security/cors)
- [MDN: CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

---

## Notes for Developers

- **Before starting**: Verify both backend and frontend are running
- **After fix**: Clear browser cache and restart both servers
- **Testing**: Use browser DevTools Network tab to verify requests
- **Debugging**: Add console.logs to see actual URLs being called
- **Documentation**: Update README with environment setup steps

---

**Issue Created**: 2025-12-29  
**Reported By**: Development Team  
**Severity**: Critical - Blocks all authentication
