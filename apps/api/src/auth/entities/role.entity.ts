import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

export interface RolePermissions {
  // User permissions
  'users:read'?: boolean;
  'users:create'?: boolean;
  'users:update'?: boolean;
  'users:delete'?: boolean;

  // Role permissions
  'roles:read'?: boolean;
  'roles:create'?: boolean;
  'roles:update'?: boolean;
  'roles:delete'?: boolean;
  'roles:assign'?: boolean;

  // Shooter permissions
  'shooters:read'?: boolean;
  'shooters:create'?: boolean;
  'shooters:update'?: boolean;
  'shooters:delete'?: boolean;

  // Competition permissions
  'competitions:read'?: boolean;
  'competitions:create'?: boolean;
  'competitions:update'?: boolean;
  'competitions:delete'?: boolean;

  // Score permissions
  'scores:read'?: boolean;
  'scores:create'?: boolean;
  'scores:update'?: boolean;
  'scores:delete'?: boolean;

  // Audit permissions
  'audit:read'?: boolean;

  // System permissions
  'system:admin'?: boolean;

  // Custom permissions
  [key: string]: boolean | undefined;
}

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 100 })
  display_name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'jsonb', default: {} })
  permissions: RolePermissions;

  @Column({ type: 'boolean', default: false })
  is_system: boolean;

  // Role Hierarchy
  @Column({ type: 'bigint', nullable: true })
  parent_id?: number;

  @Column({ type: 'int', default: 0 })
  level: number; // 0 = highest (admin), higher numbers = lower privilege

  @ManyToOne(() => Role, { nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent?: Role;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}
