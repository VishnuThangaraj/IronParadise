import axios from "../../service/api";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Fetch all Workout Plans
export const fetchAllWorkoutPlans = createAsyncThunk(
  "workoutplan/fetchAllWorkoutPlans",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;

      const res = await axios.get("/workoutplan/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to fetch Workout plan"
      );
    }
  }
);

// Fetch Workout Plan Counter
export const fetchWorkoutPlanCounter = createAsyncThunk(
  "workoutplan/fetchWorkoutPlanCounter",
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
        err.response?.data || "Failed to fetch Workout Plan counter"
      );
    }
  }
);

// Add New Workout Plan
export const addNewWorkoutPlan = createAsyncThunk(
  "workoutplan/addNewWorkoutPlan",
  async ({ newWorkoutPlan }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;

      const res = await axios.post(
        "/workoutplan/create",
        { ...newWorkoutPlan },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to Add New Workout Plan"
      );
    }
  }
);
