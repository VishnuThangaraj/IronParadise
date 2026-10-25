export type PaymentMethods =
  | "CASH"
  | "UPI"
  | "BANK_TRANSFER"
  | "CHEQUE"
  | "OTHER";

export interface TrainerPaymentReceipt {
  _id: string;
  userId: string;
  receiptNumber: string;
  amount: number;
  paymentDate: string;
  paymentMethod: PaymentMethods;
  transactionId?: string;
  salaryMonth: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface CreateTrainerPaymentReceiptPayload {
  userId: string;
  amount: number;
  paymentMethod: PaymentMethods;
  salaryMonth: string;
  paymentDate?: string | Date;
  transactionId?: string;
  notes?: string;
}

export interface TrainerPaymentReceiptResponse {
  success: boolean;
  message: string;
  data: TrainerPaymentReceipt[];
}

export interface SingleTrainerPaymentReceiptResponse {
  success: boolean;
  message: string;
  data: TrainerPaymentReceipt;
}
