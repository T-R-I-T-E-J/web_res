import {
  IsString,
  IsEmail,
  IsOptional,
  IsBoolean,
  Length,
  IsDateString,
} from 'class-validator';

export class CreateStateDto {
  @IsString()
  @Length(2, 10)
  code: string;

  @IsString()
  @Length(2, 200)
  name: string;

  @IsString()
  @Length(2, 100)
  state: string;

  @IsOptional()
  @IsString()
  @Length(2, 200)
  secretary_name?: string;

  @IsOptional()
  @IsEmail()
  secretary_email?: string;

  @IsOptional()
  @IsString()
  @Length(5, 20)
  secretary_phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsDateString()
  affiliated_since?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
