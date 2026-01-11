import { createSlice } from "@reduxjs/toolkit";
import { addMemberFlow } from "./addMember.flow";

const initialState = {
  addMember: {
    loading: false,
    success: false,
    error: null,
  },
};

const flowSlice = createSlice({
  name: "flows",
  initialState,
  reducers: {
    resetAddMemberFlow(state) {
      state.addMember = {
        loading: false,
        success: false,
        error: null,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addMemberFlow.pending, (state) => {
        state.addMember.loading = true;
        state.addMember.success = false;
        state.addMember.error = null;
      })
      .addCase(addMemberFlow.fulfilled, (state) => {
        state.addMember.loading = false;
        state.addMember.success = true;
      })
      .addCase(addMemberFlow.rejected, (state, action) => {
        state.addMember.loading = false;
        state.addMember.error = action.payload;
      });
  },
});

export const { resetAddMemberFlow } = flowSlice.actions;
export default flowSlice.reducer;
