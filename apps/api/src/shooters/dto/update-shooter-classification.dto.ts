import { PartialType } from '@nestjs/mapped-types';
import { CreateShooterClassificationDto } from './create-shooter-classification.dto.js';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateShooterClassificationDto extends PartialType(
  CreateShooterClassificationDto,
) {
  @IsOptional()
  @IsBoolean()
  is_current?: boolean;
}
