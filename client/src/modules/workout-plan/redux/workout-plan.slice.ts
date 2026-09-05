import { createSlice, isPending, type PayloadAction } from "@reduxjs/toolkit";

import type {
  WorkoutPlan,
  WorkoutPlanResponse,
  SingleWorkoutPlanResponse,
} from "../types/workout-plan.types";
import {
  createWorkoutPlan,
  fetchWorkoutPlans,
  updateWorkoutPlan,
  deleteWorkoutPlan,
  fetchWorkoutPlanById,
  deleteWorkoutPlanPermanently,
} from "./workout-plan.thunks";

export interface WorkoutPlanState {
  plans: WorkoutPlan[];
  currentPlan: WorkoutPlan | null;
  loading: boolean;
  error: string | null;
}

const initialState: WorkoutPlanState = {
  plans: [],
  currentPlan: null,
  loading: false,
  error: null,
};

const workoutPlanSlice = createSlice({
  name: "workoutPlan",
  initialState,
  reducers: {
    setCurrentPlan: (state, action: PayloadAction<WorkoutPlan | null>) => {
      state.currentPlan = action.payload;
    },
    clearWorkoutPlanError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch all plans
      .addCase(
        fetchWorkoutPlans.fulfilled,
        (state, action: PayloadAction<WorkoutPlanResponse>) => {
          state.loading = false;
          state.plans = action.payload.data;
        },
      )
      .addCase(fetchWorkoutPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch workout plans";
      })

      // fetch plan by id
      .addCase(
        fetchWorkoutPlanById.fulfilled,
        (state, action: PayloadAction<SingleWorkoutPlanResponse>) => {
          state.loading = false;
          state.currentPlan = action.payload.data;
        },
      )
      .addCase(fetchWorkoutPlanById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch workout plan";
      })

      // create plan
      .addCase(
        createWorkoutPlan.fulfilled,
        (state, action: PayloadAction<SingleWorkoutPlanResponse>) => {
          state.loading = false;
          state.plans.unshift(action.payload.data);
        },
      )
      .addCase(createWorkoutPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create workout plan";
      })

      // update plan
      .addCase(
        updateWorkoutPlan.fulfilled,
        (state, action: PayloadAction<SingleWorkoutPlanResponse>) => {
          state.loading = false;

          const updatedPlan = action.payload.data;
          state.plans = state.plans.map((plan) =>
            plan._id === updatedPlan._id ||
            plan.workoutPlanId === updatedPlan.workoutPlanId
              ? updatedPlan
              : plan,
          );
          if (
            state.currentPlan &&
            (state.currentPlan._id === updatedPlan._id ||
              state.currentPlan.workoutPlanId === updatedPlan.workoutPlanId)
          ) {
            state.currentPlan = updatedPlan;
          }
        },
      )
      .addCase(updateWorkoutPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update workout plan";
      })

      // delete workout plan (soft delete)
      .addCase(
        deleteWorkoutPlan.fulfilled,
        (state, action: PayloadAction<SingleWorkoutPlanResponse>) => {
          state.loading = false;
          const deletedPlan = action.payload.data;
          state.plans = state.plans.map((plan) =>
            plan._id === deletedPlan._id ||
            plan.workoutPlanId === deletedPlan.workoutPlanId
              ? deletedPlan
              : plan,
          );
          if (
            state.currentPlan &&
            (state.currentPlan._id === deletedPlan._id ||
              state.currentPlan.workoutPlanId === deletedPlan.workoutPlanId)
          ) {
            state.currentPlan = deletedPlan;
          }
        },
      )
      .addCase(deleteWorkoutPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete workout plan";
      })

      // permanently delete workout plan
      .addCase(
        deleteWorkoutPlanPermanently.fulfilled,
        (state, action: PayloadAction<SingleWorkoutPlanResponse>) => {
          state.loading = false;
          const deletedPlan = action.payload.data;
          state.plans = state.plans.filter(
            (plan) =>
              plan._id !== deletedPlan._id &&
              plan.workoutPlanId !== deletedPlan.workoutPlanId,
          );
          if (
            state.currentPlan &&
            (state.currentPlan._id === deletedPlan._id ||
              state.currentPlan.workoutPlanId === deletedPlan.workoutPlanId)
          ) {
            state.currentPlan = null;
          }
        },
      )
      .addCase(deleteWorkoutPlanPermanently.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Failed to permanently delete workout plan";
      })

      // common matcher for all pending thunk states
      .addMatcher(
        isPending(
          fetchWorkoutPlans,
          fetchWorkoutPlanById,
          createWorkoutPlan,
          updateWorkoutPlan,
          deleteWorkoutPlan,
          deleteWorkoutPlanPermanently,
        ),
        (state) => {
          state.loading = true;
          state.error = null;
        },
      );
  },
});

export const { setCurrentPlan, clearWorkoutPlanError } =
  workoutPlanSlice.actions;
export default workoutPlanSlice.reducer;
