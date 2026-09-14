import { User } from "@/shared/types/User.types";
import {
  MemberAssignment,
  MemberAssignmentPayload,
} from "./member-assignment.types";

export interface Member extends User {
  assignment: MemberAssignment | null;
  password?: string;
}

export type MemberFormData = Omit<
  Member,
  | "_id"
  | "userId"
  | "createdAt"
  | "updatedAt"
  | "__v"
  | "profileImage"
  | "isActive"
  | "assignment"
> & {
  userId?: string;
  profileImage?: string;
  isActive?: boolean;
  password?: string;
  membershipPlanId?: string;
  dietPlanId?: string;
  workoutPlanId?: string;
  trainerId?: string;
  startDate?: string;
  endDate?: string;
  assignment?: MemberAssignmentPayload | null;
};

export type UpdateMemberRequest = Partial<MemberFormData>;

export interface MemberResponse {
  success: boolean;
  message: string;
  data: Member[];
}

export interface SingleMemberResponse {
  success: boolean;
  message: string;
  data: Member;
}

export interface MemberQueryParams {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export type {
  MemberAssignment,
  MemberAssignmentStatus,
  MemberAssignmentPayload,
} from "./member-assignment.types";

