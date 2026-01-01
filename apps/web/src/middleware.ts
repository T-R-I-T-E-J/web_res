import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

// Ensure JWT_SECRET is available
const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET && process.env.NODE_ENV === 'production') {
  console.error('CRITICAL: JWT_SECRET is not defined in environment variables')
}

// Fallback only for development convenience
const SECRET_KEY = new TextEncoder().encode(JWT_SECRET || 'default-secret-change-in-production')

// Paths
const ADMIN_PATHS = /^\/admin(\/.*)?$/
const SHOOTER_PATHS = /^\/shooter(\/.*)?$/

export async function middleware(request: NextRequest) {
  // 1. Generate CSP Nonce
  const nonce = crypto.randomUUID()
  
  // 2. Define Strict CSP
  // In development, Next.js requires 'unsafe-eval' for hot module replacement
  // In production, we use strict CSP without eval
  const isDevelopment = process.env.NODE_ENV === 'development'
  
  const scriptSrc = isDevelopment
    ? `'self' 'nonce-${nonce}' 'unsafe-eval' 'unsafe-inline' chrome-extension:`
    : `'self' 'nonce-${nonce}' 'strict-dynamic' https: 'unsafe-inline'`
  
  const connectSrc = isDevelopment
    ? `'self' http://localhost:* https: ws: wss: chrome-extension:`
    : `'self' https:`
  
  const cspHeader = `
    default-src 'self';
    script-src ${scriptSrc}; 
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https:;
    font-src 'self' data: https:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://player.vimeo.com;
    connect-src ${connectSrc}; 
    ${isDevelopment ? '' : 'upgrade-insecure-requests;'}
  `.replace(/\s{2,}/g, ' ').trim()

  // 3. Setup Request Headers (for Server Components to access nonce)
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)
  requestHeaders.set('Content-Security-Policy', cspHeader)

  // Helper to verify token
  async function verifyToken(token: string | undefined) {
    if (!token) return null
    try {
      const { payload } = await jwtVerify(token, SECRET_KEY)
      return (payload.roles as string[]) || []
    } catch {
      return null
    }
  }

  const token = request.cookies.get('auth_token')?.value
  const { pathname } = request.nextUrl
  
  // 4. Auth Logic with CSP Support

  // Redirect to dashboard if trying to access login while authenticated
  if (pathname === '/login') {
    const roles = await verifyToken(token)
    if (roles) {
      if (roles.includes('admin')) {
        return makeResponse(NextResponse.redirect(new URL('/admin', request.url)), cspHeader)
      }
      if (roles.includes('shooter')) {
        return makeResponse(NextResponse.redirect(new URL('/shooter', request.url)), cspHeader)
      }
    }
    return makeResponse(NextResponse.next({ request: { headers: requestHeaders } }), cspHeader)
  }

  // Identify protection needed
  const isAdminRoute = ADMIN_PATHS.test(pathname)
  const isShooterRoute = SHOOTER_PATHS.test(pathname)

  if (!isAdminRoute && !isShooterRoute) {
    return makeResponse(NextResponse.next({ request: { headers: requestHeaders } }), cspHeader)
  }

  // Check token
  if (!token) {
    const url = new URL('/login', request.url)
    url.searchParams.set('callbackUrl', pathname)
    return makeResponse(NextResponse.redirect(url), cspHeader)
  }

  // Verify and Role Check
  const roles = await verifyToken(token)
  
  if (!roles) {
    // Invalid token
    const url = new URL('/login', request.url)
    return makeResponse(NextResponse.redirect(url), cspHeader)
  }

  if (isAdminRoute && !roles.includes('admin')) {
    if (roles.includes('shooter')) {
      return makeResponse(NextResponse.redirect(new URL('/shooter', request.url)), cspHeader)
    }
    return makeResponse(NextResponse.redirect(new URL('/login', request.url)), cspHeader)
  }

  if (isShooterRoute && !roles.includes('shooter') && !roles.includes('admin')) {
    return makeResponse(NextResponse.redirect(new URL('/login', request.url)), cspHeader)
  }

  // Allowed
  return makeResponse(NextResponse.next({ request: { headers: requestHeaders } }), cspHeader)
}

// Helper to attach CSP header to response
function makeResponse(response: NextResponse, csp: string) {
  response.headers.set('Content-Security-Policy', csp)
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
