import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Result } from '../entities/result.entity';
import { StorageService } from './storage.service';
import { UploadResultDto } from '../dto/upload-result.dto';
import { ResultResponseDto } from '../dto/result-response.dto';

@Injectable()
export class ResultsService {
  private readonly logger = new Logger(ResultsService.name);

  constructor(
    @InjectRepository(Result)
    private readonly resultRepository: Repository<Result>,
    private readonly storageService: StorageService,
  ) {}

  /**
   * Upload a new result PDF
   *
   * @param file - Uploaded PDF file
   * @param uploadDto - Result metadata
   * @param userId - ID of admin user uploading
   * @returns Created result with metadata
   */
  async uploadResult(
    file: Express.Multer.File,
    uploadDto: UploadResultDto,
    userId: number,
  ): Promise<ResultResponseDto> {
    this.logger.log(`Uploading result: ${uploadDto.title} by user ${userId}`);

    // Validate file
    this.validateFile(file);

    try {
      // Upload file to storage
      const storageResult = await this.storageService.uploadFile(file);

      // Create database record
      const result = this.resultRepository.create({
        title: uploadDto.title,
        date: uploadDto.date,
        description: uploadDto.description,
        file_name: storageResult.fileName,
        stored_file_name: storageResult.storedFileName,
        file_size: storageResult.fileSize,
        mime_type: file.mimetype,
        url: storageResult.url,
        uploaded_by: userId,
        is_published: true,
      });

      const savedResult = await this.resultRepository.save(result);

      this.logger.log(`Result uploaded successfully: ${savedResult.id}`);

      return this.mapToResponseDto(savedResult);
    } catch (error) {
      this.logger.error(
        `Failed to upload result: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(`Upload failed: ${error.message}`);
    }
  }

  /**
   * Get all published results
   *
   * @returns List of all published results
   */
  async findAll(): Promise<ResultResponseDto[]> {
    const results = await this.resultRepository.find({
      where: { is_published: true, is_deleted: false },
      order: { created_at: 'DESC' },
    });

    return results.map((result) => this.mapToResponseDto(result));
  }

  /**
   * Get a single result by ID
   *
   * @param id - Result ID
   * @returns Result details
   */
  async findOne(id: string): Promise<ResultResponseDto> {
    const result = await this.resultRepository.findOne({
      where: { id, is_deleted: false },
    });

    if (!result) {
      throw new NotFoundException(`Result with ID ${id} not found`);
    }

    return this.mapToResponseDto(result);
  }

  /**
   * Delete a result (soft delete)
   *
   * @param id - Result ID
   * @param userId - ID of admin user deleting
   */
  async deleteResult(id: string, userId: number): Promise<void> {
    this.logger.log(`Deleting result ${id} by user ${userId}`);

    const result = await this.resultRepository.findOne({
      where: { id, is_deleted: false },
    });

    if (!result) {
      throw new NotFoundException(`Result with ID ${id} not found`);
    }

    // Soft delete in database
    result.is_deleted = true;
    await this.resultRepository.save(result);

    // Optionally delete physical file
    // Uncomment if you want to delete the file immediately
    // await this.storageService.deleteFile(result.stored_file_name);

    this.logger.log(`Result deleted successfully: ${id}`);
  }

  /**
   * Validate uploaded file
   *
   * @param file - File to validate
   * @throws BadRequestException if validation fails
   */
  private validateFile(file: Express.Multer.File): void {
    // Check if file exists
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Check file type (MIME type)
    const allowedMimeTypes = ['application/pdf'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type. Only PDF files are allowed. Received: ${file.mimetype}`,
      );
    }

    // Check file extension
    const allowedExtensions = ['.pdf'];
    const fileExtension = file.originalname
      .toLowerCase()
      .substring(file.originalname.lastIndexOf('.'));

    if (!allowedExtensions.includes(fileExtension)) {
      throw new BadRequestException(
        `Invalid file extension. Only .pdf files are allowed. Received: ${fileExtension}`,
      );
    }

    // Check file size (max 10MB)
    const maxSizeInBytes = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSizeInBytes) {
      throw new BadRequestException(
        `File too large. Maximum size is 10MB. Received: ${(file.size / 1024 / 1024).toFixed(2)}MB`,
      );
    }

    // Check if file is empty
    if (file.size === 0) {
      throw new BadRequestException('File is empty');
    }

    this.logger.log(
      `File validation passed: ${file.originalname} (${file.size} bytes)`,
    );
  }

  /**
   * Map entity to response DTO
   *
   * @param result - Result entity
   * @returns Response DTO
   */
  private mapToResponseDto(result: Result): ResultResponseDto {
    return {
      id: result.id,
      title: result.title,
      date: result.date,
      description: result.description,
      fileName: result.file_name,
      storedFileName: result.stored_file_name,
      fileSize: Number(result.file_size),
      mimeType: result.mime_type,
      url: result.url,
      uploadedAt: result.created_at,
      uploadedBy: result.uploaded_by.toString(),
    };
  }
}
