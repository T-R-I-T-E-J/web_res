import { registerAs } from '@nestjs/config';
import { Config } from './config.interface';

/**
 * Parse DATABASE_URL if provided (Railway, Heroku, etc.)
 * Format: postgresql://user:password@host:port/database
 */
function parseDatabaseUrl(url: string) {
  try {
    const parsed = new URL(url);
    return {
      host: parsed.hostname,
      port: parseInt(parsed.port || '5432', 10),
      username: parsed.username,
      password: parsed.password,
      database: parsed.pathname.slice(1), // Remove leading slash
    };
  } catch {
    return null;
  }
}

export default registerAs('config', (): Config => {
  // Parse DATABASE_URL if provided (Railway, Heroku, etc.)
  const databaseUrl = process.env.DATABASE_URL;
  const parsedDb = databaseUrl ? parseDatabaseUrl(databaseUrl) : null;

  return {
    app: {
      nodeEnv: process.env.NODE_ENV || 'development',
      port: parseInt(process.env.PORT || '8080', 10),
      apiPrefix: process.env.API_PREFIX || 'api/v1',
      corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    },
    database: {
      // Use DATABASE_URL if available, otherwise fall back to individual env vars
      host: parsedDb?.host || process.env.DB_HOST || 'localhost',
      port: parsedDb?.port || parseInt(process.env.DB_PORT || '5432', 10),
      username: parsedDb?.username || process.env.DB_USERNAME || 'admin',
      password: parsedDb?.password || process.env.DB_PASSWORD || '',
      database:
        parsedDb?.database || process.env.DB_DATABASE || 'psci_platform',
    },
    jwt: {
      secret: process.env.JWT_SECRET!,
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
      refreshSecret: process.env.JWT_REFRESH_SECRET!,
      refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
    },
    razorpay: {
      keyId: process.env.RAZORPAY_KEY_ID || '',
      keySecret: process.env.RAZORPAY_KEY_SECRET || '',
    },
  };
});
