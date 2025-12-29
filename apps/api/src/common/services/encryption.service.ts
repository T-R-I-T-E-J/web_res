import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as CryptoJS from 'crypto-js';
import * as crypto from 'crypto';

@Injectable()
export class EncryptionService {
  private readonly encryptionKey: string;
  private readonly algorithm = 'aes-256-gcm';

  constructor(private configService: ConfigService) {
    this.encryptionKey = this.configService.get<string>('ENCRYPTION_KEY') || '';
    if (!this.encryptionKey) {
      throw new Error(
        'ENCRYPTION_KEY must be set in environment variables for data encryption',
      );
    }
  }

  /**
   * Encrypt sensitive data using AES-256-GCM
   * @param data - Plain text data to encrypt
   * @returns Encrypted string with IV and auth tag
   */
  encrypt(data: string): string | null {
    if (!data) return null;

    try {
      // Use CryptoJS for simplicity
      const encrypted = CryptoJS.AES.encrypt(data, this.encryptionKey);
      return encrypted.toString();
    } catch (error: any) {
      throw new Error(`Encryption failed: ${error.message}`);
    }
  }

  /**
   * Decrypt encrypted data
   * @param encryptedData - Encrypted string
   * @returns Decrypted plain text
   */
  decrypt(encryptedData: string): string | null {
    if (!encryptedData) return null;

    try {
      const decrypted = CryptoJS.AES.decrypt(encryptedData, this.encryptionKey);
      return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (error: any) {
      throw new Error(`Decryption failed: ${error.message}`);
    }
  }

  /**
   * Hash data (one-way, cannot be decrypted)
   * Use for data that needs to be compared but never revealed
   * @param data - Data to hash
   * @returns Hashed string (SHA-256)
   */
  hash(data: string): string | null {
    if (!data) return null;
    return CryptoJS.SHA256(data).toString();
  }

  /**
   * Verify hashed data
   * @param data - Plain text data
   * @param hashedData - Hashed data to compare
   * @returns True if match
   */
  verifyHash(data: string, hashedData: string): boolean {
    if (!data || !hashedData) return false;
    return this.hash(data) === hashedData;
  }

  /**
   * Generate random encryption key
   * Use this to generate ENCRYPTION_KEY for .env file
   * @param length - Key length in bytes (default: 32 for AES-256)
   * @returns Random hex key
   */
  static generateKey(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * Encrypt object (converts to JSON first)
   * @param obj - Object to encrypt
   * @returns Encrypted string
   */
  encryptObject(obj: any): string | null {
    if (!obj) return null;
    const jsonString = JSON.stringify(obj);
    return this.encrypt(jsonString);
  }

  /**
   * Decrypt object (parses JSON after decryption)
   * @param encryptedData - Encrypted string
   * @returns Decrypted object
   */
  decryptObject<T>(encryptedData: string): T | null {
    if (!encryptedData) return null;
    const jsonString = this.decrypt(encryptedData);
    if (!jsonString) return null;
    return JSON.parse(jsonString) as T;
  }

  /**
   * Mask sensitive data for display (e.g., email, phone)
   * @param data - Data to mask
   * @param visibleChars - Number of characters to show at start/end
   * @returns Masked string
   */
  mask(data: string, visibleChars: number = 3): string {
    if (!data || data.length <= visibleChars * 2) return data;

    const start = data.substring(0, visibleChars);
    const end = data.substring(data.length - visibleChars);
    const masked = '*'.repeat(data.length - visibleChars * 2);

    return `${start}${masked}${end}`;
  }

  /**
   * Mask email address (show first 3 chars and domain)
   * @param email - Email to mask
   * @returns Masked email (e.g., abc***@example.com)
   */
  maskEmail(email: string): string {
    if (!email || !email.includes('@')) return email;

    const [localPart, domain] = email.split('@');
    const maskedLocal =
      localPart.length > 3 ? `${localPart.substring(0, 3)}***` : localPart;

    return `${maskedLocal}@${domain}`;
  }

  /**
   * Mask phone number (show last 4 digits)
   * @param phone - Phone number to mask
   * @returns Masked phone (e.g., ******1234)
   */
  maskPhone(phone: string): string {
    if (!phone || phone.length < 4) return phone;

    const lastFour = phone.substring(phone.length - 4);
    const masked = '*'.repeat(phone.length - 4);

    return `${masked}${lastFour}`;
  }

  /**
   * Mask Aadhaar number (show last 4 digits)
   * @param aadhaar - Aadhaar number to mask
   * @returns Masked Aadhaar (e.g., ********1234)
   */
  maskAadhaar(aadhaar: string): string {
    if (!aadhaar || aadhaar.length < 4) return aadhaar;

    const lastFour = aadhaar.substring(aadhaar.length - 4);
    const masked = '*'.repeat(aadhaar.length - 4);

    return `${masked}${lastFour}`;
  }
}
