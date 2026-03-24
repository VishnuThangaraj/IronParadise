import axios from "../../service/api";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Fetch all Trainers
export const fetchAllTrainers = createAsyncThunk(
  "trainer/fetchAllTrainers",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState()?.auth?.token;

      const res = await axios.get("/trainer", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data.trainers || [];
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch trainers");
    }
  },
);

// Add New Trainer
export const addNewTrainer = createAsyncThunk(
  "trainer/addNewTrainer",
  async ({ newTrainer }, { getState, rejectWithValue }) => {
    try {
      const token = getState()?.auth?.token;

      const res = await axios.post(
        "/auth/user/register",
        { ...newTrainer },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return res.data.trainer || {};
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to add new Trainer");
    }
  },
);

// Fetch Trainer by ID
export const fetchTrainerById = createAsyncThunk(
  "trainer/fetchTrainerById",
  async (trainerId, { getState, rejectWithValue }) => {
    try {
      const token = getState()?.auth?.token;

      const res = await axios.get(`/user/profile/${trainerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data.user || {};
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to fetch Trainer with ID",
      );
    }
  },
);

// Fetch Trainer by UserID
export const fetchTrainerByUserId = createAsyncThunk(
  "trainer/fetchTrainerByUserId",
  async ({ trainerId }, { getState, rejectWithValue }) => {
    try {
      const token = getState()?.auth?.token;

      const res = await axios.get(`/user/profile/id/${trainerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data.user || {};
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to fetch Trainer with UserID",
      );
    }
  },
);

// Update Trainer by ID
export const updateTrainerById = createAsyncThunk(
  "trainer/updateTrainerById",
  async ({ trainerId, updatedData }, { getState, rejectWithValue }) => {
    try {
      const token = getState()?.auth?.token;

      const res = await axios.put(
        `/user/update/${trainerId}`,
        { updatedData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return res.data.user || {};
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to update Trainer");
    }
  },
);

// Delete trainer by Id
export const deleteTrainerById = createAsyncThunk(
  "trainer/deleteTrainerById",
  async ({ trainerId }, { getState, rejectWithValue }) => {
    try {
      const token = getState()?.auth?.token;

      const res = await axios.delete(`/user/delete/${trainerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data.trainerId;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to delete Trainer");
    }
  },
);
