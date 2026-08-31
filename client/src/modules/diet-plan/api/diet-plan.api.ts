import api from "@/shared/service/api";
import {
  DietPlanFormData,
  DietPlanResponse,
  SingleDietPlanResponse,
  UpdateDietPlanRequest,
} from "../types/diet-plan.types";

// get all diet plans
export const getDietPlans = async (): Promise<DietPlanResponse> => {
  const response = await api.get<DietPlanResponse>("/api/diet-plan");
  return response.data;
};

// get diet plan by id
export const getDietPlanById = async (
  dietPlanId: string,
): Promise<SingleDietPlanResponse> => {
  const response = await api.get<SingleDietPlanResponse>(
    `/api/diet-plan/${dietPlanId}`,
  );
  return response.data;
};

// create diet plan
export const createDietPlan = async (
  planData: DietPlanFormData,
): Promise<SingleDietPlanResponse> => {
  const response = await api.post<SingleDietPlanResponse>(
    "/api/diet-plan/",
    planData,
  );
  return response.data;
};

// update diet plan
export const updateDietPlan = async (
  dietPlanId: string,
  planData: UpdateDietPlanRequest,
): Promise<SingleDietPlanResponse> => {
  const response = await api.patch<SingleDietPlanResponse>(
    `/api/diet-plan/${dietPlanId}`,
    planData,
  );
  return response.data;
};

// delete diet plan (soft delete)
export const deleteDietPlan = async (
  dietPlanId: string,
): Promise<SingleDietPlanResponse> => {
  const response = await api.delete<SingleDietPlanResponse>(
    `/api/diet-plan/${dietPlanId}`,
  );
  return response.data;
};

// delete diet plan (hard delete)
export const deleteDietPlanPermanently = async (
  dietPlanId: string,
): Promise<SingleDietPlanResponse> => {
  const response = await api.delete<SingleDietPlanResponse>(
    `/api/diet-plan/${dietPlanId}/permanent`,
  );
  return response.data;
};
