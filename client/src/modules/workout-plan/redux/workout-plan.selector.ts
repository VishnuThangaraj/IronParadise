import { type RootState } from "@/app/store";
import { createSelector } from "@reduxjs/toolkit";

export const selectWorkoutPlanState = (state: RootState) => state.workoutPlan;

export const selectWorkoutPlans = createSelector(
  selectWorkoutPlanState,
  (workoutPlan) => workoutPlan?.plans ?? [],
);

export const selectCurrentWorkoutPlan = createSelector(
  selectWorkoutPlanState,
  (workoutPlan) => workoutPlan?.currentPlan ?? null,
);

export const selectWorkoutPlanLoading = createSelector(
  selectWorkoutPlanState,
  (workoutPlan) => workoutPlan?.loading ?? false,
);

export const selectWorkoutPlanError = createSelector(
  selectWorkoutPlanState,
  (workoutPlan) => workoutPlan?.error ?? null,
);
