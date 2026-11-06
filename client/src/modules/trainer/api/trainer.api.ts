import api from "@/shared/service/api";
import type {
  TrainerFormData,
  TrainerResponse,
  UpdateTrainerRequest,
  SingleTrainerResponse,
  AssignedMembersResponse,
  AssignedMembersAttendanceResponse,
  TrainerPayrollResponse,
} from "../types/trainer.types";
import type { TrainerDashboardResponse } from "@/modules/dashboard/types/dashboard.types";
import type {
  CreateTrainerPaymentReceiptPayload,
  SingleTrainerPaymentReceiptResponse,
  TrainerPaymentReceiptResponse,
} from "../types/trainer-payment-receipt.types";

// get all trainer
export const getTrainers = async (): Promise<TrainerResponse> => {
  const response = await api.get<TrainerResponse>("/api/trainer");
  return response.data;
};

// get trainer by id
export const getTrainerById = async (
  trainerId: string,
): Promise<SingleTrainerResponse> => {
  const response = await api.get<SingleTrainerResponse>(
    `/api/trainer/${trainerId}`,
  );
  return response.data;
};

// create trainer
export const createTrainer = async (
  trainerData: TrainerFormData,
): Promise<SingleTrainerResponse> => {
  const response = await api.post<SingleTrainerResponse>(
    "/api/trainer/",
    trainerData,
  );
  return response.data;
};

// update trainer
export const updateTrainer = async (
  trainerId: string,
  trainerData: UpdateTrainerRequest,
): Promise<SingleTrainerResponse> => {
  const response = await api.patch<SingleTrainerResponse>(
    `/api/trainer/${trainerId}`,
    trainerData,
  );
  return response.data;
};

// delete trainer (soft delete)
export const deleteTrainer = async (
  trainerId: string,
): Promise<SingleTrainerResponse> => {
  const response = await api.delete<SingleTrainerResponse>(
    `/api/trainer/${trainerId}`,
  );
  return response.data;
};

// delete trainer (hard delete)
export const deleteTrainerPermanently = async (
  trainerId: string,
): Promise<SingleTrainerResponse> => {
  const response = await api.delete<SingleTrainerResponse>(
    `/api/trainer/${trainerId}/permanent`,
  );
  return response.data;
};

// record trainer payment (salary payout)
export const recordTrainerPayment = async (
  payload: CreateTrainerPaymentReceiptPayload,
): Promise<SingleTrainerPaymentReceiptResponse> => {
  const response = await api.post<SingleTrainerPaymentReceiptResponse>(
    "/api/trainer/payroll/pay",
    payload,
  );
  return response.data;
};

// get all payment receipts (or filtered by userId)
export const getTrainerPaymentReceipts = async (
  userId?: string,
): Promise<TrainerPaymentReceiptResponse> => {
  const response = await api.get<TrainerPaymentReceiptResponse>(
    "/api/trainer/payroll/receipts",
    {
      params: userId ? { userId } : undefined,
    },
  );
  return response.data;
};

// get trainer receipts by userId
export const getTrainerReceiptsByUserId = async (
  userId: string,
): Promise<TrainerPaymentReceiptResponse> => {
  const response = await api.get<TrainerPaymentReceiptResponse>(
    `/api/trainer/${userId}/receipts`,
  );
  return response.data;
};

// Trainer Dashboard Overview
export const getTrainerDashboardOverview = async (): Promise<TrainerDashboardResponse> => {
  const response = await api.get<TrainerDashboardResponse>(
    "/api/dashboard/trainer",
  );
  return response.data;
};

// Trainer Assigned Members
export const getTrainerAssignedMembers = async (params?: {
  search?: string;
  status?: string;
}): Promise<AssignedMembersResponse> => {
  const response = await api.get<AssignedMembersResponse>(
    "/api/trainer/my/assigned-members",
    { params },
  );
  return response.data;
};

// Trainer Assigned Members Attendance
export const getAssignedMembersAttendance = async (params?: {
  memberId?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  page?: number;
  limit?: number;
}): Promise<AssignedMembersAttendanceResponse> => {
  const response = await api.get<AssignedMembersAttendanceResponse>(
    "/api/trainer/my/assigned-members/attendance",
    { params },
  );
  return response.data;
};

// Trainer Self Payroll
export const getTrainerSelfPayroll = async (): Promise<TrainerPayrollResponse> => {
  const response = await api.get<TrainerPayrollResponse>(
    "/api/trainer/my/payroll",
  );
  return response.data;
};
