import { z } from "zod";

export const memberPaymentStatusEnum = z.enum(
  ["PENDING", "PARTIAL", "PAID", "OVERDUE"],
  {
    message: "Status looks off — pick PENDING, PARTIAL, PAID, or OVERDUE",
  },
);

export const memberPaymentSchema = z.object({
  paymentId: z.string().min(3, "Payment ID must be valid").trim(),
  userId: z.string().min(3, "User ID must be valid").trim(),
  assignmentId: z.string().min(3, "Assignment ID must be valid").trim(),
  totalAmount: z.number().min(0, "Total amount cannot be negative"),
  amountPaid: z.number().min(0, "Amount paid cannot be negative").default(0),
  amountDue: z.number().min(0, "Amount due cannot be negative").default(0),
  dueDate: z.coerce.date({ message: "Invalid due date" }),
  paymentStatus: memberPaymentStatusEnum.default("PENDING"),
});

export const createMemberPaymentSchema = memberPaymentSchema.extend({
  paymentId: z
    .string()
    .min(3, "Payment ID must be valid")
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