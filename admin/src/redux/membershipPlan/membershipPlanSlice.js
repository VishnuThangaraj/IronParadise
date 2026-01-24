import { createSlice } from "@reduxjs/toolkit";
import {
  addNewMembershipPlan,
  fetchAllMembershipPlans,
  fetchMembershipPlanCounter,
  fetchMembershipPlanById,
  updateMembershipPlanById,
  deleteMembershipPlanById,
} from "./membershipPlanThunks";

const initialState = {
  currentMembershipPlan: null,
  membershipPlans: [],
  loading: false,
  error: null,
  counter: 0,
};

const membershipPlanSlice = createSlice({
  name: "membershipplan",
  initialState,
  reducers: {
    clearMembershipplans: (state) => {
      state.membershipPlans = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Membership Plans
      .addCase(fetchAllMembershipPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllMembershipPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.membershipPlans = action.payload;
      })
      .addCase(fetchAllMembershipPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Membership Plan Counter
      .addCase(fetchMembershipPlanCounter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMembershipPlanCounter.fulfilled, (state, action) => {
        state.loading = false;
        state.counter = action.payload;
      })
      .addCase(fetchMembershipPlanCounter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add New Membership Plan
      .addCase(addNewMembershipPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addNewMembershipPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.counter += 1;
        state.membershipPlans.push(action.payload);
      })
      .addCase(addNewMembershipPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      }) // Fetch MembershipPlan By Id
      .addCase(fetchMembershipPlanById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMembershipPlanById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentMembershipPlan = action.payload;
      })
      .addCase(fetchMembershipPlanById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update MembershipPlan by Id
      .addCase(updateMembershipPlanById.pending, (state) => {
        state.loading = true;
        state.error = null;
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
      .addCase(updateMembershipPlanById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteMembershipPlanById.pending, (state) => {
        state.loading = true;
        state.error = false;
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
      .addCase(deleteMembershipPlanById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMembershipplans } = membershipPlanSlice.actions;
export default membershipPlanSlice.reducer;
