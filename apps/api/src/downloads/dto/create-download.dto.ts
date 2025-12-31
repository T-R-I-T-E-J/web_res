import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { DownloadCategory } from '../entities/download.entity';

export class CreateDownloadDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  fileType: string;

  @IsString()
  @IsOptional()
  size?: string;

  @IsString()
  @IsNotEmpty()
  href: string;

  @IsEnum(DownloadCategory)
  @IsOptional()
  category?: DownloadCategory;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
