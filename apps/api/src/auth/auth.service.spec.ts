import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserRole } from './entities/user-role.entity';
import { Role } from './entities/role.entity';
import { UnauthorizedException } from '@nestjs/common';
import { User } from '../users/entities/user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: Partial<UsersService>;
  let jwtService: Partial<JwtService>;

  const mockUser: Partial<User> = {
    id: 1,
    email: 'test@example.com',
    first_name: 'Test',
    last_name: 'User',
    is_active: true,
    password_hash: 'hashedpassword',
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockAuthResponse = {
    access_token: 'mock_token',
    user: {
      id: 1,
      public_id: 'uuid',
      email: 'test@example.com',
      first_name: 'Test',
      last_name: 'User',
      roles: ['viewer'],
    },
  };

  beforeEach(async () => {
    // Mock repositories and services
    usersService = {
      validatePassword: jest.fn(),
      create: jest.fn(),
      updateLastLogin: jest.fn(),
    };

    jwtService = {
      sign: jest.fn().mockReturnValue('mock_token'),
      verify: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: usersService,
        },
        {
          provide: JwtService,
          useValue: jwtService,
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('1h'),
          },
        },
        {
          provide: getRepositoryToken(UserRole),
          useValue: {
            save: jest.fn(),
            createQueryBuilder: jest.fn().mockReturnValue({
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              getMany: jest
                .fn()
                .mockResolvedValue([{ role: { name: 'viewer' } }]),
            }),
          },
        },
        {
          provide: getRepositoryToken(Role),
          useValue: {
            findOne: jest.fn().mockResolvedValue({ id: 1, name: 'viewer' }),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should return auth response for valid credentials', async () => {
      (usersService.validatePassword as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.login({
        email: 'test@example.com',
        password: 'password',
      });

      expect(usersService.validatePassword).toHaveBeenCalledWith(
        'test@example.com',
        'password',
      );
      expect(result).toHaveProperty('access_token');
      expect(result.user.email).toBe('test@example.com');
      expect(result.user.roles).toContain('viewer');
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      (usersService.validatePassword as jest.Mock).mockResolvedValue(null);

      await expect(
        service.login({ email: 'test@example.com', password: 'wrong' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for inactive user', async () => {
      (usersService.validatePassword as jest.Mock).mockResolvedValue({
        ...mockUser,
        is_active: false,
      });

      await expect(
        service.login({ email: 'test@example.com', password: 'password' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('register', () => {
    it('should register a new user and return auth response', async () => {
      const registerDto = {
        email: 'new@example.com',
        password: 'password',
        first_name: 'New',
        last_name: 'User',
        phone: '1234567890',
      };

      (usersService.create as jest.Mock).mockResolvedValue({
        ...mockUser,
        ...registerDto,
      });

      const result = await service.register(registerDto);

      expect(usersService.create).toHaveBeenCalledWith(registerDto);
      expect(result).toHaveProperty('access_token');
      expect(result.user.email).toBe('new@example.com');
    });
  });
});
