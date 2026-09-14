export type MemberAssignmentStatus = "ACTIVE" | "EXPIRED" | "CANCELLED";

export interface MemberAssignment {
  _id: string;
  assignmentId: string;
  userId: string;
  membershipPlanId?: string | null;
  dietPlanId?: string | null;
  workoutPlanId?: string | null;
  trainerId?: string | null;
  startDate: string;
  endDate: string;
  status: MemberAssignmentStatus;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface MemberAssignmentPayload {
  membershipPlanId?: string;
  dietPlanId?: string;
  workoutPlanId?: string;
  trainerId?: string;
  startDate?: string;
  endDate?: string;
}

export type MemberAssignmentFormData = Omit<
  MemberAssignment,
  "_id" | "assignmentId" | "createdAt" | "updatedAt" | "__v"
> & {
  assignmentId?: string;
  membershipPlanId?: string | null;
  dietPlanId?: string | null;
  workoutPlanId?: string | null;
  trainerId?: string | null;
  startDate?: string;
  endDate?: string;
  status?: MemberAssignmentStatus;
};

export type UpdateMemberAssignmentRequest = Partial<MemberAssignmentFormData>;

export interface MemberAssignmentResponse {
  success: boolean;
  message: string;
  data: MemberAssignment[];
}

export interface SingleMemberAssignmentResponse {
  success: boolean;
  message: string;
  data: MemberAssignment;
}
