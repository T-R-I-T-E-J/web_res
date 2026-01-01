import { Type } from 'class-transformer';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { NewsCategory, NewsStatus } from '../entities/news.entity';

export class DocumentDto {
  @IsString()
  url: string;

  @IsString()
  name: string;
}

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
  featured_image_url?: string;

  @IsOptional()
  @IsString()
  preview_image_url?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  image_urls?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DocumentDto)
  documents?: DocumentDto[];

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
