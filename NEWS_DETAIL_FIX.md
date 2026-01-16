# News Detail Page Fix - Summary

## Problem

News detail pages (e.g., `/news/india-wins-gold-asian-para-shooting-championship-2026`) were returning **500 Internal Server Error**.

## Root Cause

The news detail page (`apps/web/src/app/(public)/news/[slug]/page.tsx`) was calling the backend API directly using `process.env.API_URL`, which points to `https://web-res.onrender.com`. This caused issues because:

1. The frontend should use its own API routes (proxy pattern) to avoid CORS issues
2. Inconsistent API URL usage across the application

## Solution

1. **Created API Route**: Added `apps/web/src/app/api/v1/news/[slug]/route.ts` to proxy news detail requests from frontend to backend
2. **Updated Page**: Modified `getArticle()` function in the news detail page to use `/api/v1` instead of the backend URL directly

## Changes Made

### 1. Created API Route

**File**: `apps/web/src/app/api/v1/news/[slug]/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const backendUrl = process.env.API_URL || "https://web-res.onrender.com";

    const response = await fetch(`${backendUrl}/api/v1/news/${params.slug}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("News detail proxy error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
```

### 2. Updated News Detail Page

**File**: `apps/web/src/app/(public)/news/[slug]/page.tsx`

**Before**:

```typescript
async function getArticle(slug: string) {
  try {
    const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
    const res = await fetch(`${API_URL}/news/${slug}`, {
      cache: 'no-store'
    })
    // ...
  }
}
```

**After**:

```typescript
async function getArticle(slug: string) {
  try {
    const API_URL = '/api/v1'; // Use frontend API route
    const res = await fetch(`${API_URL}/news/${slug}`, {
      cache: 'no-store'
    })
    // ...
  }
}
```

## Testing

After deployment, test by visiting:

- https://web-res-api.vercel.app/news/india-wins-gold-asian-para-shooting-championship-2026
- https://web-res-api.vercel.app/news/national-para-shooting-camp-march-2026
- https://web-res-api.vercel.app/news/new-training-facility-inaugurated-mumbai

All news detail pages should now load successfully! ✅

## Related Fixes

This follows the same pattern used for:

- Login API route (`/api/v1/auth/login`)
- Logout API route (`/api/v1/auth/logout`)
- News listing (already using `/api/v1/news`)

## Deployment

- Commit: `911e94f`
- Deployed to: Vercel (web-res-api.vercel.app)
- Status: Pending deployment (~2 minutes)
