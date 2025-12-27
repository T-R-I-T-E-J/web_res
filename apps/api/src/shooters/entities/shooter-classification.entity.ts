import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Shooter } from './shooter.entity.js';
import { DisabilityCategory } from '../../disability-categories/entities/disability-category.entity.js';

@Entity('shooter_classifications')
export class ShooterClassification {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @ManyToOne(() => Shooter)
  @JoinColumn({ name: 'shooter_id' })
  shooter: Shooter;

  @Column({ name: 'shooter_id' })
  shooter_id: number;

  @ManyToOne(() => DisabilityCategory)
  @JoinColumn({ name: 'disability_category_id' })
  disability_category: DisabilityCategory;

  @Column({ name: 'disability_category_id' })
  disability_category_id: number;

  @Column({ type: 'varchar', length: 20 })
  classification_status: 'NEW' | 'REVIEW' | 'CONFIRMED' | 'FIXED';

  @Column({ type: 'date' })
  classification_date: Date;

  @Column({ type: 'date', nullable: true })
  valid_until: Date | null;

  @Column({ type: 'varchar', length: 200, nullable: true })
  classifier_name: string | null;

  @Column({ type: 'varchar', length: 200, nullable: true })
  classification_venue: string | null;

  @Column({ type: 'text', nullable: true })
  medical_documents_url: string | null;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @Column({ type: 'boolean', default: true })
  is_current: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
