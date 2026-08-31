import api from "@/shared/service/api";
import type {
  MembershipPlanFormData,
  MembershipPlanResponse,
  SingleMembershipPlanResponse,
  UpdateMembershipPlanRequest,
} from "../types/membership-plan.types";

// get all membership plans
export const getMembershipPlans = async (): Promise<MembershipPlanResponse> => {
  const response = await api.get<MembershipPlanResponse>(
    "/api/membership-plan/",
  );
  return response.data;
};

// get membership plan by id
export const getMembershipPlanById = async (
  membershipPlanId: string,
): Promise<SingleMembershipPlanResponse> => {
  const response = await api.get<SingleMembershipPlanResponse>(
    `/api/membership-plan/${membershipPlanId}`,
  );
  return response.data;
};

// create membership plan
export const createMembershipPlan = async (
  planData: MembershipPlanFormData,
): Promise<SingleMembershipPlanResponse> => {
  const response = await api.post<SingleMembershipPlanResponse>(
    "/api/membership-plan/",
    planData,
  );
  return response.data;
};

// update membership plan
export const updateMembershipPlan = async (
  membershipPlanId: string,
  planData: UpdateMembershipPlanRequest,
): Promise<SingleMembershipPlanResponse> => {
  const response = await api.patch<SingleMembershipPlanResponse>(
    `/api/membership-plan/${membershipPlanId}`,
    planData,
  );
  return response.data;
};

// delete membership plan (soft delete)
export const deleteMembershipPlan = async (
  membershipPlanId: string,
): Promise<SingleMembershipPlanResponse> => {
  const response = await api.delete<SingleMembershipPlanResponse>(
    `/api/membership-plan/${membershipPlanId}`,
  );
  return response.data;
};

// delete membership plan (hard delete)
export const deleteMembershipPlanPermanently = async (
  membershipPlanId: string,
): Promise<SingleMembershipPlanResponse> => {
  const response = await api.delete<SingleMembershipPlanResponse>(
    `/api/membership-plan/${membershipPlanId}/permanent`,
  );
  return response.data;
};
