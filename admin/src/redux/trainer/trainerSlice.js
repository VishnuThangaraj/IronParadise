import { createSlice } from "@reduxjs/toolkit";
import {
  addNewTrainer,
  fetchAllTrainers,
  fetchTrainerById,
  fetchTrainerByUserId,
  updateTrainerById,
  deleteTrainerById,
} from "./trainerThunks";

const initialState = {
  currentTrainer: null,
  trainers: [],
  loading: false,
};

const trainerSlice = createSlice({
  name: "trainer",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Trainer
      .addCase(fetchAllTrainers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllTrainers.fulfilled, (state, action) => {
        state.loading = false;
        state.trainers = action.payload;
      })
      .addCase(fetchAllTrainers.rejected, (state) => {
        state.loading = false;
      })

      // Add New Trainer
      .addCase(addNewTrainer.pending, (state) => {
        state.loading = true;
      })
      .addCase(addNewTrainer.fulfilled, (state, action) => {
        state.loading = false;
        state.counter += 1;
        state.trainers.push(action.payload);
      })
      .addCase(addNewTrainer.rejected, (state) => {
        state.loading = false;
      })

      // Fetch Trainer By Id
      .addCase(fetchTrainerById.pending, (state) => {
        state.loading = true;
        state.currentTrainer = null;
      })
      .addCase(fetchTrainerById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTrainer = action.payload;
      })
      .addCase(fetchTrainerById.rejected, (state) => {
        state.loading = false;
      })

      // Fetch Trainer By UserId
      .addCase(fetchTrainerByUserId.pending, (state) => {
        state.loading = true;
        state.currentTrainer = null;
      })
      .addCase(fetchTrainerByUserId.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTrainer = action.payload;
      })
      .addCase(fetchTrainerByUserId.rejected, (state) => {
        state.loading = false;
      })

      // Update Trainer by ID
      .addCase(updateTrainerById.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateTrainerById.fulfilled, (state, action) => {
        state.loading = false;

        const updatedTrainer = action.payload;
        const index = state.trainers.findIndex(
          (trainer) => trainer._id === updatedTrainer._id,
        );

        if (index !== -1) state.trainers[index] = updatedTrainer;

        state.currentTrainer = updatedTrainer;
      })
      .addCase(updateTrainerById.rejected, (state) => {
        state.loading = false;
      })

      // Delete Trainer by ID
      .addCase(deleteTrainerById.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteTrainerById.fulfilled, (state, action) => {
        state.loading = false;
        const id = action.payload;

        state.trainers = state.trainers.filter((trainer) => trainer._id !== id);
        if (state.currentTrainer?._id === id) {
          state.currentTrainer = null;
        }
      })
      .addCase(deleteTrainerById.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default trainerSlice.reducer;
