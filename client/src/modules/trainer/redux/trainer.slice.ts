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
  currentPlan: Trainer | null;
  loading: boolean;
  error: string | null;
}

const initialState: TrainerState = {
  trainers: [],
  currentPlan: null,
  loading: false,
  error: null,
};

const trainerSlice = createSlice({
  name: "trainer",
  initialState,
  reducers: {
    setCurrentPlan: (state, action: PayloadAction<Trainer | null>) => {
      state.currentPlan = action.payload;
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
          state.currentPlan = action.payload.data;
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

          const updatedPlan = action.payload.data;
          state.trainers = state.trainers.map((trainer) =>
            trainer._id === updatedPlan._id ||
            trainer.userId === updatedPlan.userId
              ? updatedPlan
              : trainer,
          );
          if (
            state.currentPlan &&
            (state.currentPlan._id === updatedPlan._id ||
              state.currentPlan.userId === updatedPlan.userId)
          ) {
            state.currentPlan = updatedPlan;
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
          const deletedPlan = action.payload.data;
          state.trainers = state.trainers.map((trainer) =>
            trainer._id === deletedPlan._id ||
            trainer.userId === deletedPlan.userId
              ? deletedPlan
              : trainer,
          );
          if (
            state.currentPlan &&
            (state.currentPlan._id === deletedPlan._id ||
              state.currentPlan.userId === deletedPlan.userId)
          ) {
            state.currentPlan = deletedPlan;
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
          const deletedPlan = action.payload.data;
          state.trainers = state.trainers.filter(
            (trainer) =>
              trainer._id !== deletedPlan._id &&
              trainer.userId !== deletedPlan.userId,
          );
          if (
            state.currentPlan &&
            (state.currentPlan._id === deletedPlan._id ||
              state.currentPlan.userId === deletedPlan.userId)
          ) {
            state.currentPlan = null;
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

export const { setCurrentPlan, clearTrainerError } = trainerSlice.actions;
export default trainerSlice.reducer;
