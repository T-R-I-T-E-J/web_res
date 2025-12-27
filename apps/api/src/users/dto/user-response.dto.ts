import { Exclude, Expose } from 'class-transformer';

export class UserResponseDto {
  @Expose()
  id: number;

  @Expose()
  public_id: string;

  @Expose()
  email: string;

  @Exclude()
  password_hash: string;

  @Expose()
  first_name: string;

  @Expose()
  last_name: string;

  @Expose()
  phone?: string;

  @Expose()
  avatar_url?: string;

  @Expose()
  email_verified_at?: Date;

  @Expose()
  is_active: boolean;

  @Expose()
  last_login_at?: Date;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;

  // Virtual properties
  @Expose()
  get fullName(): string {
    return `${this.first_name} ${this.last_name}`;
  }

  @Expose()
  get isEmailVerified(): boolean {
    return !!this.email_verified_at;
  }
}
