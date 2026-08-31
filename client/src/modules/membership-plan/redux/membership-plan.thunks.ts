import { createAsyncThunk } from "@reduxjs/toolkit";
import { getErrorMessage } from "@/shared/utils/error-handler";

import {
  getMembershipPlans,
  getMembershipPlanById,
  createMembershipPlan as createMembershipPlanApi,
  updateMembershipPlan as updateMembershipPlanApi,
  deleteMembershipPlan as deleteMembershipPlanApi,
  deleteMembershipPlanPermanently as deleteMembershipPlanPermanentlyApi,
} from "@/modules/membership-plan/api/membership-plan.api";
import {
  type MembershipPlanFormData,
  type MembershipPlanResponse,
  type SingleMembershipPlanResponse,
  type UpdateMembershipPlanRequest,
} from "../types/membership-plan.types";

// fetch all membership plans
export const fetchMembershipPlans = createAsyncThunk<
  MembershipPlanResponse,
  void,
  { rejectValue: string }
>("membership-plan/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await getMembershipPlans();
    return response;
  } catch (err: unknown) {
    return rejectWithValue(
      getErrorMessage(err, "Failed to fetch membership plans"),
    );
  }
});

// fetch membership plan by id
export const fetchMembershipPlanById = createAsyncThunk<
  SingleMembershipPlanResponse,
  string,
  { rejectValue: string }
>(
  "membership-plan/fetchById",
  async (membershipPlanId, { rejectWithValue }) => {
    try {
      const response = await getMembershipPlanById(membershipPlanId);
      return response;
    } catch (err: unknown) {
      return rejectWithValue(
        getErrorMessage(err, "Failed to fetch membership plan"),
      );
    }
  },
);

// create membership plan
export const createMembershipPlan = createAsyncThunk<
  SingleMembershipPlanResponse,
  MembershipPlanFormData,
  { rejectValue: string }
>("membership-plan/create", async (planData, { rejectWithValue }) => {
  try {
    const response = await createMembershipPlanApi(planData);
    return response;
  } catch (err: unknown) {
    return rejectWithValue(
      getErrorMessage(err, "Failed to create membership plan"),
    );
  }
});

// update membership plan
export const updateMembershipPlan = createAsyncThunk<
  SingleMembershipPlanResponse,
  { membershipPlanId: string; planData: UpdateMembershipPlanRequest },
  { rejectValue: string }
>(
  "membership-plan/update",
  async ({ membershipPlanId, planData }, { rejectWithValue }) => {
    try {
      const response = await updateMembershipPlanApi(
        membershipPlanId,
        planData,
      );
      return response;
    } catch (err: unknown) {
      return rejectWithValue(
        getErrorMessage(err, "Failed to update membership plan"),
      );
    }
  },
);

// delete membership plan (soft delete)
export const deleteMembershipPlan = createAsyncThunk<
  SingleMembershipPlanResponse,
  string,
  { rejectValue: string }
>("membership-plan/delete", async (membershipPlanId, { rejectWithValue }) => {
  try {
    const response = await deleteMembershipPlanApi(membershipPlanId);
    return response;
  } catch (err: unknown) {
    return rejectWithValue(
      getErrorMessage(err, "Failed to delete membership plan"),
    );
  }
});

// delete membership plan permanently (hard delete)
export const deleteMembershipPlanPermanently = createAsyncThunk<
  SingleMembershipPlanResponse,
  string,
  { rejectValue: string }
>(
  "membership-plan/deletePermanently",
  async (membershipPlanId, { rejectWithValue }) => {
    try {
      const response =
        await deleteMembershipPlanPermanentlyApi(membershipPlanId);
      return response;
    } catch (err: unknown) {
      return rejectWithValue(
        getErrorMessage(err, "Failed to permanently delete membership plan"),
      );
    }
  },
);
