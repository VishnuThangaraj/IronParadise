import { createSlice } from "@reduxjs/toolkit";
import { fetchAllMembers, fetchMemberCounter } from "./memberThunks";

const initialState = {
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
      });
  },
});

export const { clearMembers } = memberSlice.actions;
export default memberSlice.reducer;
