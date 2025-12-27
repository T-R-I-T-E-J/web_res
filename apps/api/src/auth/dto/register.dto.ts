import { CreateUserDto } from '../../users/dto/create-user.dto.js';

export class RegisterDto extends CreateUserDto {
  // Inherits all validation from CreateUserDto
  // Can add additional registration-specific fields here if needed
}
