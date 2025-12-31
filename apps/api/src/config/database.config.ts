import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { DatabaseConfig } from './config.interface';
import { Logger } from '@nestjs/common';

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const dbConfig = configService.get<DatabaseConfig>('config.database');

  if (!dbConfig) {
    throw new Error('Database configuration is missing');
  }

  // Conditional Debug logging

  const logger = new Logger('DatabaseConfig');
  if (process.env.NODE_ENV === 'production') {
    logger.debug('Database configuration hidden for security');
  } else if (process.env.DEBUG === 'true') {
    logger.debug({
      host: dbConfig.host,
      port: dbConfig.port,
      username: dbConfig.username,
      database: dbConfig.database,
      passwordSet: !!dbConfig.password,
    });
  }

  return {
    type: 'postgres',
    host: dbConfig.host,
    port: dbConfig.port,
    username: dbConfig.username,
    password: dbConfig.password,
    database: dbConfig.database,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: false, // NEVER use true in production - use migrations instead
    logging: process.env.NODE_ENV === 'development',
    ssl:
      process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : false,
    extra: {
      max: 20, // Maximum number of connections in the pool
      connectionTimeoutMillis: 30000, // Increased to 30 seconds for debugging
    },
  };
};
