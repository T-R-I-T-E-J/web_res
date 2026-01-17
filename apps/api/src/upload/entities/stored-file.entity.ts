import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('stored_files')
export class StoredFile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  filename: string;

  @Column()
  originalName: string;

  @Column()
  mimetype: string;

  @Column('bytea') // For Postgres binary data
  data: Buffer;

  @Column({ default: 0 })
  size: number;

  @CreateDateColumn()
  created_at: Date;
}
