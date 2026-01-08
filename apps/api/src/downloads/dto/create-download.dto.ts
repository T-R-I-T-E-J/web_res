import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

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

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  categoryId?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
