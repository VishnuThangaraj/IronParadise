import axios from "../../service/api";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Fetch all Membership
export const fetchAllMemberships = createAsyncThunk(
  "membership/fetchAllMemberships",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;

      const res = await axios.get("/membership/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to fetch Membership",
      );
    }
  },
);

// Fetch Membership Counter
export const fetchMembershipCounter = createAsyncThunk(
  "membership/fetchMembershipCounter",
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
        err.response?.data || "Failed to fetch Membership counter",
      );
    }
  },
);

// Add New Membership
export const addNewMembership = createAsyncThunk(
  "membership/addNewMembership",
  async ({ newMembership }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;

      const res = await axios.post(
        "/membership/create",
        { ...newMembership },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to Add New Membership",
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
