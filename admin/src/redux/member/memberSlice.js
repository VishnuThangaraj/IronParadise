import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAllMembers,
  fetchMemberCounter,
  addNewMember,
  fetchMemberById,
  updateMemberById,
  deleteMemberById,
  fetchMemberByMemberId,
} from "./memberThunks";

const initialState = {
  currentMember: null,
  members: [],
  loading: false,
  error: null,
  counter: 0,
};

const memberSlice = createSlice({
  name: "member",
  initialState,
  reducers: {
    clearMembers: (state) => {
      state.members = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Members
    builder
      .addCase(fetchAllMembers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.members = action.payload;
      })
      .addCase(fetchAllMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Member Counter
      .addCase(fetchMemberCounter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMemberCounter.fulfilled, (state, action) => {
        state.loading = false;
        state.counter = action.payload;
      })
      .addCase(fetchMemberCounter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add New Member
      .addCase(addNewMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addNewMember.fulfilled, (state, action) => {
        state.loading = false;
        state.counter += 1;
        state.members.push(action.payload);
      })
      .addCase(addNewMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Member By Id
      .addCase(fetchMemberById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMemberById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentMember = action.payload;
      })
      .addCase(fetchMemberById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Member By Id
      .addCase(fetchMemberByMemberId.pending, (state) => {
        state.currentMember = null;
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMemberByMemberId.fulfilled, (state, action) => {
        state.loading = false;
        state.currentMember = action.payload;
      })
      .addCase(fetchMemberByMemberId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Member by Id
      .addCase(updateMemberById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMemberById.fulfilled, (state, action) => {
        state.loading = false;

        const updatedMember = action.payload;
        const index = state.members.findIndex(
          (member) => member._id === updatedMember._id,
        );

        if (index !== -1) state.members[index] = updatedMember;

        state.currentMember = updatedMember;
      })
      .addCase(updateMemberById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteMemberById.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(deleteMemberById.fulfilled, (state, action) => {
        state.loading = false;
        const id = action.payload;

        state.members = state.members.filter((member) => member._id !== id);
        if (state.currentMember?._id === id) {
          state.currentMember = null;
        }
      })
      .addCase(deleteMemberById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMembers } = memberSlice.actions;
export default memberSlice.reducer;
