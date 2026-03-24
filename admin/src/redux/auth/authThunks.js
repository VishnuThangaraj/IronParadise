import axios from "../../service/api";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Login
export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await axios.post("auth/user/login", {
        email,
        password,
      });

      return res.data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Login failed");
    }
  },
);

// Fetch logged-in user profile
export const fetchUser = createAsyncThunk(
  "auth/fetchUser",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;

      const res = await axios.get("auth/user/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data.user;
    } catch (err) {
      if (err.response?.status === 403 || err.response?.status === 404) {
        localStorage.removeItem("token");

        return rejectWithValue("Session expired");
      }
      return rejectWithValue(err.response?.data || "Unauthorized");
    }
  },
);
