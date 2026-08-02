import api from "@/shared/service/api";
import {
  type LoginRequest,
  type LoginResponse,
} from "@/modules/auth/types/login.types";
import { type ProfileResponse } from "@/modules/auth/types/profile.types";

export const login = async ({
  userId,
  password,
}: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>("/api/auth/login", {
    userId,
    password,
  });

  return response.data;
};

// Profile
export const getProfile = async (): Promise<ProfileResponse> => {
  const response = await api.get<ProfileResponse>("/api/auth/profile");
  return response.data;
};
