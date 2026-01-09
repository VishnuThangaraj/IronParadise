export const selectFlows = (state) => state.flows;

export const selectAddMemberFlow = (state) => state.flows.addMember;
export const selectAddMemberLoading = (state) => state.flows.addMember.loading;
export const selectAddMemberSuccess = (state) => state.flows.addMember.success;
export const selectAddMemberError = (state) => state.flows.addMember.error;
