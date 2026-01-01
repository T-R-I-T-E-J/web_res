import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsUrl,
} from 'class-validator';
import { MediaType } from '../entities/media.entity.js';

export class CreateMediaDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsEnum(MediaType)
  @IsOptional()
  type?: MediaType;

  @IsString()
  @IsNotEmpty()
  url: string;

  @IsUrl()
  @IsOptional()
  thumbnail_url?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  alt_text?: string;

  @IsBoolean()
  @IsOptional()
  is_featured?: boolean;
}
