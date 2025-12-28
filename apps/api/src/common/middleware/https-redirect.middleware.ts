import { Request, Response, NextFunction } from 'express';
import { Logger } from '@nestjs/common';

const logger = new Logger('HTTPSRedirect');

/**
 * HTTPS Redirect Middleware
 *
 * Redirects all HTTP requests to HTTPS in production.
 * This middleware should ONLY be used in production environments.
 *
 * How it works:
 * 1. Checks the X-Forwarded-Proto header (set by load balancers/proxies)
 * 2. If the protocol is HTTP, redirects to HTTPS
 * 3. Preserves the original URL path and query parameters
 *
 * Common deployment scenarios:
 * - Heroku: Sets X-Forwarded-Proto header
 * - AWS ELB/ALB: Sets X-Forwarded-Proto header
 * - Nginx: Sets X-Forwarded-Proto header
 * - Cloudflare: Sets X-Forwarded-Proto header
 * - Railway: Sets X-Forwarded-Proto header
 * - Render: Sets X-Forwarded-Proto header
 */
export function httpsRedirectMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  // Check if the request is already HTTPS
  const protocol = req.header('x-forwarded-proto') || req.protocol;

  if (protocol !== 'https') {
    // Construct the HTTPS URL
    const httpsUrl = `https://${req.header('host')}${req.url}`;

    logger.warn(
      `Redirecting HTTP request to HTTPS: ${req.method} ${req.url} -> ${httpsUrl}`,
    );

    // Redirect to HTTPS with 301 (Permanent Redirect)
    res.redirect(301, httpsUrl);
    return;
  }

  // Request is already HTTPS, continue
  next();
}

/**
 * Create HTTPS redirect middleware with environment check
 *
 * This function returns the middleware only if the environment is production.
 * In development, it returns a no-op middleware that just calls next().
 *
 * Usage in main.ts:
 * ```typescript
 * const httpsMiddleware = createHttpsRedirectMiddleware(process.env.NODE_ENV);
 * if (httpsMiddleware) {
 *   app.use(httpsMiddleware);
 * }
 * ```
 */
export function createHttpsRedirectMiddleware(
  environment: string = 'development',
): ((req: Request, res: Response, next: NextFunction) => void) | null {
  const isProduction = environment === 'production' || environment === 'prod';

  if (!isProduction) {
    logger.log(
      '⚠️  HTTPS redirect disabled in development (not needed for localhost)',
    );
    return null;
  }

  logger.log('✅ HTTPS redirect enabled for production');
  return httpsRedirectMiddleware;
}

/**
 * Common Mistakes to Avoid:
 *
 * 1. ❌ DON'T enable HTTPS redirect in development
 *    - Local development uses HTTP (localhost)
 *    - HTTPS redirect will break local development
 *
 * 2. ❌ DON'T use req.secure to check for HTTPS
 *    - req.secure doesn't work behind proxies/load balancers
 *    - Always check X-Forwarded-Proto header
 *
 * 3. ❌ DON'T use 302 (Temporary Redirect)
 *    - Use 301 (Permanent Redirect) for HTTPS
 *    - Browsers will cache 301 redirects
 *
 * 4. ❌ DON'T forget to trust proxy
 *    - In production, you must trust the proxy
 *    - Set app.set('trust proxy', 1) in NestJS
 *
 * 5. ❌ DON'T apply HTTPS redirect before helmet
 *    - Apply helmet first, then HTTPS redirect
 *    - Order matters for security middleware
 */
