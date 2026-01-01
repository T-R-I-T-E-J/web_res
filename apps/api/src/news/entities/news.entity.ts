import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Generated,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum NewsCategory {
  NEWS = 'NEWS',
  ANNOUNCEMENT = 'ANNOUNCEMENT',
  RESULT = 'RESULT',
  ACHIEVEMENT = 'ACHIEVEMENT',
  EVENT = 'EVENT',
  PRESS_RELEASE = 'PRESS_RELEASE',
}

export enum NewsStatus {
  DRAFT = 'draft',
  PENDING_REVIEW = 'pending_review',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

@Entity('news_articles')
export class NewsArticle {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ type: 'uuid', unique: true })
  @Generated('uuid')
  public_id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  excerpt?: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'text', nullable: true })
  featured_image_url?: string;

  @Column({ type: 'text', nullable: true })
  preview_image_url?: string;

  @Column({ type: 'jsonb', default: [] })
  image_urls: string[];

  @Column({
    type: 'varchar',
    length: 50,
  })
  category: NewsCategory;

  @Column({ type: 'jsonb', default: [] })
  tags: string[];

  @Column({ type: 'bigint' })
  author_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'author_id' })
  author: User;

  @Column({
    type: 'varchar',
    length: 20,
    default: NewsStatus.DRAFT,
  })
  status: NewsStatus;

  @Column({ type: 'boolean', default: false })
  is_featured: boolean;

  @Column({ type: 'boolean', default: false })
  is_pinned: boolean;

  @Column({ type: 'integer', default: 0 })
  view_count: number;

  @Column({ type: 'timestamptz', nullable: true })
  published_at?: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deleted_at?: Date;
}
