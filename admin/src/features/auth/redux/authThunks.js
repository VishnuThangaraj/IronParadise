import { createAsyncThunk } from "@reduxjs/toolkit";
import { adminLogin, fetchCurrentAdmin } from "@/features/auth/redux/authAPI";

const extractError = (err, defaultMessage) => {
  const detail = err.response?.data?.detail;
  if (Array.isArray(detail)) {
    return detail.map((d) => d.msg).join(", ");
  }
  return detail || err.response?.data?.message || defaultMessage;
};

// Login
export const loginAdmin = createAsyncThunk(
  "auth/loginAdmin",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await adminLogin({ email, password });

      if (response.token) {
        localStorage.setItem("token", response.token);
      }

      return response;
    } catch (error) {
      return rejectWithValue(extractError(error, "Login failed"));
    }
  },
);

// Fetch logged-in admin profile
export const fetchAdmin = createAsyncThunk(
  "auth/fetchAdmin",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      if (!token) return rejectWithValue("No token found");

      const { data } = await fetchCurrentAdmin({ token });

      return data.user;
    } catch (err) {
      const status = err.response?.status;
      if (status === 401 || status === 403 || status === 404) {
        localStorage.removeItem("token");
        return rejectWithValue("Session expired. Please log in again.");
      }

      return rejectWithValue(extractError(err, "Failed to fetch user"));
    }
  },
);
