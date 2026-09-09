import { createSlice, isPending, type PayloadAction } from "@reduxjs/toolkit";

import type {
  Trainer,
  TrainerResponse,
  SingleTrainerResponse,
} from "../types/trainer.types";
import {
  createTrainer,
  fetchTrainers,
  updateTrainer,
  deleteTrainer,
  fetchTrainerById,
  deleteTrainerPermanently,
} from "./trainer.thunks";

export interface TrainerState {
  trainers: Trainer[];
  currentTrainer: Trainer | null;
  loading: boolean;
  error: string | null;
}

const initialState: TrainerState = {
  trainers: [],
  currentTrainer: null,
  loading: false,
  error: null,
};

const trainerSlice = createSlice({
  name: "trainer",
  initialState,
  reducers: {
    setCurrentTrainer: (state, action: PayloadAction<Trainer | null>) => {
      state.currentTrainer = action.payload;
    },
    clearTrainerError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch all trainers
      .addCase(
        fetchTrainers.fulfilled,
        (state, action: PayloadAction<TrainerResponse>) => {
          state.loading = false;
          state.trainers = action.payload.data;
        },
      )
      .addCase(fetchTrainers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch trainers";
      })

      // fetch trainer by id
      .addCase(
        fetchTrainerById.fulfilled,
        (state, action: PayloadAction<SingleTrainerResponse>) => {
          state.loading = false;
          state.currentTrainer = action.payload.data;
        },
      )
      .addCase(fetchTrainerById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch trainer";
      })

      // create trainer
      .addCase(
        createTrainer.fulfilled,
        (state, action: PayloadAction<SingleTrainerResponse>) => {
          state.loading = false;
          state.trainers.unshift(action.payload.data);
        },
      )
      .addCase(createTrainer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create trainer";
      })

      // update trainer
      .addCase(
        updateTrainer.fulfilled,
        (state, action: PayloadAction<SingleTrainerResponse>) => {
          state.loading = false;

          const updatedTrainer = action.payload.data;
          state.trainers = state.trainers.map((trainer) =>
            trainer._id === updatedTrainer._id ||
            trainer.userId === updatedTrainer.userId
              ? updatedTrainer
              : trainer,
          );
          if (
            state.currentTrainer &&
            (state.currentTrainer._id === updatedTrainer._id ||
              state.currentTrainer.userId === updatedTrainer.userId)
          ) {
            state.currentTrainer = updatedTrainer;
          }
        },
      )
      .addCase(updateTrainer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update trainer";
      })

      // delete trainer (soft delete)
      .addCase(
        deleteTrainer.fulfilled,
        (state, action: PayloadAction<SingleTrainerResponse>) => {
          state.loading = false;
          const deletedTrainer = action.payload.data;
          state.trainers = state.trainers.map((trainer) =>
            trainer._id === deletedTrainer._id ||
            trainer.userId === deletedTrainer.userId
              ? deletedTrainer
              : trainer,
          );
          if (
            state.currentTrainer &&
            (state.currentTrainer._id === deletedTrainer._id ||
              state.currentTrainer.userId === deletedTrainer.userId)
          ) {
            state.currentTrainer = deletedTrainer;
          }
        },
      )
      .addCase(deleteTrainer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete trainer";
      })

      // permanently delete trainer
      .addCase(
        deleteTrainerPermanently.fulfilled,
        (state, action: PayloadAction<SingleTrainerResponse>) => {
          state.loading = false;
          const deletedTrainer = action.payload.data;
          state.trainers = state.trainers.filter(
            (trainer) =>
              trainer._id !== deletedTrainer._id &&
              trainer.userId !== deletedTrainer.userId,
          );
          if (
            state.currentTrainer &&
            (state.currentTrainer._id === deletedTrainer._id ||
              state.currentTrainer.userId === deletedTrainer.userId)
          ) {
            state.currentTrainer = null;
          }
        },
      )
      .addCase(deleteTrainerPermanently.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to permanently delete trainer";
      })

      // common matcher for all pending thunk states
      .addMatcher(
        isPending(
          fetchTrainers,
          fetchTrainerById,
          createTrainer,
          updateTrainer,
          deleteTrainer,
          deleteTrainerPermanently,
        ),
        (state) => {
          state.loading = true;
          state.error = null;
        },
      );
  },
});

export const { setCurrentTrainer, clearTrainerError } = trainerSlice.actions;
export default trainerSlice.reducer;
