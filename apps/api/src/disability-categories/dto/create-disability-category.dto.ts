import { IsString, IsOptional, IsBoolean, Length, IsIn } from 'class-validator';

export class CreateDisabilityCategoryDto {
  @IsString()
  @Length(2, 10)
  code: string;

  @IsString()
  @Length(2, 100)
  name: string;

  @IsString()
  description: string;

  @IsString()
  @IsIn(['RIFLE', 'PISTOL', 'BOTH'])
  event_type: 'RIFLE' | 'PISTOL' | 'BOTH';

  @IsOptional()
  @IsString()
  min_impairment?: string;

  @IsOptional()
  equipment_allowed?: any;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
