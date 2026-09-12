import api from "@/shared/service/api";
import {
  TrainerFormData,
  TrainerResponse,
  UpdateTrainerRequest,
  SingleTrainerResponse,
} from "../types/trainer.types";

// get all trainer
export const getTrainers = async (): Promise<TrainerResponse> => {
  const response = await api.get<TrainerResponse>("/api/trainer");
  return response.data;
};

// get trainer by id
export const getTrainerById = async (
  trainerId: string,
): Promise<SingleTrainerResponse> => {
  const response = await api.get<SingleTrainerResponse>(
    `/api/trainer/${trainerId}`,
  );
  return response.data;
};

// create trainer
export const createTrainer = async (
  trainerData: TrainerFormData,
): Promise<SingleTrainerResponse> => {
  const response = await api.post<SingleTrainerResponse>(
    "/api/trainer/",
    trainerData,
  );
  return response.data;
};

// update trainer
export const updateTrainer = async (
  trainerId: string,
  trainerData: UpdateTrainerRequest,
): Promise<SingleTrainerResponse> => {
  const response = await api.patch<SingleTrainerResponse>(
    `/api/trainer/${trainerId}`,
    trainerData,
  );
  return response.data;
};

// delete trainer (soft delete)
export const deleteTrainer = async (
  trainerId: string,
): Promise<SingleTrainerResponse> => {
  const response = await api.delete<SingleTrainerResponse>(
    `/api/trainer/${trainerId}`,
  );
  return response.data;
};

// delete trainer (hard delete)
export const deleteTrainerPermanently = async (
  trainerId: string,
): Promise<SingleTrainerResponse> => {
  const response = await api.delete<SingleTrainerResponse>(
    `/api/trainer/${trainerId}/permanent`,
  );
  return response.data;
};
