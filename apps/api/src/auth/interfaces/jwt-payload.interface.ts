export interface JwtPayload {
  sub: number; // User ID
  email: string;
  roles: string[]; // Role names
  iat?: number; // Issued at
  exp?: number; // Expiration
}

export interface AuthResponse {
  access_token: string;
  refresh_token?: string;
  user: {
    id: number;
    public_id: string;
    email: string;
    first_name: string;
    last_name: string;
    roles: string[];
  };
}
