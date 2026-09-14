import api from "@/shared/service/api";
import {
  MemberFormData,
  MemberQueryParams,
  MemberResponse,
  SingleMemberResponse,
  UpdateMemberRequest,
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
