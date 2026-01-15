import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Category } from '../../categories/entities/category.entity';

export enum DownloadCategory {
  RULES = 'rules',
  SELECTION = 'selection',
  CALENDAR = 'calendar',
  CLASSIFICATION = 'classification', // Keeping for backward compat if needed
  MEDICAL_CLASSIFICATION = 'medical_classification',
  IPC_LICENSE = 'ipc_license',
  NATIONAL_CLASSIFICATION = 'national_classification',
  MATCH = 'match',
}

@Entity('downloads')
export class Download {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, default: 'Untitled Document' })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'file_type' })
  fileType: string;

  @Column({ nullable: true })
  size: string;

  @Column()
  href: string;

  @Column({
    default: 'rules',
  })
  category: string;

  @Column({ name: 'category_id', nullable: true })
  categoryId: string | null;

  @ManyToOne(() => Category, { nullable: true })
  @JoinColumn({ name: 'category_id' })
  categoryRel: Category;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
