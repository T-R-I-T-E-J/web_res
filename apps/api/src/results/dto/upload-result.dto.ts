import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

/**
 * DTO for uploading a result PDF
 * Used when admin uploads a new competition result
 */
export class UploadResultDto {
  /**
   * Title of the result/competition
   * Example: "Complete Result of 6th NPSC 2025"
   */
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  /**
   * Year or date of the competition
   * Example: "2025" or "2024"
   */
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  date: string;

  /**
   * Optional description
   * Example: "National Para Shooting Championship results"
   */
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;
}
