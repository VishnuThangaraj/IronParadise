import { type RootState } from "@/app/store";
import { createSelector } from "@reduxjs/toolkit";

export const selectDietPlanState = (state: RootState) => state.dietPlan;

export const selectDietPlans = createSelector(
  selectDietPlanState,
  (dietPlan) => dietPlan?.plans ?? [],
);

export const selectCurrentDietPlan = createSelector(
  selectDietPlanState,
  (dietPlan) => dietPlan?.currentPlan ?? null,
);

export const selectDietPlanLoading = createSelector(
  selectDietPlanState,
  (dietPlan) => dietPlan?.loading ?? false,
);

export const selectDietPlanError = createSelector(
  selectDietPlanState,
  (dietPlan) => dietPlan?.error ?? null,
);
