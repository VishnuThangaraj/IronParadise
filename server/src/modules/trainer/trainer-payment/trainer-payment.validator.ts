import { z } from "zod";

export const paymentStatusEnum = z.enum(
  ["PENDING", "PARTIAL", "PAID", "OVERDUE"],
  {
    message: "Status looks off — pick PENDING, PARTIAL, PAID, or OVERDUE",
  },
);

export const trainerPaymentSchema = z.object({
  userId: z.string().length(7, "User ID must be 7 characters long").trim(),
  salary: z.number().min(0),
  amountDue: z.number().min(0).default(0),
  amountPaid: z.number().min(0).default(0),
  paymentStatus: paymentStatusEnum.default("PENDING"),
});

export const createTrainerPaymentSchema = trainerPaymentSchema;

export const updateTrainerPaymentSchema = trainerPaymentSchema.partial();
export const updateTrainerPaymentReceiptSchema = updateTrainerPaymentSchema;

export type PaymentStatusInput = z.infer<typeof paymentStatusEnum>;
export type TrainerPaymentInput = z.infer<typeof trainerPaymentSchema>;
export type CreateTrainerPaymentInput = z.infer<
  typeof createTrainerPaymentSchema
>;
export type UpdateTrainerPaymentInput = z.infer<
  typeof updateTrainerPaymentSchema
>;
