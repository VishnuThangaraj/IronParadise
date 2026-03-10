import { createSlice } from "@reduxjs/toolkit";
import { sendMail } from "./emailThunks";

const initialState = {
  loading: false,
  error: null,
};

const emailSlice = createSlice({
  name: "email",
  initialState,
  reducers: {
    clearEmailplans: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Send Mail without attachment
      .addCase(sendMail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMail.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(sendMail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearEmailplans } = emailSlice.actions;
export default emailSlice.reducer;
