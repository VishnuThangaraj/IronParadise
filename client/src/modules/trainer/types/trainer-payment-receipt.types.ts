export type PaymentMethods =
  "CASH" | "UPI" | "BANK_TRANSFER" | "CHEQUE" | "OTHER";

export interface TrainerPayment {
  _id: string;

  userId: string;
  receiptNumber: string;
  amount: string;
  paymentDate: string;
  paymentMethod: PaymentMethods;
  transactionId: string;
  salaryMonth: string;
  notes: string;

  createdAt: string;
  updatedAt: string;
  __v?: number;
}
