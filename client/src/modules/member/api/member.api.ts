import api from "@/shared/service/api";
import {
  MemberFormData,
  MemberResponse,
  UpdateMemberRequest,
  SingleMemberResponse,
} from "../types/member.types";

// get all member
export const getMembers = async (): Promise<MemberResponse> => {
  const response = await api.get<MemberResponse>("/api/member");
  return response.data;
};

// get member by id
export const getMemberById = async (
  memberId: string,
): Promise<SingleMemberResponse> => {
  const response = await api.get<SingleMemberResponse>(
    `/api/member/${memberId}`,
  );
  return response.data;
};

// create member
export const createMember = async (
  memberData: MemberFormData,
): Promise<SingleMemberResponse> => {
  const response = await api.post<SingleMemberResponse>(
    "/api/member/",
    memberData,
  );
  return response.data;
};

// update member
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

// delete member (soft delete)
export const deleteMember = async (
  memberId: string,
): Promise<SingleMemberResponse> => {
  const response = await api.delete<SingleMemberResponse>(
    `/api/member/${memberId}`,
  );
  return response.data;
};

// delete member (hard delete)
export const deleteMemberPermanently = async (
  memberId: string,
): Promise<SingleMemberResponse> => {
  const response = await api.delete<SingleMemberResponse>(
    `/api/member/${memberId}/permanent`,
  );
  return response.data;
};
