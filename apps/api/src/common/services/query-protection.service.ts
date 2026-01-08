import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class QueryProtectionService implements OnModuleInit {
  private readonly logger = new Logger(QueryProtectionService.name);

  // Dangerous SQL keywords that might indicate injection
  private readonly DANGEROUS_KEYWORDS = [
    'DROP',
    'DELETE',
    'TRUNCATE',
    'ALTER',
    'CREATE',
    'EXEC',
    'EXECUTE',
    'SCRIPT',
    'JAVASCRIPT',
    'UNION',
    'CONCAT',
    'CHAR',
    'NCHAR',
    '--',
    '/*',
    '*/',
    'xp_',
    'sp_',
  ];

  // Maximum query execution time (milliseconds)
  private readonly MAX_QUERY_TIME = 30000; // 30 seconds

  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async onModuleInit() {
    await this.setupQueryMonitoring();
  }

  /**
   * Setup query monitoring and protection
   */
  private async setupQueryMonitoring(): Promise<void> {
    try {
      // Set statement timeout in PostgreSQL
      await this.dataSource.query(
        `SET statement_timeout = ${this.MAX_QUERY_TIME}`,
      );

      // Set lock timeout
      await this.dataSource.query('SET lock_timeout = 10000'); // 10 seconds

      // Set idle in transaction timeout
      await this.dataSource.query(
        'SET idle_in_transaction_session_timeout = 60000',
      ); // 1 minute
    } catch (error) {
      this.logger.error('Failed to setup query protection settings', error);
    }
  }

  /**
   * Validate input for SQL injection
   */
  validateInput(input: string): boolean {
    if (!input) return true;

    const upperInput = input.toUpperCase();

    // Check for dangerous keywords
    for (const keyword of this.DANGEROUS_KEYWORDS) {
      if (upperInput.includes(keyword)) {
        console.error(
          `[SECURITY] Potential SQL injection detected: "${input}" contains "${keyword}"`,
        );
        return false;
      }
    }

    // Check for common SQL injection patterns
    const injectionPatterns = [
      /(%27)|(')|(--)|(%23)|(#)/i, // SQL meta-characters
      /((%3D)|(=))[^\n]*((%27)|(')|(--)|(%3B)|(;))/i, // Typical SQL injection
      /\w*((%27)|('))((%6F)|o|(%4F))((%72)|r|(%52))/i, // 'or' pattern
      /((%27)|('))union/i, // UNION keyword
      /exec(\s|\+)+(s|x)p\w+/i, // Stored procedure execution
    ];

    for (const pattern of injectionPatterns) {
      if (pattern.test(input)) {
        console.error(
          `[SECURITY] SQL injection pattern detected in: "${input}"`,
        );
        return false;
      }
    }

    return true;
  }

  /**
   * Sanitize input
   */
  sanitizeInput(input: string): string {
    if (!input) return input;

    // Remove SQL comments
    let sanitized = input.replaceAll(/--.*$/gm, '');
    sanitized = sanitized.replaceAll(/\/\*.*?\*\//g, '');

    // Escape single quotes
    sanitized = sanitized.replaceAll("'", "''");

    // Remove null bytes
    sanitized = sanitized.replaceAll('\0', '');

    return sanitized.trim();
  }

  /**
   * Kill long-running queries
   */
  async killLongRunningQueries(): Promise<number> {
    const maxDuration = this.MAX_QUERY_TIME / 1000; // Convert to seconds

    // Explicitly type the result as an array of any (or specific shape if known)
    // pg_terminate_backend usually returns boolean, but here we select it from a table?
    // The query selects pg_terminate_backend(pid), so it returns rows [{ pg_terminate_backend: boolean }]
    const result: Array<{ pg_terminate_backend: boolean }> = await this
      .dataSource.query(`
      SELECT pg_terminate_backend(pid)
      FROM pg_stat_activity
      WHERE state = 'active'
        AND (now() - query_start) > interval '${maxDuration} seconds'
        AND pid <> pg_backend_pid()
    `);

    const killedCount = result.length;

    if (killedCount > 0) {
      console.warn(
        `[SECURITY] Killed ${killedCount} long-running queries (>${maxDuration}s)`,
      );
    }

    return killedCount;
  }

  /**
   * Get active queries
   */
  async getActiveQueries(): Promise<any[]> {
    const result: Array<{
      pid: number;
      usename: string;
      application_name: string;
      client_addr: string;
      state: string;
      query: string;
      query_start: Date;
      duration_seconds: number;
    }> = await this.dataSource.query(`
      SELECT 
        pid,
        usename,
        application_name,
        client_addr,
        state,
        query,
        query_start,
        EXTRACT(EPOCH FROM (now() - query_start)) as duration_seconds
      FROM pg_stat_activity
      WHERE state = 'active'
        AND pid <> pg_backend_pid()
      ORDER BY query_start
    `);
    return result;
  }

  /**
   * Kill specific query by PID
   */
  async killQuery(pid: number): Promise<boolean> {
    const result: Array<{ pg_terminate_backend: boolean }> =
      await this.dataSource.query('SELECT pg_terminate_backend($1)', [pid]);

    console.warn(`[SECURITY] Killed query with PID ${pid}`);
    return result[0]?.pg_terminate_backend ?? false;
  }

  /**
   * Get connection count
   */
  async getConnectionCount(): Promise<number> {
    const result: Array<{ count: string }> = await this.dataSource.query(
      'SELECT count(*) as count FROM pg_stat_activity',
    );

    return Number.parseInt(result[0]?.count ?? '0', 10);
  }

  /**
   * Kill idle connections
   */
  async killIdleConnections(idleMinutes = 30): Promise<number> {
    const result: Array<{ pg_terminate_backend: boolean }> = await this
      .dataSource.query(`
      SELECT pg_terminate_backend(pid)
      FROM pg_stat_activity
      WHERE state = 'idle'
        AND (now() - state_change) > interval '${idleMinutes} minutes'
        AND pid <> pg_backend_pid()
    `);

    const killedCount = result.length;

    if (killedCount > 0) {
      console.log(
        `[SECURITY] Killed ${killedCount} idle connections (>${idleMinutes}min)`,
      );
    }

    return killedCount;
  }

  /**
   * Prevent connection flooding (DoS protection)
   */
  async preventConnectionFlooding(maxConnections = 100): Promise<boolean> {
    const count = await this.getConnectionCount();

    if (count > maxConnections) {
      console.error(
        `[SECURITY] Connection flooding detected! ${count} connections (max: ${maxConnections})`,
      );

      // Kill oldest idle connections
      await this.killIdleConnections(5); // Kill idle > 5 minutes

      return false;
    }

    return true;
  }
}
