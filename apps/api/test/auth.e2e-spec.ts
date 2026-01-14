import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { UsersService } from './../src/users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserRole } from './../src/auth/entities/user-role.entity';
import { Role } from './../src/auth/entities/role.entity';
import { JwtAuthGuard } from './../src/auth/guards/jwt-auth.guard';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let usersService: Partial<UsersService>;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    password_hash: 'hashed',
    first_name: 'Test',
    last_name: 'User',
    is_active: true,
  };

  const mockRole = {
    id: 1,
    name: 'viewer',
  };

  beforeEach(async () => {
    usersService = {
      create: jest.fn().mockResolvedValue(mockUser),
      validatePassword: jest.fn().mockResolvedValue(mockUser),
      updateLastLogin: jest.fn().mockResolvedValue(undefined),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(UsersService)
      .useValue(usersService)
      .overrideProvider(getRepositoryToken(UserRole))
      .useValue({
        save: jest.fn().mockResolvedValue({}),
        findOne: jest.fn().mockResolvedValue(null),
        createQueryBuilder: jest.fn().mockReturnValue({
          leftJoinAndSelect: jest.fn().mockReturnThis(),
          where: jest.fn().mockReturnThis(),
          getMany: jest.fn().mockResolvedValue([{ role: mockRole }]),
        }),
      })
      .overrideProvider(getRepositoryToken(Role))
      .useValue({
        findOne: jest.fn().mockResolvedValue(mockRole),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/auth/register (POST) - Success', () => {
    return request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({
        email: 'test@example.com',
        password: 'Password123!',
        first_name: 'Test',
        last_name: 'User',
        phone: '1234567890',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.message).toEqual('Registration successful');
        expect(res.body.user.email).toEqual('test@example.com');
        expect(res.header['set-cookie']).toBeDefined();
      });
  });

  it('/auth/login (POST) - Success', () => {
    return request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email: 'test@example.com',
        password: 'Password123!',
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.message).toEqual('Login successful');
        expect(res.body.user.email).toEqual('test@example.com');
        expect(res.header['set-cookie']).toBeDefined();
      });
  });

  it('/auth/login (POST) - Failure', () => {
    usersService.validatePassword = jest.fn().mockResolvedValue(null);

    return request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email: 'test@example.com',
        password: 'WrongPassword',
      })
      .expect(401);
  });
});
