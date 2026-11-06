import api from "@/shared/service/api";
import {
  MemberFormData,
  MemberQueryParams,
  MemberResponse,
  SingleMemberResponse,
  UpdateMemberRequest,
  MemberSelfDetailsResponse,
  MemberSelfAttendanceResponse,
  MemberSelfTrainerResponse,
  MemberSelfPlansResponse,
  MemberSelfPaymentsResponse,
} from "../types/member.types";

// Get all members with optional query params
export const getMembers = async (
  params?: MemberQueryParams,
): Promise<MemberResponse> => {
  const response = await api.get<MemberResponse>("/api/member", {
    params,
  });
  return response.data;
};

// Get member by ID
export const getMemberById = async (
  memberId: string,
): Promise<SingleMemberResponse> => {
  const response = await api.get<SingleMemberResponse>(
    `/api/member/${memberId}`,
  );
  return response.data;
};

// Alias for getMemberById
export const getMember = getMemberById;

// Create member
export const createMember = async (
  memberData: MemberFormData,
): Promise<SingleMemberResponse> => {
  const response = await api.post<SingleMemberResponse>(
    "/api/member/",
    memberData,
  );
  return response.data;
};

// Update member
export const updateMember = async (
  memberId: string,
  memberData: UpdateMemberRequest,
): Promise<SingleMemberResponse> => {
  const response = await api.patch<SingleMemberResponse>(
    `/api/member/${memberId}`,
    memberData,
  );
  return response.data;
};

// Delete member (soft delete)
export const deleteMember = async (
  memberId: string,
): Promise<SingleMemberResponse> => {
  const response = await api.delete<SingleMemberResponse>(
    `/api/member/${memberId}`,
  );
  return response.data;
};

// Delete member (permanent delete)
export const deleteMemberPermanently = async (
  memberId: string,
): Promise<SingleMemberResponse> => {
  const response = await api.delete<SingleMemberResponse>(
    `/api/member/${memberId}/permanent`,
  );
  return response.data;
};

// --- Logged-in Member Self Services ---

export const getMyDetails = async (): Promise<MemberSelfDetailsResponse> => {
  const response = await api.get<MemberSelfDetailsResponse>("/api/member/my/details");
  return response.data;
};

export const getMyAttendance = async (params?: {
  month?: number;
  year?: number;
  limit?: number;
}): Promise<MemberSelfAttendanceResponse> => {
  const response = await api.get<MemberSelfAttendanceResponse>("/api/member/my/attendance", {
    params,
  });
  return response.data;
};

export const getMyTrainer = async (): Promise<MemberSelfTrainerResponse> => {
  const response = await api.get<MemberSelfTrainerResponse>("/api/member/my/trainer");
  return response.data;
};

export const getMyPlans = async (): Promise<MemberSelfPlansResponse> => {
  const response = await api.get<MemberSelfPlansResponse>("/api/member/my/plans");
  return response.data;
};

export const getMyPayments = async (): Promise<MemberSelfPaymentsResponse> => {
  const response = await api.get<MemberSelfPaymentsResponse>("/api/member/my/payments");
  return response.data;
};

