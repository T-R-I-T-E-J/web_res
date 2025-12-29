import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

// Ensure JWT_SECRET is available
const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET && process.env.NODE_ENV === 'production') {
  console.error('CRITICAL: JWT_SECRET is not defined in environment variables')
}

// Fallback only for development convenience if needed, but better to be checking env.
const SECRET_KEY = new TextEncoder().encode(JWT_SECRET || 'default-secret-change-in-production')

// Paths
const ADMIN_PATHS = /^\/admin(\/.*)?$/
const SHOOTER_PATHS = /^\/shooter(\/.*)?$/

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value
  const { pathname } = request.nextUrl

  // 1. Redirect to dashboard if trying to access login while authenticated
  if (pathname === '/login') {
    if (token) {
      try {
        const { payload } = await jwtVerify(token, SECRET_KEY)
        const roles = (payload.roles as string[]) || []
        
        if (roles.includes('admin')) {
          return NextResponse.redirect(new URL('/admin', request.url))
        }
        if (roles.includes('shooter')) {
          return NextResponse.redirect(new URL('/shooter', request.url))
        }
      } catch (e) {
        // Token invalid, ignore and show login page
      }
    }
    return NextResponse.next()
  }

  // 2. Identify if route needs protection
  const isAdminRoute = ADMIN_PATHS.test(pathname)
  const isShooterRoute = SHOOTER_PATHS.test(pathname)

  if (!isAdminRoute && !isShooterRoute) {
    return NextResponse.next()
  }

  // 3. Check for token presence
  if (!token) {
    const url = new URL('/login', request.url)
    url.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(url)
  }

  try {
    // 4. Verify and Decode Token
    const { payload } = await jwtVerify(token, SECRET_KEY)
    const roles = (payload.roles as string[]) || []

    // 5. Role-Based Access Control
    if (isAdminRoute && !roles.includes('admin')) {
      // User is authenticated but not authorized
      // Redirect to their appropriate dashboard or login
      if (roles.includes('shooter')) {
        return NextResponse.redirect(new URL('/shooter', request.url))
      }
      return NextResponse.redirect(new URL('/login', request.url))
    }

    if (isShooterRoute && !roles.includes('shooter') && !roles.includes('admin')) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Auth & Role Valid
    return NextResponse.next()

  } catch (error) {
    // Token verification failed (expired, invalid secret, etc.)
    const url = new URL('/login', request.url)
    return NextResponse.redirect(url)
  }
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/shooter/:path*',
    '/login',
  ],
}
