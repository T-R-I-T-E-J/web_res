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
      
      // Check if stored_files table exists
      const tableCheck = await this.connection.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'stored_files'
        );
      `);
      
      return {
        status: 'ok',
        database: 'connected',
        storedFilesTable: tableCheck[0]?.exists || false,
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

  async runStoredFilesMigration() {
    try {
      await this.connection.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
      
      await this.connection.query(`
        CREATE TABLE IF NOT EXISTS stored_files (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          filename VARCHAR NOT NULL,
          "originalName" VARCHAR NOT NULL,
          mimetype VARCHAR NOT NULL,
          data BYTEA NOT NULL,
          size INTEGER DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      
      return {
        status: 'success',
        message: 'stored_files table created successfully'
      };
    } catch (error) {
      return {
        status: 'error',
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
}
