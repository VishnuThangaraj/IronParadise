import axios from "../../service/api";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Fetch all Attendances
export const fetchAllAttendances = createAsyncThunk(
  "attendance/fetchAllAttendances",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;

      const res = await axios.get("/attendance/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch Customers");
    }
  },
);

// Add new Attendance
export const addNewAttendance = createAsyncThunk(
  "/attendance/addNewAttendance",
  async ({ newAttendance }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;

      const res = await axios.post(
        "/attendance/create",
        { ...newAttendance },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to Mark Attendance");
    }
  },
);

// Fetch Monthly Attendance
export const fetchMonthlyAttendance = createAsyncThunk(
  "/attendance/fetchMonthlyAttendance",
  async ({ date }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;

      const res = await axios.post(
        "/attendance/monthly",
        { date },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return res.data.attendances;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to Fetch Monthly Attendance",
      );
    }
  },
);

// Fetch Daily Attendance with Date
export const fetchDailyAttendance = createAsyncThunk(
  "/attendance/fetchDailyAttendance",
  async ({ date }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;

      const res = await axios.post(
        "/attendance/daily",
        { date },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return res.data.attendances;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to Fetch Daily Attendance",
      );
    }
  },
);
