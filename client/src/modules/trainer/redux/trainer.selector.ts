import { type RootState } from "@/app/store";
import { createSelector } from "@reduxjs/toolkit";

export const selectTrainerState = (state: RootState) => state.trainer;

export const selectTrainers = createSelector(
  selectTrainerState,
  (trainer) => trainer?.trainers ?? [],
);

export const selectCurrentTrainer = createSelector(
  selectTrainerState,
  (trainer) => trainer?.currentTrainer ?? null,
);

export const selectTrainerLoading = createSelector(
  selectTrainerState,
  (trainer) => trainer?.loading ?? false,
);

export const selectTrainerError = createSelector(
  selectTrainerState,
  (trainer) => trainer?.error ?? null,
);
