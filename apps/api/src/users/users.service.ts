import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { UsersRepository } from './repositories/users.repository.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { QueryUsersDto } from './dto/query-users.dto.js';
import { User } from './entities/user.entity.js';
import { hash, compare } from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly SALT_ROUNDS = 10;

  constructor(private readonly usersRepository: UsersRepository) {}

  /**
   * Create a new user
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if email already exists
    const emailExists = await this.usersRepository.emailExists(
      createUserDto.email,
    );
    if (emailExists) {
      throw new ConflictException('Email already registered');
    }

    // Hash password
    const passwordHash = await hash(createUserDto.password, this.SALT_ROUNDS);

    // Create user
    return this.usersRepository.create(createUserDto, passwordHash);
  }

  /**
   * Find all users with pagination
   */
  async findAll(queryDto: QueryUsersDto) {
    const { users, total } = await this.usersRepository.findAll(queryDto);
    const { page = 1, limit = 10 } = queryDto;

    return {
      data: users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Find user by ID
   */
  async findById(id: number): Promise<User> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  /**
   * Find user by public ID
   */
  async findByPublicId(publicId: string): Promise<User> {
    const user = await this.usersRepository.findByPublicId(publicId);
    if (!user) {
      throw new NotFoundException(`User with public ID ${publicId} not found`);
    }
    return user;
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findByEmail(email);
  }

  /**
   * Update user
   */
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    // Check if user exists
    await this.findById(id);

    // If email is being updated, check if new email is available
    if (updateUserDto.email) {
      const existingUser = await this.usersRepository.findByEmail(
        updateUserDto.email,
      );
      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('Email already in use');
      }
    }

    const updatedUser = await this.usersRepository.update(id, updateUserDto);
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return updatedUser;
  }

  /**
   * Soft delete user
   */
  async remove(id: number): Promise<void> {
    const user = await this.findById(id);
    const deleted = await this.usersRepository.softDelete(user.id);
    if (!deleted) {
      throw new BadRequestException('Failed to delete user');
    }
  }

  /**
   * Restore soft-deleted user
   */
  async restore(id: number): Promise<User> {
    const restored = await this.usersRepository.restore(id);
    if (!restored) {
      throw new NotFoundException(
        `User with ID ${id} not found or already active`,
      );
    }
    return this.findById(id);
  }

  /**
   * Update last login timestamp
   */
  async updateLastLogin(id: number): Promise<void> {
    await this.usersRepository.updateLastLogin(id);
  }

  /**
   * Verify user email
   */
  async verifyEmail(id: number): Promise<User> {
    await this.usersRepository.verifyEmail(id);
    return this.findById(id);
  }

  /**
   * Change user password
   */
  async changePassword(
    id: number,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.findById(id);

    // Verify current password
    const isPasswordValid = await compare(currentPassword, user.password_hash);
    if (!isPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    // Hash new password
    // Hash new password
    const newPasswordHash = await hash(newPassword, this.SALT_ROUNDS);

    // Update password
    await this.usersRepository.update(id, {
      password_hash: newPasswordHash,
    } as UpdateUserDto);
  }

  /**
   * Validate user password
   */
  async validatePassword(
    email: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.findByEmail(email);
    if (!user) {
      return null;
    }

    const isPasswordValid = await compare(password, user.password_hash);
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  /**
   * Get user statistics
   */
  async getStatistics() {
    const total = await this.usersRepository.count();
    const active = await this.usersRepository.count({ is_active: true });
    // Count verified users by querying directly
    const { users: allUsers } = await this.usersRepository.findAll({
      page: 1,
      limit: 10000, // Large enough to get all users for counting
    });
    const verified = allUsers.filter(
      (user) => user.email_verified_at !== null,
    ).length;

    return {
      total,
      active,
      inactive: total - active,
      verified,
      unverified: total - verified,
    };
  }
}
