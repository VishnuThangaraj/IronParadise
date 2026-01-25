import { createSlice } from "@reduxjs/toolkit";
import {
  addNewMembership,
  fetchAllMemberships,
  fetchMembershipCounter,
  fetchMembershipById,
  updateMembershipById,
  deleteMembershipById,
} from "./membershipThunks";

const initialState = {
  currentMembership: null,
  memberships: [],
  loading: false,
  error: null,
  counter: 0,
};

const membershipSlice = createSlice({
  name: "membership",
  initialState,
  reducers: {
    clearMemberships: (state) => {
      state.memberships = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Membership s
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
      // Fetch Membership  Counter
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
      // Add New Membership
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
      })
      // Fetch Membership By Id
      .addCase(fetchMembershipById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMembershipById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentMembership = action.payload;
      })
      .addCase(fetchMembershipById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Membership by Id
      .addCase(updateMembershipById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMembershipById.fulfilled, (state, action) => {
        state.loading = false;

        const updatedMembership = action.payload;
        const index = state.memberships.findIndex(
          (membership) => membership._id === updatedMembership._id,
        );

        if (index !== -1) state.memberships[index] = updatedMembership;

        state.currentMembership = updatedMembership;
      })
      .addCase(updateMembershipById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteMembershipById.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(deleteMembershipById.fulfilled, (state, action) => {
        state.loading = false;
        const id = action.payload;

        state.memberships = state.memberships.filter(
          (membership) => membership._id !== id,
        );
        if (state.currentMembership?._id === id) {
          state.currentMembership = null;
        }
      })
      .addCase(deleteMembershipById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMemberships } = membershipSlice.actions;
export default membershipSlice.reducer;
