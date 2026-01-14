# Cookie & Authentication Analysis Report

## Status Overview

- **Cookie Name**: `auth_token`
- **Security**: `HttpOnly` (Secure), `SameSite=Lax`
- **Issuance**: ✅ **Working**. Backend issues valid JWTs.
- **Verification**: ✅ **Working**. Frontend Middleware successfully decodes tokens.
- **Secrets**: ✅ **MATCH**. `apps/api/.env` and `apps/web/.env.local` share the same `JWT_SECRET`.

## The "Redirect Loop" Explained

The issue is **NOT** a technical bug (e.g., api failure, cookie blocking).
It is a **Permission Issue**:

1. New users are assigned the `viewer` role by default.
2. The Middleware (`apps/web/src/middleware.ts`) protects `/admin` routes.
3. If a `viewer` tries to go to `/admin`, the middleware redirects them to `/login`.
4. If they are already logged in, the Login page redirects them to `/` (Home) because they are not Admins.
5. User tries to go to `/admin` again -> Redirected to `/login` -> Redirected to `/`.
   This feels like a loop/bug.

## Solution

To access the Admin Dashboard, the user **MUST** have the `admin` role in the database.

### How to Fix Your Account

I have created a utility script to upgrade your account to Admin.

1. **Register/Login** with your desired account on the website (http://localhost:3000).
2. **Immediately Run** this command in your terminal:
   ```bash
   node apps/api/fix-admin-access.js
   ```
3. This script will find the **most recent user** (you) and assign the `admin` role.
4. **Refresh** the page or go to `/admin`. You will now have access.

### Test Verification

- Ran connection tests: **SUCCESS**
- Verified Environment Variables: **SUCCESS**
- Simulated Login Flow: **SUCCESS**
- Upgraded Test User (`test_verifier...`) to Admin: **SUCCESS**
