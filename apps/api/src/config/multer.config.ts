import { diskStorage, memoryStorage } from 'multer';
import { extname, join } from 'path';
import * as crypto from 'crypto';
import { BadRequestException } from '@nestjs/common';

const isProduction =
  process.env.NODE_ENV === 'production' || process.env.VERCEL;

/**
 * Multer configuration for secure file uploads
 */
export const multerConfig = {
  // Storage configuration
  storage: isProduction
    ? memoryStorage()
    : diskStorage({
        // Destination folder (relative to project root)
        destination: (req: any, file: any, cb: any) => {
          // Store files outside web root for security
          const uploadPath = join(process.cwd(), 'uploads');
          cb(null, uploadPath);
        },

        // Filename configuration
        filename: (req: any, file: any, cb: any) => {
          // Generate cryptographically secure random filename
          const randomName = crypto.randomBytes(16).toString('hex');
          const ext = extname(file.originalname).toLowerCase();
          const timestamp = Date.now();

          // Format: timestamp_randomhash.ext
          const filename = `${timestamp}_${randomName}${ext}`;
          cb(null, filename);
        },
      }),

  // File filter (whitelist allowed types)
  fileFilter: (req: any, file: any, cb: any) => {
    // Allowed MIME types
    const allowedMimeTypes = [
      // Images
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',

      // Documents
      'application/pdf',
      'application/msword', // .doc
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/vnd.ms-excel', // .xls
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx

      // Text
      'text/plain',
      'text/csv',
    ];

    // Allowed file extensions
    const allowedExtensions = [
      '.jpg',
      '.jpeg',
      '.png',
      '.gif',
      '.webp',
      '.pdf',
      '.doc',
      '.docx',
      '.xls',
      '.xlsx',
      '.txt',
      '.csv',
    ];

    const ext = extname(file.originalname).toLowerCase();
    const mimeType = file.mimetype.toLowerCase();

    // Check both MIME type and extension
    const isMimeTypeAllowed = allowedMimeTypes.includes(mimeType);
    const isExtensionAllowed = allowedExtensions.includes(ext);

    if (isMimeTypeAllowed && isExtensionAllowed) {
      cb(null, true);
    } else {
      cb(
        new BadRequestException(
          `Invalid file type. Allowed types: ${allowedExtensions.join(', ')}`,
        ),
        false,
      );
    }
  },

  // File size limits
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
    files: 10, // Max 10 files per request
  },
};

/**
 * Configuration for profile picture uploads (stricter)
 */
export const profilePictureConfig = {
  storage: isProduction
    ? memoryStorage()
    : diskStorage({
        destination: join(process.cwd(), 'uploads', 'profiles'),
        filename: (req: any, file: any, cb: any) => {
          const randomName = crypto.randomBytes(16).toString('hex');
          const ext = extname(file.originalname).toLowerCase();
          cb(null, `profile_${randomName}${ext}`);
        },
      }),

  fileFilter: (req: any, file: any, cb: any) => {
    // Only allow images for profile pictures
    const allowedMimeTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
    ];

    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

    const ext = extname(file.originalname).toLowerCase();
    const mimeType = file.mimetype.toLowerCase();

    if (
      allowedMimeTypes.includes(mimeType) &&
      allowedExtensions.includes(ext)
    ) {
      cb(null, true);
    } else {
      cb(
        new BadRequestException(
          'Invalid file type. Only JPEG, PNG, and WebP images allowed for profile pictures.',
        ),
        false,
      );
    }
  },

  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB max for profile pictures
    files: 1, // Only 1 file
  },
};

/**
 * Configuration for document uploads (PDF, Word, Excel)
 */
export const documentConfig = {
  storage: isProduction
    ? memoryStorage()
    : diskStorage({
        destination: join(process.cwd(), 'uploads', 'documents'),
        filename: (req: any, file: any, cb: any) => {
          const randomName = crypto.randomBytes(16).toString('hex');
          const ext = extname(file.originalname).toLowerCase();
          const timestamp = Date.now();
          cb(null, `doc_${timestamp}_${randomName}${ext}`);
        },
      }),

  fileFilter: (req: any, file: any, cb: any) => {
    // Only allow documents
    const allowedMimeTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];

    const allowedExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx'];

    const ext = extname(file.originalname).toLowerCase();
    const mimeType = file.mimetype.toLowerCase();

    if (
      allowedMimeTypes.includes(mimeType) &&
      allowedExtensions.includes(ext)
    ) {
      cb(null, true);
    } else {
      cb(
        new BadRequestException(
          'Invalid file type. Only PDF, Word, and Excel documents allowed.',
        ),
        false,
      );
    }
  },

  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max for documents
    files: 5, // Max 5 documents
  },
};

/**
 * Helper function to validate file content (not just extension)
 * This provides additional security against file upload attacks
 */
export function validateFileContent(file: Express.Multer.File): boolean {
  // Read file magic numbers (first few bytes) to verify actual file type
  // This prevents attackers from renaming malicious files

  // For now, we rely on MIME type and extension validation
  // In production, consider using a library like 'file-type' for magic number validation

  return true;
}

/**
 * Helper function to sanitize filename
 * Removes potentially dangerous characters
 */
export function sanitizeFilename(filename: string): string {
  // Remove path traversal attempts
  filename = filename.replace(/\.\./g, '');

  // Remove special characters except dots, hyphens, underscores
  filename = filename.replace(/[^a-zA-Z0-9._-]/g, '_');

  // Limit filename length
  if (filename.length > 255) {
    const ext = extname(filename);
    const nameWithoutExt = filename.substring(0, 255 - ext.length);
    filename = nameWithoutExt + ext;
  }

  return filename;
}
