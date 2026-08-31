import { createAsyncThunk } from "@reduxjs/toolkit";
import { getErrorMessage } from "@/shared/utils/error-handler";

import {
  getDietPlans,
  getDietPlanById,
  createDietPlan as createDietPlanApi,
  updateDietPlan as updateDietPlanApi,
  deleteDietPlan as deleteDietPlanApi,
  deleteDietPlanPermanently as deleteDietPlanPermanentlyApi,
} from "@/modules/diet-plan/api/diet-plan.api";

import type {
  DietPlanFormData,
  DietPlanResponse,
  SingleDietPlanResponse,
  UpdateDietPlanRequest,
} from "../types/diet-plan.types";

// fetch all diet plans
export const fetchDietPlans = createAsyncThunk<
  DietPlanResponse,
  void,
  { rejectValue: string }
>("diet-plan/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await getDietPlans();
    return response;
  } catch (err: unknown) {
    return rejectWithValue(getErrorMessage(err, "Failed to fetch diet plans"));
  }
});

// fetch diet plans by id
export const fetchDietPlanById = createAsyncThunk<
  SingleDietPlanResponse,
  string,
  { rejectValue: string }
>("diet-plan/fetchById", async (dietPlanId, { rejectWithValue }) => {
  try {
    const response = await getDietPlanById(dietPlanId);
    return response;
  } catch (err: unknown) {
    return rejectWithValue(getErrorMessage(err, "Failed to fetch diet plan"));
  }
});

// create diet plan
export const createDietPlan = createAsyncThunk<
  SingleDietPlanResponse,
  DietPlanFormData,
  {
    rejectValue: string;
  }
>("diet-plan/create", async (planData, { rejectWithValue }) => {
  try {
    const response = await createDietPlanApi(planData);
    return response;
  } catch (err: unknown) {
    return rejectWithValue(getErrorMessage(err, "Failed to create diet plan"));
  }
});

// update diet plan
export const updateDietPlan = createAsyncThunk<
  SingleDietPlanResponse,
  { dietPlanId: string; planData: UpdateDietPlanRequest },
  { rejectValue: string }
>("diet-plan/update", async ({ dietPlanId, planData }, { rejectWithValue }) => {
  try {
    const response = await updateDietPlanApi(dietPlanId, planData);

    return response;
  } catch (err: unknown) {
    return rejectWithValue(getErrorMessage(err, "Failed to update diet plan"));
  }
});

// delete diet plan (soft delete)
export const deleteDietPlan = createAsyncThunk<
  SingleDietPlanResponse,
  string,
  { rejectValue: string }
>("diet-plan/delete", async (dietPlanId, { rejectWithValue }) => {
  try {
    const response = await deleteDietPlanApi(dietPlanId);
    return response;
  } catch (err: unknown) {
    return rejectWithValue(getErrorMessage(err, "Failed to delete diet plan"));
  }
});

// delete diet plan permanently (hard delete)
export const deleteDietPlanPermanently = createAsyncThunk<
  SingleDietPlanResponse,
  string,
  { rejectValue: string }
>("diet-plan/deletePermanently", async (dietPlanId, { rejectWithValue }) => {
  try {
    const response = await deleteDietPlanPermanentlyApi(dietPlanId);
    return response;
  } catch (err: unknown) {
    return rejectWithValue(
      getErrorMessage(err, "Failed to permanently delete diet plan"),
    );
  }
});
