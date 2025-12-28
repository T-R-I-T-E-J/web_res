import {
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsArray,
  IsUrl,
} from 'class-validator';
import { NewsCategory, NewsStatus } from '../entities/news.entity';

export class CreateNewsDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  excerpt?: string;

  @IsEnum(NewsCategory)
  category: NewsCategory;

  @IsOptional()
  @IsString()
  featured_image_url?: string; // IsUrl check might fail if it's a relative path or s3 key, keeping it flex or use specific validator if needed. Assuming full URL or relative path string.

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsEnum(NewsStatus)
  status?: NewsStatus;

  @IsOptional()
  @IsBoolean()
  is_featured?: boolean;

  @IsOptional()
  @IsBoolean()
  is_pinned?: boolean;
}
