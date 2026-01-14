import { Test, TestingModule } from '@nestjs/testing';
import { ResultsService } from './results.service';
import { StorageService } from './storage.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Result } from '../entities/result.entity';
import { BadRequestException } from '@nestjs/common';
import { UploadResultDto } from '../dto/upload-result.dto';

describe('ResultsService', () => {
  let service: ResultsService;
  let storageService: Partial<StorageService>;
  let repository: any;

  const mockFile = {
    fieldname: 'file',
    originalname: 'test.pdf',
    encoding: '7bit',
    mimetype: 'application/pdf',
    buffer: Buffer.from('test'),
    size: 1024,
  } as Express.Multer.File;

  const mockStorageResult = {
    fileName: 'test.pdf',
    storedFileName: '123-test.pdf',
    fileSize: 1024,
    url: 'http://localhost/test.pdf',
    path: '/uploads/123-test.pdf',
  };

  const mockResult = {
    id: 'uuid-123',
    title: 'Test Result',
    date: '2025',
    file_name: 'test.pdf',
    created_at: new Date(),
    uploaded_by: 1,
    file_size: 1024,
  };

  beforeEach(async () => {
    storageService = {
      uploadFile: jest.fn().mockResolvedValue(mockStorageResult),
    };

    repository = {
      create: jest.fn().mockReturnValue(mockResult),
      save: jest.fn().mockResolvedValue(mockResult),
      find: jest.fn().mockResolvedValue([mockResult]),
      findOne: jest.fn().mockResolvedValue(mockResult),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResultsService,
        {
          provide: StorageService,
          useValue: storageService,
        },
        {
          provide: getRepositoryToken(Result),
          useValue: repository,
        },
      ],
    }).compile();

    service = module.get<ResultsService>(ResultsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('uploadResult', () => {
    it('should upload a file and save result', async () => {
      const dto: UploadResultDto = {
        title: 'Test Result',
        date: '2025',
        description: 'Test Description',
      };

      const result = await service.uploadResult(mockFile, dto, 1);

      expect(storageService.uploadFile).toHaveBeenCalledWith(mockFile);
      expect(repository.create).toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalled();
      expect(result.fileName).toEqual('test.pdf');
    });

    it('should throw BadRequestException if file is not PDF', async () => {
      const invalidFile = {
        ...mockFile,
        mimetype: 'image/jpeg',
        originalname: 'test.jpg',
      } as Express.Multer.File;
      const dto: UploadResultDto = { title: 'Test', date: '2025' };

      await expect(service.uploadResult(invalidFile, dto, 1)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if file is too large', async () => {
      const largeFile = {
        ...mockFile,
        size: 100 * 1024 * 1024,
      } as Express.Multer.File; // 100MB
      const dto: UploadResultDto = { title: 'Test', date: '2025' };

      await expect(service.uploadResult(largeFile, dto, 1)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
