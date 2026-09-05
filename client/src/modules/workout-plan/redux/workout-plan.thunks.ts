import { createAsyncThunk } from "@reduxjs/toolkit";
import { getErrorMessage } from "@/shared/utils/error-handler";

import {
  getWorkoutPlans,
  getWorkoutPlanById,
  createWorkoutPlan as createWorkoutPlanApi,
  updateWorkoutPlan as updateWorkoutPlanApi,
  deleteWorkoutPlan as deleteWorkoutPlanApi,
  deleteWorkoutPlanPermanently as deleteWorkoutPlanPermanentlyApi,
} from "@/modules/workout-plan/api/workout-plan.api";

import type {
  WorkoutPlanFormData,
  WorkoutPlanResponse,
  SingleWorkoutPlanResponse,
  UpdateWorkoutPlanRequest,
} from "../types/workout-plan.types";

// fetch all workout plans
export const fetchWorkoutPlans = createAsyncThunk<
  WorkoutPlanResponse,
  void,
  { rejectValue: string }
>("workout-plan/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await getWorkoutPlans();
    return response;
  } catch (err: unknown) {
    return rejectWithValue(
      getErrorMessage(err, "Failed to fetch workout plans"),
    );
  }
});

// fetch workout plans by id
export const fetchWorkoutPlanById = createAsyncThunk<
  SingleWorkoutPlanResponse,
  string,
  { rejectValue: string }
>("workout-plan/fetchById", async (workoutPlanId, { rejectWithValue }) => {
  try {
    const response = await getWorkoutPlanById(workoutPlanId);
    return response;
  } catch (err: unknown) {
    return rejectWithValue(
      getErrorMessage(err, "Failed to fetch workout plan"),
    );
  }
});

// create workout plan
export const createWorkoutPlan = createAsyncThunk<
  SingleWorkoutPlanResponse,
  WorkoutPlanFormData,
  {
    rejectValue: string;
  }
>("workout-plan/create", async (planData, { rejectWithValue }) => {
  try {
    const response = await createWorkoutPlanApi(planData);
    return response;
  } catch (err: unknown) {
    return rejectWithValue(
      getErrorMessage(err, "Failed to create workout plan"),
    );
  }
});

// update workout plan
export const updateWorkoutPlan = createAsyncThunk<
  SingleWorkoutPlanResponse,
  { workoutPlanId: string; planData: UpdateWorkoutPlanRequest },
  { rejectValue: string }
>(
  "workout-plan/update",
  async ({ workoutPlanId, planData }, { rejectWithValue }) => {
    try {
      const response = await updateWorkoutPlanApi(workoutPlanId, planData);

      return response;
    } catch (err: unknown) {
      return rejectWithValue(
        getErrorMessage(err, "Failed to update workout plan"),
      );
    }
  },
);

// delete workout plan (soft delete)
export const deleteWorkoutPlan = createAsyncThunk<
  SingleWorkoutPlanResponse,
  string,
  { rejectValue: string }
>("workout-plan/delete", async (workoutPlanId, { rejectWithValue }) => {
  try {
    const response = await deleteWorkoutPlanApi(workoutPlanId);
    return response;
  } catch (err: unknown) {
    return rejectWithValue(
      getErrorMessage(err, "Failed to delete workout plan"),
    );
  }
});

// delete workout plan permanently (hard delete)
export const deleteWorkoutPlanPermanently = createAsyncThunk<
  SingleWorkoutPlanResponse,
  string,
  { rejectValue: string }
>(
  "workout-plan/deletePermanently",
  async (workoutPlanId, { rejectWithValue }) => {
    try {
      const response = await deleteWorkoutPlanPermanentlyApi(workoutPlanId);
      return response;
    } catch (err: unknown) {
      return rejectWithValue(
        getErrorMessage(err, "Failed to permanently delete workout plan"),
      );
    }
  },
);
