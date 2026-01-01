import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {
  multerConfig,
  profilePictureConfig,
  documentConfig,
} from '../config/multer.config';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('upload')
@UseGuards(JwtAuthGuard) // Require authentication for all uploads
export class UploadController {
  /**
   * Upload a single file (general purpose)
   */
  @Post('file')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    return {
      message: 'File uploaded successfully',
      file: {
        filename: file.filename,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        path: file.path,
        url: `/uploads/${file.filename}`,
      },
    };
  }

  /**
   * Upload multiple files
   */
  @Post('files')
  @UseInterceptors(FilesInterceptor('files', 10, multerConfig))
  uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    return {
      message: `${files.length} files uploaded successfully`,
      files: files.map((file) => ({
        filename: file.filename,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
      })),
    };
  }

  /**
   * Upload profile picture
   */
  @Post('profile-picture')
  @UseInterceptors(FileInterceptor('profilePicture', profilePictureConfig))
  uploadProfilePicture(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No profile picture uploaded');
    }

    return {
      message: 'Profile picture uploaded successfully',
      file: {
        filename: file.filename,
        size: file.size,
        url: `/uploads/profiles/${file.filename}`, // Public URL
      },
    };
  }

  /**
   * Upload document (PDF, Word, Excel)
   */
  @Post('document')
  @UseInterceptors(FileInterceptor('document', documentConfig))
  uploadDocument(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No document uploaded');
    }

    // Optional: Scan for viruses here
    // await this.virusScanService.scan(file.path);

    return {
      message: 'Document uploaded successfully',
      file: {
        filename: file.filename,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
      },
    };
  }

  /**
   * Upload multiple documents
   */
  @Post('documents')
  @UseInterceptors(FilesInterceptor('documents', 5, documentConfig))
  uploadDocuments(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No documents uploaded');
    }

    return {
      message: `${files.length} documents uploaded successfully`,
      files: files.map((file) => ({
        filename: file.filename,
        originalName: file.originalname,
        size: file.size,
      })),
    };
  }
}
