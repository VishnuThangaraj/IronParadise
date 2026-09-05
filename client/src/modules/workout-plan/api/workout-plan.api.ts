import api from "@/shared/service/api";
import {
  WorkoutPlanFormData,
  WorkoutPlanResponse,
  UpdateWorkoutPlanRequest,
  SingleWorkoutPlanResponse,
} from "../types/workout-plan.types";

// get all workout plans
export const getWorkoutPlans = async (): Promise<WorkoutPlanResponse> => {
  const response = await api.get<WorkoutPlanResponse>("/api/workout-plan");
  return response.data;
};

// get workout plan by id
export const getWorkoutPlanById = async (
  workoutPlanId: string,
): Promise<SingleWorkoutPlanResponse> => {
  const response = await api.get<SingleWorkoutPlanResponse>(
    `/api/workout-plan/${workoutPlanId}`,
  );
  return response.data;
};

// create workout plan
export const createWorkoutPlan = async (
  planData: WorkoutPlanFormData,
): Promise<SingleWorkoutPlanResponse> => {
  const response = await api.post<SingleWorkoutPlanResponse>(
    "/api/workout-plan/",
    planData,
  );
  return response.data;
};

// update workout plan
export const updateWorkoutPlan = async (
  workoutPlanId: string,
  planData: UpdateWorkoutPlanRequest,
): Promise<SingleWorkoutPlanResponse> => {
  const response = await api.patch<SingleWorkoutPlanResponse>(
    `/api/workout-plan/${workoutPlanId}`,
    planData,
  );
  return response.data;
};

// delete workout plan (soft delete)
export const deleteWorkoutPlan = async (
  workoutPlanId: string,
): Promise<SingleWorkoutPlanResponse> => {
  const response = await api.delete<SingleWorkoutPlanResponse>(
    `/api/workout-plan/${workoutPlanId}`,
  );
  return response.data;
};

// delete workout plan (hard delete)
export const deleteWorkoutPlanPermanently = async (
  workoutPlanId: string,
): Promise<SingleWorkoutPlanResponse> => {
  const response = await api.delete<SingleWorkoutPlanResponse>(
    `/api/workout-plan/${workoutPlanId}/permanent`,
  );
  return response.data;
};
