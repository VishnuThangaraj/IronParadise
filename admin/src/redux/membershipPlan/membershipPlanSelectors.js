export const selectMembershipPlanError = (state) => state.membershipPlan.error;
export const selectMembershipPlanCounter = (state) =>
  state.membershipPlan.counter;
export const selectMembershipPlanLoading = (state) =>
  state.membershipPlan.loading;
export const selectAllMembershipPlans = (state) =>
  state.membershipPlan.membershipPlans;
export const selectCurrentMembershipPlan = (state) =>
  state.membershipPlan.currentMembershipPlan;
