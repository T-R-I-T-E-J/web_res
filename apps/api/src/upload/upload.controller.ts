import {
  Controller,
  Post,
  Get,
  Param,
  Res,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  multerConfig,
  profilePictureConfig,
  documentConfig,
} from '../config/multer.config';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';
import { StoredFile } from './entities/stored-file.entity';

@Controller('upload')
export class UploadController {
  constructor(
    @InjectRepository(StoredFile)
    private readonly filesRepository: Repository<StoredFile>,
  ) {}

  /**
   * Helper to handle storage (Disk or DB)
   */
  private async saveFile(file: Express.Multer.File, subfolder = ''): Promise<{ url: string; filename: string }> {
    if (file.buffer) {
      // Memory Storage (e.g. Vercel) -> Save to DB
      const storedFile = this.filesRepository.create({
        filename: `${Date.now()}_${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`,
        originalName: file.originalname,
        mimetype: file.mimetype,
        data: file.buffer,
        size: file.size,
      });
      await this.filesRepository.save(storedFile);
      return { 
        url: `/api/v1/upload/view/${storedFile.filename}`, 
        filename: storedFile.filename 
      };
    } else {
      // Disk Storage (Local Dev)
      // path is like "uploads\filename.ext" or "uploads/filename.ext"
      return { 
        url: `/uploads/${subfolder ? subfolder + '/' : ''}${file.filename}`, 
        filename: file.filename 
      };
    }
  }

  /**
   * Serve file from DB (Public access)
   */
  @Public()
  @Get('view/:filename')
  async viewFile(@Param('filename') filename: string, @Res() res: Response) {
    const file = await this.filesRepository.findOne({ where: { filename } });
    if (!file) {
      throw new NotFoundException('File not found');
    }

    res.set({
      'Content-Type': file.mimetype,
      'Content-Length': file.size,
      'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
    });

    res.send(file.data);
  }

  @UseGuards(JwtAuthGuard)
  @Post('file')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const { url, filename } = await this.saveFile(file);

    return {
      message: 'File uploaded successfully',
      file: {
        filename: filename,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        path: file.path || 'db-stored',
        url: url,
      },
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('files')
  @UseInterceptors(FilesInterceptor('files', 10, multerConfig))
  async uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    const uploadedFiles = await Promise.all(
      files.map(async (file) => {
        const { url, filename } = await this.saveFile(file);
        return {
          filename: filename,
          originalName: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          url: url,
        };
      })
    );

    return {
      message: `${files.length} files uploaded successfully`,
      files: uploadedFiles,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile-picture')
  @UseInterceptors(FileInterceptor('profilePicture', profilePictureConfig))
  async uploadProfilePicture(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No profile picture uploaded');
    }

    const { url, filename } = await this.saveFile(file, 'profiles');

    return {
      message: 'Profile picture uploaded successfully',
      file: {
        filename: filename,
        size: file.size,
        url: url,
      },
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('document')
  @UseInterceptors(FileInterceptor('document', documentConfig))
  async uploadDocument(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No document uploaded');
    }

    const { url, filename } = await this.saveFile(file, 'documents');

    return {
      message: 'Document uploaded successfully',
      file: {
        filename: filename,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        url: url,
      },
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('documents')
  @UseInterceptors(FilesInterceptor('documents', 5, documentConfig))
  async uploadDocuments(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No documents uploaded');
    }

    const uploadedFiles = await Promise.all(
      files.map(async (file) => {
        const { url, filename } = await this.saveFile(file, 'documents');
        return {
          filename: filename,
          originalName: file.originalname,
          size: file.size,
          url: url,
        };
      })
    );

    return {
      message: `${files.length} documents uploaded successfully`,
      files: uploadedFiles,
    };
  }
}
