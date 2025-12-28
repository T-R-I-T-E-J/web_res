import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { EncryptionService } from '../src/common/services/encryption.service';

describe('EncryptionService', () => {
  let service: EncryptionService;
  let configService: ConfigService;

  beforeEach(async () => {
    // Mock ConfigService
    const mockConfigService = {
      get: jest.fn((key: string) => {
        if (key === 'ENCRYPTION_KEY') {
          return 'test-encryption-key-for-testing-purposes-only-32-chars';
        }
        return null;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EncryptionService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<EncryptionService>(EncryptionService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('encrypt and decrypt', () => {
    it('should encrypt and decrypt a string correctly', () => {
      const plainText = 'test@example.com';
      const encrypted = service.encrypt(plainText);
      const decrypted = service.decrypt(encrypted);

      expect(encrypted).not.toBe(plainText);
      expect(decrypted).toBe(plainText);
    });

    it('should return null for null input', () => {
      expect(service.encrypt(null)).toBeNull();
      expect(service.decrypt(null)).toBeNull();
    });

    it('should encrypt different values differently', () => {
      const text1 = 'email1@example.com';
      const text2 = 'email2@example.com';

      const encrypted1 = service.encrypt(text1);
      const encrypted2 = service.encrypt(text2);

      expect(encrypted1).not.toBe(encrypted2);
    });
  });

  describe('hash and verifyHash', () => {
    it('should hash a string', () => {
      const plainText = 'sensitive-data';
      const hashed = service.hash(plainText);

      expect(hashed).toBeDefined();
      expect(hashed).not.toBe(plainText);
      expect(hashed.length).toBeGreaterThan(0);
    });

    it('should verify hashed data correctly', () => {
      const plainText = 'test-data';
      const hashed = service.hash(plainText);

      expect(service.verifyHash(plainText, hashed)).toBe(true);
      expect(service.verifyHash('wrong-data', hashed)).toBe(false);
    });

    it('should return null for null input', () => {
      expect(service.hash(null)).toBeNull();
    });
  });

  describe('encryptObject and decryptObject', () => {
    it('should encrypt and decrypt an object', () => {
      const obj = {
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
      };

      const encrypted = service.encryptObject(obj);
      const decrypted = service.decryptObject(encrypted);

      expect(encrypted).not.toBe(JSON.stringify(obj));
      expect(decrypted).toEqual(obj);
    });

    it('should return null for null input', () => {
      expect(service.encryptObject(null)).toBeNull();
      expect(service.decryptObject(null)).toBeNull();
    });
  });

  describe('mask', () => {
    it('should mask a string correctly', () => {
      const text = 'sensitive-data';
      const masked = service.mask(text, 3);

      expect(masked).toBe('sen********ata');
    });

    it('should return original string if too short', () => {
      const text = 'short';
      const masked = service.mask(text, 3);

      expect(masked).toBe(text);
    });
  });

  describe('maskEmail', () => {
    it('should mask email correctly', () => {
      const email = 'user@example.com';
      const masked = service.maskEmail(email);

      expect(masked).toBe('use***@example.com');
    });

    it('should handle short email local parts', () => {
      const email = 'ab@example.com';
      const masked = service.maskEmail(email);

      expect(masked).toBe('ab@example.com');
    });

    it('should return original if not an email', () => {
      const notEmail = 'not-an-email';
      const masked = service.maskEmail(notEmail);

      expect(masked).toBe(notEmail);
    });
  });

  describe('maskPhone', () => {
    it('should mask phone number correctly', () => {
      const phone = '1234567890';
      const masked = service.maskPhone(phone);

      expect(masked).toBe('******7890');
    });

    it('should return original if too short', () => {
      const phone = '123';
      const masked = service.maskPhone(phone);

      expect(masked).toBe(phone);
    });
  });

  describe('maskAadhaar', () => {
    it('should mask Aadhaar number correctly', () => {
      const aadhaar = '123456789012';
      const masked = service.maskAadhaar(aadhaar);

      expect(masked).toBe('********9012');
    });

    it('should return original if too short', () => {
      const aadhaar = '123';
      const masked = service.maskAadhaar(aadhaar);

      expect(masked).toBe(aadhaar);
    });
  });

  describe('generateKey', () => {
    it('should generate a key of correct length', () => {
      const key = EncryptionService.generateKey(32);

      expect(key).toBeDefined();
      expect(key.length).toBe(64); // 32 bytes = 64 hex characters
    });

    it('should generate different keys each time', () => {
      const key1 = EncryptionService.generateKey();
      const key2 = EncryptionService.generateKey();

      expect(key1).not.toBe(key2);
    });
  });
});
