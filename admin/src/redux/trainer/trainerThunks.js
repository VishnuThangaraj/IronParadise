import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../service/api";

// Fetch all trainers
export const fetchAllTrainers = createAsyncThunk(
  "trainer/fetchAllTrainers",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;

      const res = await axios.get("/trainer/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch trainers");
    }
  }
);
