import { z } from "zod";

export const paymentMethodEnum = z.enum(
  ["CASH", "UPI", "BANK_TRANSFER", "CHEQUE", "OTHER"],
  {
    message:
      "Payment method must be CASH, UPI, BANK_TRANSFER, CHEQUE, or OTHER",
  },
);

export const trainerPaymentReceiptSchema = z.object({
  userId: z.string().trim(),
  receiptNumber: z.string().trim(),
  amount: z.number().min(0),
  paymentDate: z.coerce.date().default(() => new Date()),
  paymentMethod: paymentMethodEnum,
  transactionId: z.string().trim().optional(),
  salaryMonth: z.string().trim(),
  notes: z.string().trim().max(500).optional(),
});

export const createTrainerPaymentReceiptSchema = trainerPaymentReceiptSchema.extend({
  receiptNumber: z.string().trim().optional(),
});
export const updateTrainerPaymentReceiptSchema =
  trainerPaymentReceiptSchema.partial();

export type PaymentMethodInput = z.infer<typeof paymentMethodEnum>;
export type TrainerPaymentReceiptInput = z.infer<
  typeof trainerPaymentReceiptSchema
>;
export type CreateTrainerPaymentReceiptInput = z.infer<
  typeof createTrainerPaymentReceiptSchema
>;
export type UpdateTrainerPaymentReceiptInput = z.infer<
  typeof updateTrainerPaymentReceiptSchema
>;
