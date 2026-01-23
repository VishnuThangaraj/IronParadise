export const selectMembershipError = (state) => state.membership.error;
export const selectMembershipCounter = (state) => state.membership.counter;
export const selectMembershipLoading = (state) => state.membership.loading;
export const selectAllMemberships = (state) => state.membership.memberships;
export const selectCurrentMembershipPlan = (state) =>
  state.membership.currentMembershipPlan;
