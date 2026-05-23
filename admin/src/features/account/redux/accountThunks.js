import { createAsyncThunk } from "@reduxjs/toolkit";
import { updateProfile, updatePassword } from "./accountAPI";

const extractError = (err, defaultMessage) => {
  const detail = err.response?.data?.detail;
  if (Array.isArray(detail)) {
    return detail.map((d) => d.msg).join(", ");
  }
  return detail || err.response?.data?.message || defaultMessage;
};

// Update Profile Thunk
export const updateAdminProfile = createAsyncThunk(
  "account/updateAdminProfile",
  async (profileData, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await updateProfile(profileData, token);
      return response; // Expected payload: { message: "...", user: admin_data }
    } catch (error) {
      return rejectWithValue(extractError(error, "Failed to update profile"));
    }
  }
);

// Update Password Thunk
export const updateAdminPassword = createAsyncThunk(
  "account/updateAdminPassword",
  async (passwordData, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await updatePassword(passwordData, token);
      return response; // Expected payload: { message: "..." }
    } catch (error) {
      return rejectWithValue(extractError(error, "Failed to change password"));
    }
  }
);
