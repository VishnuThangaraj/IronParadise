import { createAsyncThunk } from "@reduxjs/toolkit";
import { login, getProfile } from "../api/auth.api";
import { type LoginRequest, type LoginResponse } from "../types/login.types";
import { type ProfileResponse } from "../types/profile.types";
import { getErrorMessage } from "@/shared/utils/error-handler";

// login user
export const loginUser = createAsyncThunk<
  LoginResponse,
  LoginRequest,
  { rejectValue: string }
>(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await login(credentials);

      const tokens = response.data?.tokens;
      if (tokens?.accessToken) {
        localStorage.setItem("accessToken", tokens.accessToken);
      }
      if (tokens?.refreshToken) {
        localStorage.setItem("refreshToken", tokens.refreshToken);
      }

      return response;
    } catch (err: unknown) {
      return rejectWithValue(getErrorMessage(err, "Login failed"));
    }
  }
);

// fetch user profile
export const fetchUserProfile = createAsyncThunk<
  ProfileResponse,
  void,
  { rejectValue: string }
>(
  "auth/fetchUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getProfile();
      return response;
    } catch (err: unknown) {
      return rejectWithValue(getErrorMessage(err, "Failed to fetch profile"));
    }
  }
);

