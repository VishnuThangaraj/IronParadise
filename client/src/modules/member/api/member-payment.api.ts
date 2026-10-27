import api from "@/shared/service/api";
import type {
  MemberPaymentsResponse,
  MemberPaymentReceiptsResponse,
  SingleMemberPaymentReceiptResponse,
  RecordMemberPaymentPayload,
} from "../types/member-payment.types";

/**
 * Fetch all member payments enriched with user, assignment and plan info
 */
export const getMemberPayments = async (params?: {
  paymentStatus?: string;
  membershipPlanId?: string;
  search?: string;
}): Promise<MemberPaymentsResponse> => {
  const response = await api.get<MemberPaymentsResponse>("/api/member/payment", {
    params,
  });
  return response.data;
};

/**
 * Record a member payment receipt (fee payment & dues clearance)
 */
export const recordMemberPayment = async (
  payload: RecordMemberPaymentPayload,
): Promise<SingleMemberPaymentReceiptResponse> => {
  const response = await api.post<SingleMemberPaymentReceiptResponse>(
    "/api/member/payment/pay",
    payload,
  );
  return response.data;
};

/**
 * Fetch all payment receipts (or filtered by userId/paymentId)
 */
export const getMemberPaymentReceipts = async (params?: {
  userId?: string;
  paymentId?: string;
}): Promise<MemberPaymentReceiptsResponse> => {
  const response = await api.get<MemberPaymentReceiptsResponse>(
    "/api/member/payment/receipts",
    { params },
  );
  return response.data;
};

/**
 * Fetch receipts for a specific member by ID
 */
export const getMemberReceiptsByUserId = async (
  userId: string,
): Promise<MemberPaymentReceiptsResponse> => {
  const response = await api.get<MemberPaymentReceiptsResponse>(
    `/api/member/${userId}/receipts`,
  );
  return response.data;
};
