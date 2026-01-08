import { createSlice } from "@reduxjs/toolkit";
import {
  addNewMembership,
  fetchAllMemberships,
  fetchMembershipCounter,
} from "./membershipThunks";

const initialState = {
  memberships: [],
  loading: false,
  error: null,
  counter: 0,
};

const membershipSlice = createSlice({
  name: "membership",
  initialState,
  reducers: {
    clearMembershipplans: (state) => {
      state.memberships = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Membership Plans
      .addCase(fetchAllMemberships.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllMemberships.fulfilled, (state, action) => {
        state.loading = false;
        state.memberships = action.payload;
      })
      .addCase(fetchAllMemberships.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Membership Plan Counter
      .addCase(fetchMembershipCounter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMembershipCounter.fulfilled, (state, action) => {
        state.loading = false;
        state.counter = action.payload;
      })
      .addCase(fetchMembershipCounter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add New Membership Plan
      .addCase(addNewMembership.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addNewMembership.fulfilled, (state, action) => {
        state.loading = false;
        state.counter += 1;
        state.memberships.push(action.payload);
      })
      .addCase(addNewMembership.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMembershipplans } = membershipSlice.actions;
export default membershipSlice.reducer;
