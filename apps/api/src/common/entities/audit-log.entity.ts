import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

export enum AuditAction {
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  REGISTER = 'REGISTER',
  PASSWORD_CHANGE = 'PASSWORD_CHANGE',
  ROLE_ASSIGN = 'ROLE_ASSIGN',
  ROLE_REMOVE = 'ROLE_REMOVE',
  PERMISSION_GRANT = 'PERMISSION_GRANT',
  PERMISSION_REVOKE = 'PERMISSION_REVOKE',
}

@Entity('audit_logs')
@Index(['user_id', 'created_at'])
@Index(['action', 'created_at'])
@Index(['table_name', 'record_id'])
export class AuditLog {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ type: 'bigint', nullable: true })
  user_id?: number;

  @Column({ type: 'varchar', length: 50 })
  action: AuditAction | string;

  @Column({ type: 'varchar', length: 100 })
  table_name: string;

  @Column({ type: 'bigint', nullable: true })
  record_id?: number;

  @Column({ type: 'jsonb', nullable: true })
  old_values?: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  new_values?: Record<string, any>;

  @Column({ type: 'varchar', length: 45, nullable: true })
  ip_address?: string;

  @Column({ type: 'text', nullable: true })
  user_agent?: string;

  @Column({ type: 'uuid', nullable: true })
  request_id?: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}
