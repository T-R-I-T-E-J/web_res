
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum DownloadCategory {
  RULES = 'rules',
  SELECTION = 'selection',
  CALENDAR = 'calendar',
  MATCH = 'match',
}

@Entity('downloads')
export class Download {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
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
    type: 'enum',
    enum: DownloadCategory,
    default: DownloadCategory.RULES,
  })
  category: DownloadCategory;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
