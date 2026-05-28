import { api } from "@/shared/lib/axios";
import type { ApiResponse } from "@/shared/types/api.types";
import type {
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  UserResponse,
} from "../types/auth.types";

interface IAuthService {
  login(body: LoginRequest): Promise<LoginResponse>;
  refresh(body: RefreshTokenRequest): Promise<RefreshTokenResponse>;
  getUser(id: string): Promise<UserResponse>;
}

class AuthService implements IAuthService {
  login(body: LoginRequest) {
    return api
      .post<ApiResponse<LoginResponse>>("/api/auth/sign", body)
      .then((r) => r.data.data);
  }

  refresh(body: RefreshTokenRequest) {
    return api
      .post<ApiResponse<RefreshTokenResponse>>("/api/auth/refresh", body)
      .then((r) => r.data.data);
  }

  getUser(id: string) {
    return api
      .get<UserResponse>(`/api/users/${id}`)
      .then((r) => r.data);
  }
}

export const authService = new AuthService();
