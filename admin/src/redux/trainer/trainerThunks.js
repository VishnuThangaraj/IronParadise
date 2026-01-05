import axios from "../../service/api";
import { createAsyncThunk } from "@reduxjs/toolkit";

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

// Fetch Trainer Counter
export const fetchTrainerCounter = createAsyncThunk(
  "trainer/fetchTrainerCounter",
  async ({ role }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;

      const res = await axios.post(
        "/counter",
        { role },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.data.seq || 0;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to fetch trainer counter"
      );
    }
  }
);

// Add New Trainer
export const addNewTrainer = createAsyncThunk(
  "trainer/addNewTrainer",
  async ({ newTrainer }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;

      const res = await axios.post(
        "/auth/user/register",
        { ...newTrainer },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to Add New Trainer");
    }
  }
);
