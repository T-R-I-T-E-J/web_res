import {
  IsString,
  IsInt,
  IsBoolean,
  IsOptional,
  IsEnum,
} from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsString()
  slug: string;

  @IsString()
  @IsOptional()
  page?: string;

  @IsInt()
  @IsOptional()
  order?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateCategoryDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsString()
  @IsOptional()
  page?: string;

  @IsInt()
  @IsOptional()
  order?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
