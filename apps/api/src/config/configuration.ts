import { registerAs } from '@nestjs/config';
import { Config } from './config.interface';

export default registerAs(
  'config',
  (): Config => ({
    app: {
      nodeEnv: process.env.NODE_ENV || 'development',
      port: parseInt(process.env.PORT || '8080', 10),
      apiPrefix: process.env.API_PREFIX || 'api/v1',
      corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    },
    database: {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || 'psci_admin',
      password: process.env.DB_PASSWORD || 'psci_secure_2025',
      database: process.env.DB_DATABASE || 'psci_platform',
    },
    jwt: {
      secret: process.env.JWT_SECRET || 'development-secret-key',
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
      refreshSecret: process.env.JWT_REFRESH_SECRET || 'development-refresh-secret',
      refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
    },
    razorpay: {
      keyId: process.env.RAZORPAY_KEY_ID || '',
      keySecret: process.env.RAZORPAY_KEY_SECRET || '',
    },
  }),
);
