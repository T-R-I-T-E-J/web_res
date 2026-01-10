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

  const logger = new Logger('DatabaseConfig');
  if (process.env.DEBUG === 'true') {
     logger.log('Database logging enabled for debugging');
  }

  return {
    type: 'postgres',
    host: dbConfig.host,
    port: dbConfig.port,
    username: dbConfig.username,
    password: dbConfig.password,
    database: dbConfig.database,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    autoLoadEntities: true,
    synchronize: false, // EXPLICITLY DISABLED
    migrationsRun: false, // EXPLICITLY DISABLED
    dropSchema: false,
    logging: true, // Keep logging to see what happens
    ssl:
      process.env.NODE_ENV === 'production' || process.env.POSTGRES_URL
        ? { rejectUnauthorized: false }
        : false,
    extra: {
      max: 20,
      connectionTimeoutMillis: 30000,
    },
  };
};
