import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

/**
 * Result Entity
 *
 * Stores metadata about uploaded competition results (PDFs)
 * The actual PDF files are stored in the file system or cloud storage
 */
@Entity('results')
export class Result {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Title of the result/competition
   * Example: "Complete Result of 6th NPSC 2025"
   */
  @Column({ type: 'varchar', length: 200 })
  title: string;

  /**
   * Year or date of the competition
   * Example: "2025"
   */
  @Column({ type: 'varchar', length: 50 })
  date: string;

  /**
   * Optional description
   */
  @Column({ type: 'text', nullable: true })
  description?: string;

  /**
   * Original filename as uploaded
   */
  @Column({ type: 'varchar', length: 255 })
  file_name: string;

  /**
   * Stored filename (UUID-based for uniqueness)
   */
  @Column({ type: 'varchar', length: 255, unique: true })
  stored_file_name: string;

  /**
   * File size in bytes
   */
  @Column({ type: 'bigint' })
  file_size: number;

  /**
   * MIME type (should be application/pdf)
   */
  @Column({ type: 'varchar', length: 100, default: 'application/pdf' })
  mime_type: string;

  /**
   * Public URL to access the PDF
   */
  @Column({ type: 'text' })
  url: string;

  /**
   * User who uploaded this result (admin)
   */
  @Column({ type: 'bigint' })
  uploaded_by: number;

  /**
   * Relation to user who uploaded
   */
  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'uploaded_by' })
  uploader: User;

  /**
   * Whether this result is published (visible to public)
   */
  @Column({ type: 'boolean', default: true })
  is_published: boolean;

  /**
   * Soft delete flag
   */
  @Column({ type: 'boolean', default: false })
  is_deleted: boolean;

  /**
   * Upload timestamp
   */
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  /**
   * Last update timestamp
   */
  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
