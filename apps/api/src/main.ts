import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { getSecurityConfig } from './config/security.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  // Get configuration
  const port = configService.get<number>('config.app.port') || 8080;
  const apiPrefix =
    configService.get<string>('config.app.apiPrefix') || 'api/v1';
  const corsOrigin =
    configService.get<string>('config.app.corsOrigin') ||
    'http://localhost:3000';
  const environment = process.env.NODE_ENV || 'development';

  // ============================================
  // SECURITY: Helmet.js Middleware
  // ============================================
  // Apply security headers based on environment
  const securityConfig = getSecurityConfig(environment);
  app.use(helmet(securityConfig));
  app.use(cookieParser());

  logger.log(`🔒 Security headers enabled for: ${environment}`);

  // ============================================
  // SECURITY: Express Rate Limiting (Secondary Layer)
  // ============================================
  // IP-based rate limiting as additional protection
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5000, // Increased limit: 5000 requests per 15 min per IP to prevent blocking admin actions
    message: {
      statusCode: 429,
      message: 'Too many requests from this IP, please try again later.',
      error: 'Too Many Requests',
    },
    standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
    legacyHeaders: false, // Disable `X-RateLimit-*` headers
    // Skip rate limiting for health checks
    skip: (req) => req.url.includes('/health'),
  });

  app.use(limiter);
  logger.log('🛡️  Express rate limiting enabled (100 req/15min per IP)');

  // ============================================
  // SECURITY: HTTPS Redirect (Production Only)
  // ============================================
  // Trust proxy to read X-Forwarded-Proto header
  if (environment === 'production' || environment === 'prod') {
    const expressInstance = app.getHttpAdapter().getInstance() as {
      set: (key: string, value: unknown) => void;
    };
    expressInstance.set('trust proxy', 1);
    logger.log('🔐 Trust proxy enabled for production');

    // Note: HTTPS redirect is typically handled by the hosting platform
    // (Netlify, Vercel, Railway, Render, etc.) or reverse proxy (Nginx, Cloudflare)
    // If you need application-level HTTPS redirect, uncomment below:
    /*
    const httpsMiddleware = createHttpsRedirectMiddleware(environment);
    if (httpsMiddleware) {
      app.use(httpsMiddleware);
      logger.log('🔐 HTTPS redirect enabled');
    }
    */
  }

  // Set global prefix
  app.setGlobalPrefix(apiPrefix);

  // Enable CORS
  app.enableCors({
    origin: corsOrigin,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    // allowedHeaders: ['Content-Type', 'Authorization', 'Accept'], // Commented out to allow all headers (fixes CORS preflight)
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that don't have decorators
      forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are present
      transform: true, // Automatically transform payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true, // Automatically convert types
      },
    }),
  );

  // Global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // Global response transformer
  app.useGlobalInterceptors(new TransformInterceptor());

  await app.listen(port);

  logger.log(
    `🚀 Para Shooting Committee API is running on: http://localhost:${port}/${apiPrefix}`,
  );
  logger.log(`📊 Health check: http://localhost:${port}/${apiPrefix}/health`);
  logger.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.log(`🔗 CORS enabled for: ${corsOrigin}`);
}

void bootstrap();
