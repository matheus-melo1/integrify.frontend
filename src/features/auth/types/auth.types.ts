export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  expires_at: string;
  refresh_expires_at: string;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export type RefreshTokenResponse = LoginResponse;

export interface UserResponse {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}
