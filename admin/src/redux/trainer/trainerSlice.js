import { createSlice } from "@reduxjs/toolkit";
import { fetchAllTrainers } from "./trainerThunks";

const initialState = {
  trainers: [],
  loading: false,
  error: null,
};

const trainerSlice = createSlice({
  name: "trainer",
  initialState,
  reducers: {
    clearTrainers: (state) => {
      state.trainers = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllTrainers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllTrainers.fulfilled, (state, action) => {
        state.loading = false;
        state.trainers = action.payload;
      })
      .addCase(fetchAllTrainers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearTrainers } = trainerSlice.actions;
export default trainerSlice.reducer;
