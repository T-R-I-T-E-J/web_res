import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsEnum,
  IsBoolean,
  IsUrl,
} from 'class-validator';
import { EventStatus } from '../entities/event.entity';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsDateString()
  @IsNotEmpty()
  start_date: Date;

  @IsDateString()
  @IsNotEmpty()
  end_date: Date;

  @IsEnum(EventStatus)
  @IsOptional()
  status?: EventStatus;

  @IsUrl()
  @IsOptional()
  registration_link?: string;

  @IsUrl()
  @IsOptional()
  circular_link?: string;

  @IsBoolean()
  @IsOptional()
  is_featured?: boolean;
}
