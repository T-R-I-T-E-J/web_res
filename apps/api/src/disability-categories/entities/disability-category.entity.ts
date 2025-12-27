import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export type EventType = 'RIFLE' | 'PISTOL' | 'BOTH';

@Entity('disability_categories')
export class DisabilityCategory {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 10, unique: true })
  code: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 20 })
  event_type: EventType;

  @Column({ type: 'text', nullable: true })
  min_impairment: string | null;

  @Column({ type: 'jsonb', nullable: true })
  equipment_allowed: any;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}
