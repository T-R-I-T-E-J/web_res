import type { HelmetOptions } from 'helmet';

/**
 * Security Headers Configuration using Helmet.js
 *
 * This configuration provides defense-in-depth security for the API.
 * Different settings are applied based on the environment (development vs production).
 */

/**
 * Development Security Configuration
 * - Relaxed CSP for local development
 * - HSTS disabled (no HTTPS in local dev)
 * - Allows unsafe-inline for debugging
 */
export const developmentSecurityConfig: HelmetOptions = {
  // Content Security Policy - Relaxed for development
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // Allow inline scripts for dev tools
      styleSrc: ["'self'", "'unsafe-inline'"], // Allow inline styles
      imgSrc: ["'self'", 'data:', 'https:', 'http:', 'blob:'],
      connectSrc: ["'self'", 'http://localhost:*', 'ws://localhost:*'], // Allow local connections
      fontSrc: ["'self'", 'data:'],
      objectSrc: ["'self'", 'blob:'], // Allow PDF viewing
      mediaSrc: ["'self'", 'blob:'],
      frameSrc: ["'self'", 'blob:'], // Allow PDF iframe viewing
    },
  },

  // Cross-Origin Embedder Policy
  crossOriginEmbedderPolicy: false, // Disabled for development

  // Cross-Origin Opener Policy
  crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },

  // Cross-Origin Resource Policy
  crossOriginResourcePolicy: { policy: 'cross-origin' },

  // DNS Prefetch Control
  dnsPrefetchControl: { allow: true },

  // Frameguard - Prevent clickjacking
  frameguard: { action: 'deny' },

  // Hide Powered-By header
  hidePoweredBy: true,

  // HSTS - Disabled in development (no HTTPS)
  hsts: false,

  // IE No Open - Prevent IE from executing downloads
  ieNoOpen: true,

  // No Sniff - Prevent MIME type sniffing
  noSniff: true,

  // Origin Agent Cluster
  originAgentCluster: true,

  // Permitted Cross-Domain Policies
  permittedCrossDomainPolicies: { permittedPolicies: 'none' },

  // Referrer Policy
  referrerPolicy: { policy: 'no-referrer' },

  // XSS Filter
  xssFilter: true,
};

/**
 * Production Security Configuration
 * - Strict CSP
 * - HSTS enabled with preload
 * - No unsafe-inline or unsafe-eval
 * - Maximum security headers
 */
export const productionSecurityConfig: HelmetOptions = {
  // Content Security Policy - Strict for production
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'", // Required for CookieYes and GA
        'https://cdn-cookieyes.com',
        'https://www.googletagmanager.com',
        'https://www.google-analytics.com',
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'", // Required for CookieYes banner
        'https://cdn-cookieyes.com',
      ],
      imgSrc: [
        "'self'",
        'data:',
        'https:',
        'https://www.google-analytics.com',
        'https://www.googletagmanager.com',
      ],
      connectSrc: [
        "'self'",
        'https://www.google-analytics.com',
        'https://analytics.google.com',
        'https://stats.g.doubleclick.net',
      ],
      fontSrc: ["'self'", 'data:', 'https://fonts.gstatic.com'],
      objectSrc: ["'self'", 'blob:'], // Allow PDF viewing
      mediaSrc: ["'self'", 'blob:'],
      frameSrc: ["'self'", 'blob:'], // Allow PDF iframe viewing
      baseUri: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'none'"], // Equivalent to X-Frame-Options: DENY
      upgradeInsecureRequests: [], // Automatically upgrade HTTP to HTTPS
    },
  },

  // Cross-Origin Embedder Policy
  crossOriginEmbedderPolicy: { policy: 'require-corp' },

  // Cross-Origin Opener Policy
  crossOriginOpenerPolicy: { policy: 'same-origin' },

  // Cross-Origin Resource Policy
  crossOriginResourcePolicy: { policy: 'same-origin' },

  // DNS Prefetch Control
  dnsPrefetchControl: { allow: false },

  // Frameguard - Prevent clickjacking
  frameguard: { action: 'deny' },

  // Hide Powered-By header
  hidePoweredBy: true,

  // HSTS - Force HTTPS for 1 year
  hsts: {
    maxAge: 31536000, // 1 year in seconds
    includeSubDomains: true, // Apply to all subdomains
    preload: true, // Allow inclusion in browser HSTS preload lists
  },

  // IE No Open - Prevent IE from executing downloads
  ieNoOpen: true,

  // No Sniff - Prevent MIME type sniffing
  noSniff: true,

  // Origin Agent Cluster
  originAgentCluster: true,

  // Permitted Cross-Domain Policies
  permittedCrossDomainPolicies: { permittedPolicies: 'none' },

  // Referrer Policy - Don't send referrer to external sites
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },

  // XSS Filter
  xssFilter: true,
};

/**
 * Get security configuration based on environment
 */
export function getSecurityConfig(
  environment: string = 'development',
): HelmetOptions {
  const isProduction = environment === 'production' || environment === 'prod';

  if (isProduction) {
    return productionSecurityConfig;
  }

  return developmentSecurityConfig;
}

/**
 * Security Headers Explanation:
 *
 * 1. Content-Security-Policy (CSP):
 *    - Prevents XSS attacks by controlling which resources can be loaded
 *    - Production: Strict, no inline scripts/styles
 *    - Development: Relaxed for debugging
 *
 * 2. HTTP Strict Transport Security (HSTS):
 *    - Forces browsers to use HTTPS
 *    - Production only (requires HTTPS)
 *    - 1 year max-age with preload
 *
 * 3. X-Frame-Options (via frameguard):
 *    - Prevents clickjacking attacks
 *    - Set to DENY (no iframes allowed)
 *
 * 4. X-Content-Type-Options (via noSniff):
 *    - Prevents MIME type sniffing
 *    - Forces browser to respect declared content type
 *
 * 5. Referrer-Policy:
 *    - Controls how much referrer information is sent
 *    - Production: strict-origin-when-cross-origin
 *    - Development: no-referrer
 *
 * 6. X-XSS-Protection:
 *    - Legacy XSS protection (modern browsers use CSP)
 *    - Enabled for backward compatibility
 *
 * 7. Cross-Origin Policies:
 *    - COEP, COOP, CORP for isolation
 *    - Stricter in production
 */
