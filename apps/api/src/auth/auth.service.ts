import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { User } from '../users/entities/user.entity.js';
import {
  JwtPayload,
  AuthResponse,
} from './interfaces/jwt-payload.interface.js';
import { UserRole } from './entities/user-role.entity.js';
import { Role } from './entities/role.entity.js';
import type { StringValue } from 'ms';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) { }

  /**
   * Register a new user
   */
  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    // Create user
    const user = await this.usersService.create(registerDto);

    // Assign default 'viewer' role
    const viewerRole = await this.roleRepository.findOne({
      where: { name: 'viewer' },
    });

    if (viewerRole) {
      await this.userRoleRepository.save({
        user_id: user.id,
        role_id: viewerRole.id,
      });
    }

    // Get user roles
    const roles = await this.getUserRoles(user.id);

    // Generate tokens
    return this.generateAuthResponse(user, roles);
  }

  /**
   * Login user
   */
  async login(loginDto: LoginDto): Promise<AuthResponse> {
    // Validate credentials
    const user = await this.usersService.validatePassword(
      loginDto.email,
      loginDto.password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.is_active) {
      throw new UnauthorizedException('Account is inactive');
    }

    // Update last login
    await this.usersService.updateLastLogin(user.id);

    // Get user roles
    const roles = await this.getUserRoles(user.id);

    // Generate tokens
    return this.generateAuthResponse(user, roles);
  }

  /**
   * Get user roles
   */
  async getUserRoles(userId: number): Promise<string[]> {
    const userRoles = await this.userRoleRepository.find({
      where: { user_id: userId },
      relations: ['role'],
    });

    return userRoles.map((ur) => ur.role.name);
  }

  /**
   * Assign role to user
   */
  async assignRole(
    userId: number,
    roleName: string,
    assignedBy?: number,
  ): Promise<void> {
    const role = await this.roleRepository.findOne({
      where: { name: roleName },
    });

    if (!role) {
      throw new ConflictException(`Role '${roleName}' not found`);
    }

    // Check if user already has this role
    const existing = await this.userRoleRepository.findOne({
      where: { user_id: userId, role_id: role.id },
    });

    if (existing) {
      throw new ConflictException('User already has this role');
    }

    await this.userRoleRepository.save({
      user_id: userId,
      role_id: role.id,
      assigned_by: assignedBy,
    });
  }

  /**
   * Remove role from user
   */
  async removeRole(userId: number, roleName: string): Promise<void> {
    const role = await this.roleRepository.findOne({
      where: { name: roleName },
    });

    if (!role) {
      throw new ConflictException(`Role '${roleName}' not found`);
    }

    await this.userRoleRepository.delete({
      user_id: userId,
      role_id: role.id,
    });
  }

  /**
   * Generate auth response with tokens
   */
  private generateAuthResponse(user: User, roles: string[]): AuthResponse {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      roles,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: (this.configService.get<string>('config.jwt.expiresIn') ||
        '1h') as StringValue,
    });

    return {
      access_token: accessToken,
      user: {
        id: user.id,
        public_id: user.public_id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        roles,
      },
    };
  }

  /**
   * Validate JWT token
   */
  async validateToken(token: string): Promise<JwtPayload> {
    try {
      return this.jwtService.verify(token);
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
