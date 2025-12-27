import {
  IsInt,
  IsString,
  IsIn,
  IsDateString,
  IsOptional,
} from 'class-validator';

export class CreateShooterClassificationDto {
  @IsInt()
  disability_category_id: number;

  @IsString()
  @IsIn(['NEW', 'REVIEW', 'CONFIRMED', 'FIXED'])
  classification_status: 'NEW' | 'REVIEW' | 'CONFIRMED' | 'FIXED';

  @IsDateString()
  classification_date: string;

  @IsOptional()
  @IsDateString()
  valid_until?: string;

  @IsOptional()
  @IsString()
  classifier_name?: string;

  @IsOptional()
  @IsString()
  classification_venue?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
