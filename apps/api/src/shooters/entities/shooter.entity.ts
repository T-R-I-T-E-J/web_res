import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity.js';
import { StateAssociation } from '../../states/entities/state-association.entity.js';

@Entity('shooters')
export class Shooter {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  user_id: number;

  @Column({ type: 'varchar', length: 20, unique: true })
  shooter_id: string;

  @Column({ type: 'varchar', length: 20, unique: true, nullable: true })
  issf_id: string | null;

  @Column({ type: 'date' })
  date_of_birth: Date;

  @Column({ type: 'varchar', length: 10 })
  gender: 'male' | 'female' | 'other';

  @Column({ type: 'varchar', length: 100, default: 'Indian' })
  nationality: string;

  @ManyToOne(() => StateAssociation)
  @JoinColumn({ name: 'state_association_id' })
  state_association: StateAssociation;

  @Column({ name: 'state_association_id', nullable: true })
  state_association_id: number | null;

  @Column({ type: 'varchar', length: 5, nullable: true })
  blood_group: string | null;

  @Column({ type: 'varchar', length: 200, nullable: true })
  emergency_contact_name: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  emergency_contact_phone: string | null;

  @Column({ type: 'varchar', length: 200, nullable: true })
  coach_name: string | null;

  @Column({ type: 'varchar', length: 200, nullable: true })
  club_name: string | null;

  @Column({ type: 'text', nullable: true })
  bio: string | null;

  @Column({ type: 'jsonb', default: [] })
  achievements: any[];

  @Column({ type: 'boolean', default: false })
  profile_complete: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  verified_at: Date | null;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'verified_by' })
  verified_by_user: User;

  @Column({ name: 'verified_by', nullable: true })
  verified_by: number | null;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
