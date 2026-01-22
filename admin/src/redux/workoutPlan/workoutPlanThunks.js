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
        err.response?.data || "Failed to fetch Workout plan",
      );
    }
  },
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
        },
      );

      return res.data.seq || 0;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to fetch Workout Plan counter",
      );
    }
  },
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
        },
      );

      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to Add New Workout Plan",
      );
    }
  },
);

// Fetch Workout plan by Id
export const fetchWorkoutPlanById = createAsyncThunk(
  "workoutplan/fetchWorkoutPlanById",
  async (workoutPlanId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;

      const res = await axios.get(`/workoutplan/details/${workoutPlanId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data.workoutPlan;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to Fetch Workout Plan",
      );
    }
  },
);

// Update Workout Plan by ID
export const updateWorkoutPlanById = createAsyncThunk(
  "workoutplan/updateWorkoutPlanById",
  async ({ workoutPlanId, updatedData }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;

      const res = await axios.put(
        `/workoutplan/update/${workoutPlanId}`,
        { updatedData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return res.data.workoutPlan;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to Update WorkoutPlan",
      );
    }
  },
);

// Delete Workout Plan by Id
export const deleteWorkoutPlanById = createAsyncThunk(
  "workoutplan/deleteWorkoutPlanById",
  async ({ workoutPlanId }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;

      const res = await axios.delete(`/workoutplan/delete/${workoutPlanId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data.workoutPlanId;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to UpdatDelete Workout Plan",
      );
    }
  },
);
