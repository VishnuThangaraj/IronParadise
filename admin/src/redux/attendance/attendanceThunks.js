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
