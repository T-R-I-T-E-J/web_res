import { PartialType } from '@nestjs/mapped-types';
import { CreateShooterProfileDto } from './create-shooter-profile.dto.js';

export class UpdateShooterProfileDto extends PartialType(
  CreateShooterProfileDto,
) {}
