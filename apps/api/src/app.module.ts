import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';
import { UsersModule } from './users/users.module.js';
import { AuthModule } from './auth/auth.module.js';
import { StatesModule } from './states/states.module.js';
import { DisabilityCategoriesModule } from './disability-categories/disability-categories.module.js';
import { VenuesModule } from './venues/venues.module.js';
import { ShootersModule } from './shooters/shooters.module.js';
import { ResultsModule } from './results/results.module.js';
import { NewsModule } from './news/news.module.js';
import { UploadModule } from './upload/upload.module.js';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard.js';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { AuditLog } from './common/entities/audit-log.entity.js';
import { AuditService } from './common/services/audit.service.js';
import { EncryptionService } from './common/services/encryption.service.js';
import { PermissionsGuard } from './common/guards/permissions.guard.js';
import { Role } from './auth/entities/role.entity.js';
import { UserRole } from './auth/entities/user-role.entity.js';
import configuration from './config/configuration';
import { getDatabaseConfig } from './config/database.config';

@Module({
  imports: [
    // Environment Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: '.env',
    }),

    // Rate Limiting - Multi-tier strategy for 40k peak users
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,    // 1 second
        limit: 10,    // 10 requests per second (burst protection)
      },
      {
        name: 'medium',
        ttl: 60000,   // 1 minute
        limit: 100,   // 100 requests per minute (standard protection)
      },
      {
        name: 'long',
        ttl: 900000,  // 15 minutes
        limit: 1000,  // 1000 requests per 15 min (sustained load protection)
      },
    ]),

    // Database Configuration
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getDatabaseConfig,
      inject: [ConfigService],
    }),

    // Register entities for audit and permissions
    TypeOrmModule.forFeature([AuditLog, Role, UserRole]),

    // Feature Modules
    HealthModule,
    UsersModule,
    AuthModule,
    StatesModule,
    DisabilityCategoriesModule,
    VenuesModule,
    ShootersModule,
    ResultsModule,
    NewsModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AuditService,
    EncryptionService,
    PermissionsGuard,
    // Global JWT Guard - all routes require authentication by default
    // Use @Public() decorator to make routes public
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    // Global Rate Limiting
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    // Global Audit Logging (Temporarily disabled due to constraint error)
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: AuditInterceptor,
    // },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
