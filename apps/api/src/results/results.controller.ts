import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  HttpStatus,
  Request,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResultsService } from './services/results.service';
import { UploadResultDto } from './dto/upload-result.dto';
import { ResultResponseDto } from './dto/result-response.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';

/**
 * Results Controller
 *
 * Handles PDF upload and management for competition results
 *
 * Security:
 * - Upload: Admin only (@Roles('admin'))
 * - Delete: Admin only (@Roles('admin'))
 * - List/View: Public (@Public())
 */
@Controller('results')
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) {}

  /**
   * Upload a new result PDF
   *
   * POST /api/v1/results/upload
   *
   * Security: Admin only
   *
   * Request:
   * - Content-Type: multipart/form-data
   * - Authorization: Bearer <admin-token>
   * - Body:
   *   - file: PDF file (required)
   *   - title: string (required)
   *   - date: string (required)
   *   - description: string (optional)
   *
   * Response:
   * - 201 Created: Result uploaded successfully
   * - 400 Bad Request: Invalid file or validation error
   * - 401 Unauthorized: Not authenticated
   * - 403 Forbidden: Not an admin
   *
   * Example:
   * ```bash
   * curl -X POST http://localhost:8080/api/v1/results/upload \
   *   -H "Authorization: Bearer <admin-token>" \
   *   -F "file=@result.pdf" \
   *   -F "title=Complete Result of 6th NPSC 2025" \
   *   -F "date=2025" \
   *   -F "description=National Para Shooting Championship"
   * ```
   */
  @Post('upload')
  @Roles('admin') // Admin only
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB max
        files: 1, // Single file only
      },
    }),
  )
  async uploadResult(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadDto: UploadResultDto,
    @Request() req: { user: { userId: number } },
  ): Promise<ResultResponseDto> {
    const userId = req.user.userId;
    return this.resultsService.uploadResult(file, uploadDto, userId);
  }

  /**
   * Get all published results
   *
   * GET /api/v1/results
   *
   * Security: Public (no authentication required)
   *
   * Response:
   * - 200 OK: List of results
   *
   * Example:
   * ```bash
   * curl http://localhost:8080/api/v1/results
   * ```
   */
  @Get()
  @Public() // Public access
  async findAll(): Promise<ResultResponseDto[]> {
    return this.resultsService.findAll();
  }

  /**
   * Get a single result by ID
   *
   * GET /api/v1/results/:id
   *
   * Security: Public (no authentication required)
   *
   * Response:
   * - 200 OK: Result details
   * - 404 Not Found: Result not found
   *
   * Example:
   * ```bash
   * curl http://localhost:8080/api/v1/results/123e4567-e89b-12d3-a456-426614174000
   * ```
   */
  @Get(':id')
  @Public() // Public access
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ResultResponseDto> {
    return this.resultsService.findOne(id);
  }

  /**
   * Delete a result (soft delete)
   *
   * DELETE /api/v1/results/:id
   *
   * Security: Admin only
   *
   * Response:
   * - 204 No Content: Result deleted successfully
   * - 404 Not Found: Result not found
   * - 401 Unauthorized: Not authenticated
   * - 403 Forbidden: Not an admin
   *
   * Example:
   * ```bash
   * curl -X DELETE http://localhost:8080/api/v1/results/123e4567-e89b-12d3-a456-426614174000 \
   *   -H "Authorization: Bearer <admin-token>"
   * ```
   */
  @Delete(':id')
  @Roles('admin') // Admin only
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteResult(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: { user: { userId: number } },
  ): Promise<void> {
    const userId = req.user.userId;
    return this.resultsService.deleteResult(id, userId);
  }
}

/**
 * API Contract Summary
 *
 * Endpoints:
 * 1. POST   /api/v1/results/upload  - Upload PDF (Admin only)
 * 2. GET    /api/v1/results         - List all results (Public)
 * 3. GET    /api/v1/results/:id     - Get single result (Public)
 * 4. DELETE /api/v1/results/:id     - Delete result (Admin only)
 *
 * Authentication:
 * - Admin endpoints require JWT token with 'admin' role
 * - Public endpoints require no authentication
 *
 * File Validation:
 * - Type: PDF only (application/pdf)
 * - Size: Max 10MB
 * - Extension: .pdf only
 *
 * Response Codes:
 * - 200 OK: Success (GET)
 * - 201 Created: Success (POST)
 * - 204 No Content: Success (DELETE)
 * - 400 Bad Request: Validation error
 * - 401 Unauthorized: Not authenticated
 * - 403 Forbidden: Not authorized (not admin)
 * - 404 Not Found: Resource not found
 * - 500 Internal Server Error: Server error
 */
