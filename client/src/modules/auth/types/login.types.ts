import { type User } from "./user.types";

export interface LoginRequest {
  userId?: string;
  password?: string;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponseData {
  tokens: Tokens;
  user: User;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: LoginResponseData;
}
