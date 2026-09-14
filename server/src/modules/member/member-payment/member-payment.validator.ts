import { z } from "zod";

export const memberPaymentStatusEnum = z.enum(
  ["PENDING", "PARTIAL", "PAID", "OVERDUE"],
  {
    message: "Status looks off — pick PENDING, PARTIAL, PAID, or OVERDUE",
  },
);

export const memberPaymentSchema = z.object({
  paymentId: z
    .string()
    .length(7, "Payment ID must be 7 characters long")
    .trim(),
  userId: z.string().length(7, "User ID must be 7 characters long").trim(),
  assignmentId: z
    .string()
    .length(7, "Assignment ID must be 7 characters long")
    .trim(),
  totalAmount: z.number().min(0, "Total amount cannot be negative"),
  amountPaid: z.number().min(0, "Amount paid cannot be negative").default(0),
  amountDue: z.number().min(0, "Amount due cannot be negative").default(0),
  dueDate: z.coerce.date({ message: "Invalid due date" }),
  paymentStatus: memberPaymentStatusEnum.default("PENDING"),
});

export const createMemberPaymentSchema = memberPaymentSchema.extend({
  paymentId: z
    .string()
    .length(7, "Payment ID must be 7 characters long")
    .trim()
    .optional(),
  amountPaid: z
    .number()
    .min(0, "Amount paid cannot be negative")
    .optional()
    .default(0),
  amountDue: z
    .number()
    .min(0, "Amount due cannot be negative")
    .optional()
    .default(0),
  paymentStatus: memberPaymentStatusEnum.optional().default("PENDING"),
});

export const updateMemberPaymentSchema = memberPaymentSchema.partial();

export type MemberPaymentStatusInput = z.infer<typeof memberPaymentStatusEnum>;
export type MemberPaymentInput = z.infer<typeof memberPaymentSchema>;
export type CreateMemberPaymentInput = z.infer<
  typeof createMemberPaymentSchema
>;
export type UpdateMemberPaymentInput = z.infer<
  typeof updateMemberPaymentSchema
>;