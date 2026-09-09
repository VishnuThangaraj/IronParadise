import { createAsyncThunk } from "@reduxjs/toolkit";
import { getErrorMessage } from "@/shared/utils/error-handler";

import {
  getTrainers,
  getTrainerById,
  createTrainer as createTrainerApi,
  updateTrainer as updateTrainerApi,
  deleteTrainer as deleteTrainerApi,
  deleteTrainerPermanently as deleteTrainerPermanentlyApi,
} from "@/modules/trainer/api/trainer.api";

import type {
  TrainerFormData,
  TrainerResponse,
  SingleTrainerResponse,
  UpdateTrainerRequest,
} from "../types/trainer.types";

// fetch all trainers
export const fetchTrainers = createAsyncThunk<
  TrainerResponse,
  void,
  { rejectValue: string }
>("trainer/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await getTrainers();
    return response;
  } catch (err: unknown) {
    return rejectWithValue(getErrorMessage(err, "Failed to fetch trainers"));
  }
});

// fetch trainers by id
export const fetchTrainerById = createAsyncThunk<
  SingleTrainerResponse,
  string,
  { rejectValue: string }
>("trainer/fetchById", async (userId, { rejectWithValue }) => {
  try {
    const response = await getTrainerById(userId);
    return response;
  } catch (err: unknown) {
    return rejectWithValue(getErrorMessage(err, "Failed to fetch trainer"));
  }
});

// create trainer
export const createTrainer = createAsyncThunk<
  SingleTrainerResponse,
  TrainerFormData,
  {
    rejectValue: string;
  }
>("trainer/create", async (trainerData, { rejectWithValue }) => {
  try {
    const response = await createTrainerApi(trainerData);
    return response;
  } catch (err: unknown) {
    return rejectWithValue(getErrorMessage(err, "Failed to create trainer"));
  }
});

// update trainer
export const updateTrainer = createAsyncThunk<
  SingleTrainerResponse,
  { userId: string; trainerData: UpdateTrainerRequest },
  { rejectValue: string }
>("trainer/update", async ({ userId, trainerData }, { rejectWithValue }) => {
  try {
    const response = await updateTrainerApi(userId, trainerData);

    return response;
  } catch (err: unknown) {
    return rejectWithValue(getErrorMessage(err, "Failed to update trainer"));
  }
});

// delete trainer (soft delete)
export const deleteTrainer = createAsyncThunk<
  SingleTrainerResponse,
  string,
  { rejectValue: string }
>("trainer/delete", async (userId, { rejectWithValue }) => {
  try {
    const response = await deleteTrainerApi(userId);
    return response;
  } catch (err: unknown) {
    return rejectWithValue(getErrorMessage(err, "Failed to delete trainer"));
  }
});

// delete trainer permanently (hard delete)
export const deleteTrainerPermanently = createAsyncThunk<
  SingleTrainerResponse,
  string,
  { rejectValue: string }
>("trainer/deletePermanently", async (userId, { rejectWithValue }) => {
  try {
    const response = await deleteTrainerPermanentlyApi(userId);
    return response;
  } catch (err: unknown) {
    return rejectWithValue(
      getErrorMessage(err, "Failed to permanently delete trainer"),
    );
  }
});
