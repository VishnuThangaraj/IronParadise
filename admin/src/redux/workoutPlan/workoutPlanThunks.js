import axios from "../../service/api";
import {createAsyncThunk} from "@reduxjs/toolkit";

// Fetch all Workout Plans
export const fetchAllWorkoutPlans = createAsyncThunk(
    "workoutplan/fetchAllWorkoutPlans",
    async (_, {getState, rejectWithValue}) => {
        try {
            const token = getState()?.auth?.token;

            const res = await axios.get("/workoutplan/", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            return res.data.workoutPlans || [];
        } catch (err) {
            return rejectWithValue(
                err.response?.data || "Failed to fetch Workout plan",
            );
        }
    },
);

// Add New Workout Plan
export const addNewWorkoutPlan = createAsyncThunk(
    "workoutplan/addNewWorkoutPlan",
    async ({newWorkoutPlan}, {getState, rejectWithValue}) => {
        try {
            const token = getState()?.auth?.token;

            const res = await axios.post(
                "/workoutplan/create",
                {...newWorkoutPlan},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            return res.data.workoutPlan || {};
        } catch (err) {
            return rejectWithValue(
                err.response?.data || "Failed to Add New Workout Plan",
            );
        }
    },
);

// Fetch Workout plan by ID
export const fetchWorkoutPlanById = createAsyncThunk(
    "workoutplan/fetchWorkoutPlanById",
    async (workoutPlanId, {getState, rejectWithValue}) => {
        try {
            const token = getState()?.auth?.token;

            const res = await axios.get(`/workoutplan/details/${workoutPlanId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            return res.data.workoutPlan || {};
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
    async ({workoutPlanId, updatedData}, {getState, rejectWithValue}) => {
        try {
            const token = getState()?.auth?.token;

            const res = await axios.put(
                `/workoutplan/update/${workoutPlanId}`,
                {updatedData},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            return res.data.workoutPlan || {};
        } catch (err) {
            return rejectWithValue(
                err.response?.data || "Failed to Update WorkoutPlan",
            );
        }
    },
);

// Delete Workout Plan by ID
export const deleteWorkoutPlanById = createAsyncThunk(
    "workoutplan/deleteWorkoutPlanById",
    async ({workoutPlanId}, {getState, rejectWithValue}) => {
        try {
            const token = getState()?.auth?.token;

            const res = await axios.delete(`/workoutplan/delete/${workoutPlanId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return res.data.workoutPlanId;
        } catch (err) {
            return rejectWithValue(
                err.response?.data || "Failed to Delete Workout Plan",
            );
        }
    },
);
