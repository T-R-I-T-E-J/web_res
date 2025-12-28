import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
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

  logger.log(`🔒 Security headers enabled for: ${environment}`);

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
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
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
