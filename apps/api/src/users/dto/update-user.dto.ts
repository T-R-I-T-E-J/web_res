import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsBoolean, IsOptional } from 'class-validator';

// First omit password, then make all fields optional
class BaseUpdateUserDto extends OmitType(CreateUserDto, [
  'password',
] as const) {}

export class UpdateUserDto extends PartialType(BaseUpdateUserDto) {
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
