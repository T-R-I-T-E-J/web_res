import {
  IsString,
  IsOptional,
  IsDateString,
  IsIn,
  IsNumber,
} from 'class-validator';

export class CreateShooterProfileDto {
  @IsDateString()
  date_of_birth: string;

  @IsString()
  @IsIn(['male', 'female', 'other'])
  gender: 'male' | 'female' | 'other';

  @IsOptional()
  @IsString()
  issf_id?: string;

  @IsOptional()
  @IsString()
  nationality?: string;

  @IsOptional()
  @IsNumber()
  state_association_id?: number;

  @IsOptional()
  @IsString()
  blood_group?: string;

  @IsOptional()
  @IsString()
  emergency_contact_name?: string;

  @IsOptional()
  @IsString()
  emergency_contact_phone?: string;

  @IsOptional()
  @IsString()
  coach_name?: string;

  @IsOptional()
  @IsString()
  club_name?: string;

  @IsOptional()
  @IsString()
  bio?: string;
}
