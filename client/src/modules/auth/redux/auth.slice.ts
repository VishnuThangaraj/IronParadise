import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { loginUser, fetchUserProfile } from "./auth.thunks";
import { type User } from "../types/user.types";
import { type LoginResponse } from "../types/login.types";
import { type ProfileResponse } from "../types/profile.types";

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: localStorage?.getItem("accessToken") || null,
  refreshToken: localStorage?.getItem("refreshToken") || null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<LoginResponse>) => {
          state.loading = false;
          const { user, tokens } = action.payload.data;
          state.user = user;
          state.accessToken = tokens?.accessToken || null;
          state.refreshToken = tokens?.refreshToken || null;
        },
      )
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      })
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchUserProfile.fulfilled,
        (state, action: PayloadAction<ProfileResponse>) => {
          state.loading = false;
          state.user = action.payload.data;
        },
      )
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch profile";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
