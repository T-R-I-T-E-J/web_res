import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { randomUUID } from 'node:crypto';

/**
 * Storage Service
 *
 * Abstracted storage layer that supports:
 * - Local file system (development)
 * - Cloud storage (production) - AWS S3, Cloudflare R2, etc.
 *
 * This implementation uses local storage but is designed to be
 * easily swapped for cloud storage by implementing the same interface.
 */

export interface StorageResult {
  fileName: string;
  storedFileName: string;
  filePath: string;
  fileSize: number;
  url: string;
}

@Injectable()
export class StorageService implements OnModuleInit {
  private readonly logger = new Logger(StorageService.name);
  private readonly uploadDir: string;
  private readonly baseUrl: string;

  constructor(private readonly configService: ConfigService) {
    // Get upload directory from config or use default
    // We use 'uploads/results' inside the app directory to match ServeStaticModule in app.module.ts
    this.uploadDir =
      this.configService.get<string>('UPLOAD_DIR') ||
      path.join(process.cwd(), 'uploads', 'results');

    // Get base URL for serving files
    const port = this.configService.get<number>('config.app.port') || 4000;
    this.baseUrl =
      this.configService.get<string>('APP_URL') || `http://localhost:${port}`;
  }

  async onModuleInit() {
    // Ensure upload directory exists
    await this.ensureUploadDirectory();
  }

  /**
   * Ensure upload directory exists
   */
  private async ensureUploadDirectory(): Promise<void> {
    try {
      await fs.access(this.uploadDir);
      this.logger.log(`Upload directory exists: ${this.uploadDir}`);
    } catch {
      await fs.mkdir(this.uploadDir, { recursive: true });
      this.logger.log(`Created upload directory: ${this.uploadDir}`);
    }
  }

  /**
   * Generate unique filename
   * Format: {uuid}-{original-name}
   */
  private generateUniqueFileName(originalName: string): string {
    const uuid = randomUUID();
    const ext = path.extname(originalName);
    const nameWithoutExt = path.basename(originalName, ext);

    // Sanitize filename (remove special characters)
    const sanitized = nameWithoutExt
      .replace(/[^a-zA-Z0-9-_]/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 100); // Limit length

    return `${uuid}-${sanitized}${ext}`;
  }

  /**
   * Upload file to storage
   *
   * @param file - Multer file object
   * @returns Storage result with file metadata
   */
  async uploadFile(file: Express.Multer.File): Promise<StorageResult> {
    const storedFileName = this.generateUniqueFileName(file.originalname);
    const filePath = path.join(this.uploadDir, storedFileName);

    try {
      // Write file to disk
      await fs.writeFile(filePath, file.buffer);

      this.logger.log(
        `File uploaded successfully: ${storedFileName} (${file.size} bytes)`,
      );

      // Generate public URL
      const url = `${this.baseUrl}/results/${storedFileName}`;

      return {
        fileName: file.originalname,
        storedFileName,
        filePath,
        fileSize: file.size,
        url,
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to upload file: ${err.message}`, err.stack);
      throw new Error(`File upload failed: ${err.message}`);
    }
  }

  /**
   * Delete file from storage
   *
   * @param storedFileName - Filename to delete
   */
  async deleteFile(storedFileName: string): Promise<void> {
    const filePath = path.join(this.uploadDir, storedFileName);

    try {
      await fs.unlink(filePath);
      this.logger.log(`File deleted successfully: ${storedFileName}`);
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to delete file: ${err.message}`, err.stack);
      throw new Error(`File deletion failed: ${err.message}`);
    }
  }

  /**
   * Check if file exists
   *
   * @param storedFileName - Filename to check
   * @returns True if file exists
   */
  async fileExists(storedFileName: string): Promise<boolean> {
    const filePath = path.join(this.uploadDir, storedFileName);

    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get file metadata
   *
   * @param storedFileName - Filename to get metadata for
   * @returns File stats
   */
  async getFileMetadata(storedFileName: string): Promise<{
    size: number;
    createdAt: Date;
    modifiedAt: Date;
  }> {
    const filePath = path.join(this.uploadDir, storedFileName);

    try {
      const stats = await fs.stat(filePath);
      return {
        size: stats.size,
        createdAt: stats.birthtime,
        modifiedAt: stats.mtime,
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(
        `Failed to get file metadata: ${err.message}`,
        err.stack,
      );
      throw new Error(`Failed to get file metadata: ${err.message}`);
    }
  }
}

/**
 * Cloud Storage Service (Future Implementation)
 *
 * To use cloud storage (AWS S3, Cloudflare R2, etc.):
 *
 * 1. Install cloud SDK:
 *    npm install @aws-sdk/client-s3
 *
 * 2. Create CloudStorageService implementing same interface:
 *    - uploadFile()
 *    - deleteFile()
 *    - fileExists()
 *    - getFileMetadata()
 *
 * 3. Update module to use CloudStorageService in production:
 *    providers: [
 *      {
 *        provide: StorageService,
 *        useClass: process.env.NODE_ENV === 'production'
 *          ? CloudStorageService
 *          : StorageService
 *      }
 *    ]
 *
 * Example AWS S3 implementation:
 *
 * async uploadFile(file: Express.Multer.File): Promise<StorageResult> {
 *   const s3 = new S3Client({ region: 'us-east-1' });
 *   const key = this.generateUniqueFileName(file.originalname);
 *
 *   await s3.send(new PutObjectCommand({
 *     Bucket: 'my-bucket',
 *     Key: key,
 *     Body: file.buffer,
 *     ContentType: file.mimetype,
 *   }));
 *
 *   return {
 *     fileName: file.originalname,
 *     storedFileName: key,
 *     filePath: `s3://my-bucket/${key}`,
 *     fileSize: file.size,
 *     url: `https://my-bucket.s3.amazonaws.com/${key}`,
 *   };
 * }
 */
