import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, IsNull, Not } from 'typeorm';
import { User } from '../entities/user.entity.js';
import { CreateUserDto } from '../dto/create-user.dto.js';
import { UpdateUserDto } from '../dto/update-user.dto.js';
import { QueryUsersDto } from '../dto/query-users.dto.js';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Create a new user
   */
  async create(
    createUserDto: CreateUserDto,
    passwordHash: string,
  ): Promise<User> {
    const user = this.userRepository.create({
      ...createUserDto,
      password_hash: passwordHash,
    });
    return this.userRepository.save(user);
  }

  /**
   * Find all users with pagination and filtering
   */
  async findAll(
    queryDto: QueryUsersDto,
  ): Promise<{ users: User[]; total: number }> {
    const {
      page = 1,
      limit = 10,
      sortBy,
      sortOrder,
      email,
      is_active,
      email_verified,
    } = queryDto;

    const where: FindOptionsWhere<User> = {};

    if (email) {
      where.email = email;
    }

    if (is_active !== undefined) {
      where.is_active = is_active;
    }

    if (email_verified !== undefined) {
      where.email_verified_at = email_verified ? Not(IsNull()) : IsNull();
    }

    // Exclude soft-deleted users
    where.deleted_at = IsNull();

    const [users, total] = await this.userRepository.findAndCount({
      where,
      order: sortBy ? { [sortBy]: sortOrder } : { created_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { users, total };
  }

  /**
   * Find user by ID
   */
  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id, deleted_at: IsNull() },
    });
  }

  /**
   * Find user by public ID (UUID)
   */
  async findByPublicId(publicId: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { public_id: publicId, deleted_at: IsNull() },
    });
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email, deleted_at: IsNull() },
    });
  }

  /**
   * Update user
   */
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User | null> {
    await this.userRepository.update(id, updateUserDto);
    return this.findById(id);
  }

  /**
   * Soft delete user
   */
  async softDelete(id: number): Promise<boolean> {
    const result = await this.userRepository.softDelete(id);
    return (result.affected ?? 0) > 0;
  }

  /**
   * Restore soft-deleted user
   */
  async restore(id: number): Promise<boolean> {
    const result = await this.userRepository.restore(id);
    return (result.affected ?? 0) > 0;
  }

  /**
   * Hard delete user (permanent)
   */
  async hardDelete(id: number): Promise<boolean> {
    const result = await this.userRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  /**
   * Update last login timestamp
   */
  async updateLastLogin(id: number): Promise<void> {
    await this.userRepository.update(id, {
      last_login_at: new Date(),
    });
  }

  /**
   * Mark email as verified
   */
  async verifyEmail(id: number): Promise<void> {
    await this.userRepository.update(id, {
      email_verified_at: new Date(),
    });
  }

  /**
   * Check if email exists
   */
  async emailExists(email: string): Promise<boolean> {
    const count = await this.userRepository.count({
      where: { email, deleted_at: IsNull() },
    });
    return count > 0;
  }

  /**
   * Get user count
   */
  async count(filters?: Partial<User>): Promise<number> {
    return this.userRepository.count({
      where: { ...filters, deleted_at: IsNull() },
    });
  }
}
