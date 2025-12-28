import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('sessions')
@Index(['userId', 'isActive'])
@Index(['token'])
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'bigint', name: 'user_id' })
  userId: number;

  @Column({ type: 'text' })
  token: string; // Hashed JWT token

  @Column({ type: 'varchar', length: 45, name: 'ip_address' })
  ipAddress: string;

  @Column({ type: 'text', name: 'user_agent' })
  userAgent: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  device?: string; // e.g., "Chrome on Windows", "Safari on iPhone"

  @Column({ type: 'varchar', length: 100, nullable: true })
  location?: string; // e.g., "Mumbai, India"

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @Column({ type: 'timestamptz', name: 'expires_at' })
  expiresAt: Date;

  @Column({ type: 'timestamptz', nullable: true, name: 'last_activity_at' })
  lastActivityAt?: Date;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;

  // Virtual property - is session expired
  get isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  // Virtual property - is session valid
  get isValid(): boolean {
    return this.isActive && !this.isExpired;
  }
}
