import { type RootState } from "@/app/store";
import { createSelector } from "@reduxjs/toolkit";

export const selectMembershipPlanState = (state: RootState) =>
  state.membershipPlan;

export const selectMembershipPlans = createSelector(
  selectMembershipPlanState,
  (membershipPlan) => membershipPlan?.plans ?? [],
);

export const selectCurrentMembershipPlan = createSelector(
  selectMembershipPlanState,
  (membershipPlan) => membershipPlan?.currentPlan ?? null,
);

export const selectMembershipPlanLoading = createSelector(
  selectMembershipPlanState,
  (membershipPlan) => membershipPlan?.loading ?? false,
);

export const selectMembershipPlanError = createSelector(
  selectMembershipPlanState,
  (membershipPlan) => membershipPlan?.error ?? null,
);
