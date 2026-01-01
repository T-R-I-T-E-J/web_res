/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { getConnectionToken } from '@nestjs/typeorm';
import { HealthService } from './health.service';
import { HealthController } from './health.controller';

describe('HealthService', () => {
  let service: HealthService;
  let connection: { query: jest.Mock };

  beforeEach(async () => {
    connection = { query: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthService,
        {
          provide: getConnectionToken(),
          useValue: connection,
        },
      ],
    }).compile();

    service = module.get<HealthService>(HealthService);
  });

  it('should return ok status with expected metadata from check()', () => {
    const result = service.check();
    expect(result).toEqual(
      expect.objectContaining({
        status: 'ok',
        service: expect.any(String),
        version: expect.any(String),
        environment: expect.any(String),
        timestamp: expect.any(String),
      }),
    );
    // timestamp is an ISO string
    expect(new Date(result.timestamp).toISOString()).toBe(result.timestamp);
  });

  it('should reflect NODE_ENV in the environment field from check()', () => {
    const original = process.env.NODE_ENV;
    process.env.NODE_ENV = 'test-env';

    const result = service.check();

    expect(result.environment).toBe('test-env');

    // restore
    process.env.NODE_ENV = original;
  });

  it('should report database connected when query succeeds', async () => {
    connection.query.mockResolvedValueOnce([{ '?column?': 1 }]);

    const result = await service.checkDatabase();

    expect(connection.query).toHaveBeenCalledWith('SELECT 1');
    expect(result).toEqual(
      expect.objectContaining({
        status: 'ok',
        database: 'connected',
        timestamp: expect.any(String),
      }),
    );
  });

  it('should report database disconnected and include error message when query fails', async () => {
    const error = new Error('boom');
    connection.query.mockRejectedValueOnce(error);

    const result = await service.checkDatabase();

    expect(connection.query).toHaveBeenCalledWith('SELECT 1');
    expect(result).toEqual(
      expect.objectContaining({
        status: 'error',
        database: 'disconnected',
        error: 'boom',
        timestamp: expect.any(String),
      }),
    );
  });

  it('should execute the correct health check SQL', async () => {
    connection.query.mockResolvedValueOnce([]);

    await service.checkDatabase();

    expect(connection.query).toHaveBeenCalledTimes(1);
    expect(connection.query).toHaveBeenCalledWith('SELECT 1');
  });
});

describe('HealthController', () => {
  let controller: HealthController;
  let service: { check: jest.Mock; checkDatabase: jest.Mock };

  beforeEach(async () => {
    service = {
      check: jest.fn(),
      checkDatabase: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HealthService,
          useValue: service,
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('should delegate check() to HealthService.check', () => {
    const payload = { status: 'ok' };
    service.check.mockReturnValueOnce(payload);

    expect(controller.check()).toEqual(payload);
    expect(service.check).toHaveBeenCalledTimes(1);
  });

  it('should delegate checkDatabase() to HealthService.checkDatabase', async () => {
    const payload = { status: 'ok', database: 'connected' };
    service.checkDatabase.mockResolvedValueOnce(payload);

    await expect(controller.checkDatabase()).resolves.toEqual(payload);
    expect(service.checkDatabase).toHaveBeenCalledTimes(1);
  });
});
