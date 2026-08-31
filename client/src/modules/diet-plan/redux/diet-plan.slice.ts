import { createSlice, isPending, type PayloadAction } from "@reduxjs/toolkit";

import type {
  DietPlan,
  DietPlanResponse,
  SingleDietPlanResponse,
} from "../types/diet-plan.types";
import {
  createDietPlan,
  fetchDietPlans,
  updateDietPlan,
  deleteDietPlan,
  fetchDietPlanById,
  deleteDietPlanPermanently,
} from "./diet-plan.thunks";

export interface DietPlanState {
  plans: DietPlan[];
  currentPlan: DietPlan | null;
  loading: boolean;
  error: string | null;
}

const initialState: DietPlanState = {
  plans: [],
  currentPlan: null,
  loading: false,
  error: null,
};

const dietPlanSlice = createSlice({
  name: "dietPlan",
  initialState,
  reducers: {
    setCurrentPlan: (state, action: PayloadAction<DietPlan | null>) => {
      state.currentPlan = action.payload;
    },
    clearDietPlanError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch all plans
      .addCase(
        fetchDietPlans.fulfilled,
        (state, action: PayloadAction<DietPlanResponse>) => {
          state.loading = false;
          state.plans = action.payload.data;
        },
      )
      .addCase(fetchDietPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch diet plans";
      })

      // fetch plan by id
      .addCase(
        fetchDietPlanById.fulfilled,
        (state, action: PayloadAction<SingleDietPlanResponse>) => {
          state.loading = false;
          state.currentPlan = action.payload.data;
        },
      )
      .addCase(fetchDietPlanById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch diet plan";
      })

      // create plan
      .addCase(
        createDietPlan.fulfilled,
        (state, action: PayloadAction<SingleDietPlanResponse>) => {
          state.loading = false;
          state.plans.unshift(action.payload.data);
        },
      )
      .addCase(createDietPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create diet plan";
      })

      // update plan
      .addCase(
        updateDietPlan.fulfilled,
        (state, action: PayloadAction<SingleDietPlanResponse>) => {
          state.loading = false;

          const updatedPlan = action.payload.data;
          state.plans = state.plans.map((plan) =>
            plan._id === updatedPlan._id ||
            plan.dietPlanId === updatedPlan.dietPlanId
              ? updatedPlan
              : plan,
          );
          if (
            state.currentPlan &&
            (state.currentPlan._id === updatedPlan._id ||
              state.currentPlan.dietPlanId === updatedPlan.dietPlanId)
          ) {
            state.currentPlan = updatedPlan;
          }
        },
      )
      .addCase(updateDietPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update diet plan";
      })

      // delete diet plan (soft delete)
      .addCase(
        deleteDietPlan.fulfilled,
        (state, action: PayloadAction<SingleDietPlanResponse>) => {
          state.loading = false;
          const deletedPlan = action.payload.data;
          state.plans = state.plans.map((plan) =>
            plan._id === deletedPlan._id ||
            plan.dietPlanId === deletedPlan.dietPlanId
              ? deletedPlan
              : plan,
          );
          if (
            state.currentPlan &&
            (state.currentPlan._id === deletedPlan._id ||
              state.currentPlan.dietPlanId === deletedPlan.dietPlanId)
          ) {
            state.currentPlan = deletedPlan;
          }
        },
      )
      .addCase(deleteDietPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete diet plan";
      })

      // permanently delete diet plan
      .addCase(
        deleteDietPlanPermanently.fulfilled,
        (state, action: PayloadAction<SingleDietPlanResponse>) => {
          state.loading = false;
          const deletedPlan = action.payload.data;
          state.plans = state.plans.filter(
            (plan) =>
              plan._id !== deletedPlan._id &&
              plan.dietPlanId !== deletedPlan.dietPlanId,
          );
          if (
            state.currentPlan &&
            (state.currentPlan._id === deletedPlan._id ||
              state.currentPlan.dietPlanId === deletedPlan.dietPlanId)
          ) {
            state.currentPlan = null;
          }
        },
      )
      .addCase(deleteDietPlanPermanently.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Failed to permanently delete diet plan";
      })

      // common matcher for all pending thunk states
      .addMatcher(
        isPending(
          fetchDietPlans,
          fetchDietPlanById,
          createDietPlan,
          updateDietPlan,
          deleteDietPlan,
          deleteDietPlanPermanently,
        ),
        (state) => {
          state.loading = true;
          state.error = null;
        },
      );
  },
});

export const { setCurrentPlan, clearDietPlanError } = dietPlanSlice.actions;
export default dietPlanSlice.reducer;
