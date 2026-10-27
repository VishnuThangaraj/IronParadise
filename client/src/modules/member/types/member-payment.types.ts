export type MemberPaymentStatus = "PENDING" | "PARTIAL" | "PAID" | "OVERDUE";

export type MemberPaymentMethod =
  | "UPI"
  | "BANK_TRANSFER"
  | "CASH"
  | "CARD"
  | "OTHER";

export interface EnrichedMembershipPlan {
  membershipPlanId: string;
  planName: string;
  price: number;
  durationMonths: number;
}

export interface EnrichedMemberAssignment {
  assignmentId: string;
  startDate: string;
  endDate: string;
  status: "ACTIVE" | "EXPIRED" | "CANCELLED";
}

export interface MemberPaymentItem {
  _id: string;
  paymentId: string;
  userId: string;
  assignmentId: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  profileImage?: string;
  gender?: string;
  isActive?: boolean;
  membershipPlan?: EnrichedMembershipPlan | null;
  assignment?: EnrichedMemberAssignment | null;
  totalAmount: number;
  amountPaid: number;
  amountDue: number;
  dueDate: string;
  paymentStatus: MemberPaymentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface MemberPaymentReceipt {
  _id: string;
  receiptNumber: string;
  paymentId: string;
  userId: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  profileImage?: string;
  planName?: string;
  amountPaid: number;
  paymentDate: string;
  paymentMethod: MemberPaymentMethod;
  referenceNumber?: string;
  remarks?: string;
  assignmentId?: string | null;
  totalAmount?: number | null;
  amountDue?: number | null;
  paymentStatus?: MemberPaymentStatus | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface RecordMemberPaymentPayload {
  paymentId: string;
  userId: string;
  amountPaid: number;
  paymentMethod: MemberPaymentMethod;
  referenceNumber?: string;
  remarks?: string;
  paymentDate?: string;
}

export interface MemberPaymentsResponse {
  success: boolean;
  message: string;
  data: MemberPaymentItem[];
}

export interface MemberPaymentReceiptsResponse {
  success: boolean;
  message: string;
  data: MemberPaymentReceipt[];
}

export interface SingleMemberPaymentReceiptResponse {
  success: boolean;
  message: string;
  data: MemberPaymentReceipt;
}
