import { createSlice } from "@reduxjs/toolkit";
import {
  addNewTrainer,
  fetchAllTrainers,
  fetchTrainerById,
  fetchTrainerCounter,
} from "./trainerThunks";

const initialState = {
  currentTrainer: null,
  trainers: [],
  loading: false,
  error: null,
  counter: 0,
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
      // Fetch Trainer
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
      })
      // Fetch Trainer Counter
      .addCase(fetchTrainerCounter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrainerCounter.fulfilled, (state, action) => {
        state.loading = false;
        state.counter = action.payload;
      })
      .addCase(fetchTrainerCounter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add New Trainer
      .addCase(addNewTrainer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addNewTrainer.fulfilled, (state, action) => {
        state.loading = false;
        state.counter += 1;
        state.trainers.push(action.payload);
      })
      .addCase(addNewTrainer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Trainer By Id
      .addCase(fetchTrainerById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrainerById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTrainer = action.payload;
      })
      .addCase(fetchTrainerById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearTrainers } = trainerSlice.actions;
export default trainerSlice.reducer;
