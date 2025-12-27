import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

@Injectable()
export class HealthService {
  constructor(
    @InjectConnection()
    private readonly connection: Connection,
  ) {}

  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'Para Shooting Committee API',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
    };
  }

  async checkDatabase() {
    try {
      // Execute a simple query to check database connectivity
      await this.connection.query('SELECT 1');
      return {
        status: 'ok',
        database: 'connected',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      return {
        status: 'error',
        database: 'disconnected',
        error: errorMessage,
        timestamp: new Date().toISOString(),
      };
    }
  }
}
