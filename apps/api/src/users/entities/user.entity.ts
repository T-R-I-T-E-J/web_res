import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Generated,
  OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ type: 'uuid', unique: true })
  @Generated('uuid')
  public_id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  // Encrypted email (Phase-2 Security)
  // TODO: Migrate data from 'email' to 'encrypted_email' and remove 'email' column
  @Column({ type: 'text', nullable: true, name: 'encrypted_email' })
  @Exclude()
  encryptedEmail?: string;

  @Column({ type: 'varchar', length: 255 })
  @Exclude() // Exclude from JSON responses
  password_hash: string;

  @Column({ type: 'varchar', length: 100 })
  first_name: string;

  @Column({ type: 'varchar', length: 100 })
  last_name: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone?: string;

  // Encrypted phone (Phase-2 Security)
  // TODO: Migrate data from 'phone' to 'encrypted_phone' and remove 'phone' column
  @Column({ type: 'text', nullable: true, name: 'encrypted_phone' })
  @Exclude()
  encryptedPhone?: string;

  @Column({ type: 'text', nullable: true })
  avatar_url?: string;

  @Column({ type: 'timestamptz', nullable: true })
  email_verified_at?: Date;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  last_login_at?: Date;

  // 2FA fields (Phase-2B Security)
  @Column({ type: 'text', nullable: true, name: 'two_factor_secret' })
  @Exclude()
  twoFactorSecret?: string; // Encrypted TOTP secret

  @Column({ type: 'boolean', default: false, name: 'two_factor_enabled' })
  twoFactorEnabled: boolean;

  @Column({ type: 'jsonb', nullable: true, name: 'two_factor_backup_codes' })
  @Exclude()
  twoFactorBackupCodes?: string[]; // Hashed backup codes

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deleted_at?: Date;

  // Virtual property - full name
  get fullName(): string {
    return `${this.first_name} ${this.last_name}`;
  }

  // Virtual property - is email verified
  get isEmailVerified(): boolean {
    return !!this.email_verified_at;
  }

  /**
   * Get decrypted email
   * Note: Requires EncryptionService to be injected
   */
  getDecryptedEmail(encryptionService: any): string {
    if (this.encryptedEmail) {
      const decrypted = encryptionService.decrypt(this.encryptedEmail);
      if (decrypted) return decrypted;
    }
    return this.email; // Fallback to plain email during migration
  }

  /**
   * Get decrypted phone
   * Note: Requires EncryptionService to be injected
   */
  getDecryptedPhone(encryptionService: any): string | undefined {
    if (this.encryptedPhone) {
      const decrypted = encryptionService.decrypt(this.encryptedPhone);
      if (decrypted) return decrypted;
    }
    return this.phone; // Fallback to plain phone during migration
  }

  /**
   * Get masked email for display
   * Note: Requires EncryptionService to be injected
   */
  getMaskedEmail(encryptionService: any): string {
    const email = this.getDecryptedEmail(encryptionService);
    return encryptionService.maskEmail(email);
  }

  /**
   * Get masked phone for display
   * Note: Requires EncryptionService to be injected
   */
  getMaskedPhone(encryptionService: any): string {
    const phone = this.getDecryptedPhone(encryptionService);
    return encryptionService.maskPhone(phone);
  }
}
