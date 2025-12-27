import { PartialType } from '@nestjs/mapped-types';
import { CreateDisabilityCategoryDto } from './create-disability-category.dto.js';

export class UpdateDisabilityCategoryDto extends PartialType(
  CreateDisabilityCategoryDto,
) {}
