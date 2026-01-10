import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { getSecurityConfig } from './config/security.config';

export function configureApp(app: INestApplication) {
  const configService = app.get(ConfigService);

  const apiPrefix =
    configService.get<string>('config.app.apiPrefix') || 'api/v1';
  const corsOrigin =
    configService.get<string>('config.app.corsOrigin') ||
    'http://localhost:3000';
  const environment = process.env.NODE_ENV || 'development';

  // ============================================
  // CORS: Enable CORS BEFORE other middleware
  // ============================================
  // IMPORTANT: CORS must be enabled before Helmet to properly handle preflight requests
  app.enableCors({
    origin: corsOrigin,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type,Authorization,Accept',
    exposedHeaders: 'Content-Range,X-Content-Range',
    maxAge: 3600, // Cache preflight requests for 1 hour
  });

  // ============================================
  // SECURITY: Helmet.js Middleware
  // ============================================
  const securityConfig = getSecurityConfig(environment);
  app.use(helmet(securityConfig));
  app.use(cookieParser());

  // ============================================
  // SECURITY: Express Rate Limiting
  // ============================================
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5000,
    message: {
      statusCode: 429,
      message: 'Too many requests from this IP, please try again later.',
      error: 'Too Many Requests',
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => req.url.includes('/health'),
  });

  app.use(limiter);

  // ============================================
  // SECURITY: HTTPS Redirect (Production Only)
  // ============================================
  if (environment === 'production' || environment === 'prod') {
    const expressInstance = app.getHttpAdapter().getInstance() as {
      set: (key: string, value: unknown) => void;
    };
    if (expressInstance && typeof expressInstance.set === 'function') {
      expressInstance.set('trust proxy', 1);
    }
  }

  // Set global prefix
  app.setGlobalPrefix(apiPrefix);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // Global response transformer
  app.useGlobalInterceptors(new TransformInterceptor());

  return {
    apiPrefix,
    port: configService.get<number>('config.app.port') || 8080,
    corsOrigin,
    environment,
  };
}
