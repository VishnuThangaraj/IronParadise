export interface TrainerPayment {
  _id: string;

  userId: string;
  salary: string;
  amountDue: string;
  amountPaid: string;
  paymentStatus: string;

  createdAt: string;
  updatedAt: string;
  __v?: number;
}
