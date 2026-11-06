import { User } from "@/shared/types/User.types";

export interface ShiftTime {
  start: string;
  end: string;
}

export interface Trainer extends User {
  joinDate: string;
  experienceYears: number;
  specialization: string[];
  qualification: string;
  shiftTime: ShiftTime;
  employmentStatus: "active" | "inactive" | "on_leave" | "terminated";
  salary: number;
  amountPaid?: number;
  amountDue?: number;
  paymentStatus?: "PENDING" | "PARTIAL" | "PAID" | "OVERDUE" | string;
}

export type TrainerFormData = Omit<
  Trainer,
  | "_id"
  | "userId"
  | "createdAt"
  | "updatedAt"
  | "__v"
  | "profileImage"
  | "isActive"
  | "joinDate"
> & {
  userId?: string;
  profileImage?: string;
  salary: number;
  isActive?: boolean;
  joinDate?: string;
};

export type UpdateTrainerRequest = Partial<TrainerFormData>;

export interface TrainerResponse {
  success: boolean;
  message: string;
  data: Trainer[];
}

export interface SingleTrainerResponse {
  success: boolean;
  message: string;
  data: Trainer;
}

export interface AssignedMemberItem {
  _id: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  profileImage: string;
  emergencyContact?: {
    fullName: string;
    phone: string;
    relation: string;
  };
  assignment?: {
    assignmentId: string;
    membershipPlanId?: string;
    workoutPlanId?: string;
    dietPlanId?: string;
    trainerId?: string;
    startDate: string;
    endDate: string;
    status: string;
  } | null;
  membershipPlan?: {
    planId: string;
    name: string;
    planName?: string;
    price: number;
  } | null;
  workoutPlan?: {
    planId: string;
    name: string;
    planName?: string;
    fitnessGoal?: string;
  } | null;
  dietPlan?: {
    planId: string;
    name: string;
    planName?: string;
    goal?: string;
  } | null;
  todayAttendance?: {
    status: string;
    checkIn: string;
    checkOut: string | null;
    durationMinutes: number;
  } | null;
}

export interface AssignedMembersResponse {
  success: boolean;
  message: string;
  data: {
    members: AssignedMemberItem[];
    totalCount: number;
  };
}

export interface AssignedAttendanceRecord {
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
  fullName: string;
  email: string;
  phone: string;
  profileImage: string;
}

export interface AssignedMembersAttendanceResponse {
  success: boolean;
  message: string;
  data: {
    records: AssignedAttendanceRecord[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    };
  };
}

export interface TrainerPayrollResponse {
  success: boolean;
  message: string;
  data: {
    payment: {
      userId: string;
      salary: number;
      amountDue: number;
      amountPaid: number;
      paymentStatus: string;
      lastAccruedMonth?: string;
    } | null;
    receipts: any[];
  };
}
