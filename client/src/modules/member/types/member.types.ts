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

export interface MemberSelfDetails {
  user: User;
  assignment: MemberAssignment | null;
  membershipPlan?: any | null;
  trainer?: {
    userId: string;
    fullName: string;
    email: string;
    phone: string;
    profileImage: string;
    specialization: string[];
    experienceYears: number;
    qualification: string;
    shiftTime: { start: string; end: string };
    employmentStatus: string;
  } | null;
  workoutPlan?: any | null;
  dietPlan?: any | null;
  measurements?: any[];
}

export interface MemberSelfDetailsResponse {
  success: boolean;
  message: string;
  data: MemberSelfDetails;
}

export interface MemberAttendanceRecord {
  _id: string;
  attendanceId: string;
  userId: string;
  role: string;
  date: string;
  checkIn: string;
  checkOut: string | null;
  durationMinutes: number;
  status: string;
  entryMethod: string;
  notes?: string;
}

export interface MemberSelfAttendanceResponse {
  success: boolean;
  message: string;
  data: {
    records: MemberAttendanceRecord[];
    totalVisits: number;
    totalMinutes: number;
    averageMinutes: number;
  };
}

export interface MemberSelfTrainer {
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  profileImage: string;
  specialization: string[];
  experienceYears: number;
  qualification: string;
  shiftTime: { start: string; end: string };
  employmentStatus: string;
}

export interface MemberSelfTrainerResponse {
  success: boolean;
  message: string;
  data: MemberSelfTrainer | null;
}

export interface MemberSelfPlans {
  workoutPlan: any | null;
  dietPlan: any | null;
  assignmentStatus?: string;
  startDate?: string;
  endDate?: string;
}

export interface MemberSelfPlansResponse {
  success: boolean;
  message: string;
  data: MemberSelfPlans;
}

export interface MemberSelfPaymentItem {
  _id: string;
  userId: string;
  membershipPlanId: string;
  membershipPlanName?: string;
  amountDue: number;
  amountPaid: number;
  paymentStatus: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface MemberSelfReceiptItem {
  _id: string;
  receiptNumber: string;
  userId: string;
  amountPaid: number;
  paymentMethod: string;
  paymentDate: string;
  transactionReference?: string;
  notes?: string;
}

export interface MemberSelfPaymentsResponse {
  success: boolean;
  message: string;
  data: {
    payments: MemberSelfPaymentItem[];
    receipts: MemberSelfReceiptItem[];
  };
}


