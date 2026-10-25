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
