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

// Types
type UserRoles = string[] | null

// Helper to verify token
async function verifyToken(token: string | undefined): Promise<UserRoles> {
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY)
    return (payload.roles as string[]) || []
  } catch {
    return null
  }
}

// Helper to generate CSP header
function generateCSPHeader(nonce: string): string {
  const isDevelopment = process.env.NODE_ENV === 'development'
  
  const scriptSrc = isDevelopment
    ? `'self' 'nonce-${nonce}' 'unsafe-eval' 'unsafe-inline' chrome-extension:`
    : `'self' 'nonce-${nonce}' 'strict-dynamic' https: 'unsafe-inline'`
  
  const connectSrc = isDevelopment
    ? `'self' http://localhost:* https: ws: wss: chrome-extension:`
    : `'self' https:`

  const imgSrc = isDevelopment
    ? `'self' blob: data: https: http://localhost:*`
    : `'self' blob: data: https:`
  
  const cspHeader = `
    default-src 'self';
    script-src ${scriptSrc}; 
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src ${imgSrc};
    font-src 'self' data: https:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://player.vimeo.com;
    connect-src ${connectSrc}; 
    ${isDevelopment ? '' : 'upgrade-insecure-requests;'}
  `.replace(/\s{2,}/g, ' ').trim()

  return cspHeader
}

// Helper to attach CSP header to response
function makeResponse(response: NextResponse, csp: string): NextResponse {
  response.headers.set('Content-Security-Policy', csp)
  return response
}

// Helper to create redirect with CSP
function redirectWithCSP(url: URL, cspHeader: string): NextResponse {
  return makeResponse(NextResponse.redirect(url), cspHeader)
}

// Helper to handle login page access
function handleLoginPageAccess(roles: UserRoles, request: NextRequest, cspHeader: string): NextResponse {
  if (!roles) {
    const requestHeaders = new Headers(request.headers)
    return makeResponse(NextResponse.next({ request: { headers: requestHeaders } }), cspHeader)
  }

  if (roles.includes('admin')) {
    return redirectWithCSP(new URL('/admin', request.url), cspHeader)
  }

  if (roles.includes('shooter')) {
    return redirectWithCSP(new URL('/shooter', request.url), cspHeader)
  }

  const requestHeaders = new Headers(request.headers)
  return makeResponse(NextResponse.next({ request: { headers: requestHeaders } }), cspHeader)
}

// Helper to handle unauthorized access
function handleUnauthorizedAccess(pathname: string, request: NextRequest, cspHeader: string): NextResponse {
  const url = new URL('/login', request.url)
  url.searchParams.set('callbackUrl', pathname)
  return redirectWithCSP(url, cspHeader)
}

// Helper to handle admin route access
function handleAdminRouteAccess(roles: UserRoles, request: NextRequest, cspHeader: string): NextResponse {
  if (roles?.includes('admin')) {
    const requestHeaders = new Headers(request.headers)
    return makeResponse(NextResponse.next({ request: { headers: requestHeaders } }), cspHeader)
  }

  if (roles?.includes('shooter')) {
    return redirectWithCSP(new URL('/shooter', request.url), cspHeader)
  }

  return redirectWithCSP(new URL('/login', request.url), cspHeader)
}

// Helper to handle shooter route access
function handleShooterRouteAccess(roles: UserRoles, request: NextRequest, cspHeader: string): NextResponse {
  const hasAccess = roles?.includes('shooter') || roles?.includes('admin')
  
  if (hasAccess) {
    const requestHeaders = new Headers(request.headers)
    return makeResponse(NextResponse.next({ request: { headers: requestHeaders } }), cspHeader)
  }

  return redirectWithCSP(new URL('/login', request.url), cspHeader)
}

// Helper to check if route needs protection
function isProtectedRoute(pathname: string): { isAdmin: boolean; isShooter: boolean; needsProtection: boolean } {
  const isAdmin = ADMIN_PATHS.test(pathname)
  const isShooter = SHOOTER_PATHS.test(pathname)
  return {
    isAdmin,
    isShooter,
    needsProtection: isAdmin || isShooter
  }
}

export async function middleware(request: NextRequest) {
  // 1. Generate CSP Nonce
  const nonce = crypto.randomUUID()
  const cspHeader = generateCSPHeader(nonce)
  
  // 2. Setup Request Headers (for Server Components to access nonce)
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)
  requestHeaders.set('Content-Security-Policy', cspHeader)

  const token = request.cookies.get('auth_token')?.value
  const { pathname } = request.nextUrl
  
  // 3. Handle login page access
  if (pathname === '/login') {
    const roles = await verifyToken(token)
    console.log('[Middleware] Checking login access:', { token: !!token, roles });
    return handleLoginPageAccess(roles, request, cspHeader)
  }

  // 4. Check if route needs protection
  const { isAdmin, isShooter, needsProtection } = isProtectedRoute(pathname)

  if (needsProtection) {
    console.log('[Middleware] Protected route matched:', { pathname, isAdmin, isShooter });
  }

  if (!needsProtection) {
    return makeResponse(NextResponse.next({ request: { headers: requestHeaders } }), cspHeader)
  }

  // 5. Check if user has valid token
  if (!token) {
    console.log('[Middleware] No token found for protected route:', { pathname, cookie: request.cookies.get('auth_token') });
    return handleUnauthorizedAccess(pathname, request, cspHeader)
  }

  // 6. Verify token and get roles
  const roles = await verifyToken(token)
  console.log('[Middleware] Token verification result:', { roles, pathname });
  
  if (!roles) {
    return redirectWithCSP(new URL('/login', request.url), cspHeader)
  }

  // 7. Handle route-specific access control
  if (isAdmin) {
    return handleAdminRouteAccess(roles, request, cspHeader)
  }

  if (isShooter) {
    return handleShooterRouteAccess(roles, request, cspHeader)
  }

  // Fallback (should not reach here)
  return makeResponse(NextResponse.next({ request: { headers: requestHeaders } }), cspHeader)
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
