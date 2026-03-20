import {createSlice} from "@reduxjs/toolkit";
import {
    addNewMembershipPlan,
    deleteMembershipPlanById,
    fetchAllMembershipPlans,
    fetchMembershipPlanById,
    updateMembershipPlanById,
} from "./membershipPlanThunks";

const initialState = {
    currentMembershipPlan: null,
    membershipPlans: [],
    loading: false,
};

const membershipPlanSlice = createSlice({
    name: "membershipplan",
    initialState,
    reducers: {
        clearMembershipPlans: (state) => {
            state.membershipPlans = [];
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Membership Plans
            .addCase(fetchAllMembershipPlans.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAllMembershipPlans.fulfilled, (state, action) => {
                state.loading = false;
                state.membershipPlans = action.payload;
            })
            .addCase(fetchAllMembershipPlans.rejected, (state) => {
                state.loading = false;
            })
            // Add New Membership Plan
            .addCase(addNewMembershipPlan.pending, (state) => {
                state.loading = true;
            })
            .addCase(addNewMembershipPlan.fulfilled, (state, action) => {
                state.loading = false;
                state.membershipPlans.push(action?.payload);
            })
            .addCase(addNewMembershipPlan.rejected, (state) => {
                state.loading = false;
            }) // Fetch MembershipPlan By ID
            .addCase(fetchMembershipPlanById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchMembershipPlanById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentMembershipPlan = action.payload;
            })
            .addCase(fetchMembershipPlanById.rejected, (state) => {
                state.loading = false;
            })
            // Update MembershipPlan by ID
            .addCase(updateMembershipPlanById.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateMembershipPlanById.fulfilled, (state, action) => {
                state.loading = false;

                const updatedMembershipPlan = action.payload;
                const index = state.membershipPlans.findIndex(
                    (membershipPlan) => membershipPlan._id === updatedMembershipPlan._id,
                );

                if (index !== -1) state.membershipPlans[index] = updatedMembershipPlan;

                state.currentMembershipPlan = updatedMembershipPlan;
            })
            .addCase(updateMembershipPlanById.rejected, (state) => {
                state.loading = false;
            })
            .addCase(deleteMembershipPlanById.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteMembershipPlanById.fulfilled, (state, action) => {
                state.loading = false;
                const id = action.payload;

                state.membershipPlans = state.membershipPlans.filter(
                    (membershipPlan) => membershipPlan._id !== id,
                );
                if (state.currentMembershipPlan?._id === id) {
                    state.currentMembershipPlan = null;
                }
            })
            .addCase(deleteMembershipPlanById.rejected, (state) => {
                state.loading = false;
            });
    },
});

export const {clearMembershipPlans} = membershipPlanSlice.actions;
export default membershipPlanSlice.reducer;
