import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAllMembershipPlans,
  fetchMembershipPlanCounter,
} from "./membershipPlanThunks";

const initialState = {
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
        });
    },
  },
});

export const { clearMembershipplans } = membershipPlanSlice.actions;
export default membershipPlanSlice.reducer;
