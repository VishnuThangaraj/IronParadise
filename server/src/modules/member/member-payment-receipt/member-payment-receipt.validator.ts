import { z } from "zod";

export const memberPaymentMethodEnum = z.enum(
  ["UPI", "BANK_TRANSFER", "CASH", "CARD", "OTHER"],
  {
    message: "Payment method must be UPI, BANK_TRANSFER, CASH, CARD, or OTHER",
  },
);

export const memberPaymentReceiptSchema = z.object({
  receiptNumber: z.string().min(3, "Receipt number must be valid").trim(),
  paymentId: z.string().min(3, "Payment ID must be valid").trim(),
  userId: z.string().min(3, "User ID must be valid").trim(),
  amountPaid: z.number().positive("Amount paid must be greater than 0"),
  paymentDate: z.coerce.date().optional(),
  paymentMethod: memberPaymentMethodEnum,
  referenceNumber: z.string().trim().optional(),
  remarks: z.string().trim().optional(),
});

export const createMemberPaymentReceiptSchema =
  memberPaymentReceiptSchema.extend({
    receiptNumber: z.string().trim().optional(),
  });

export const updateMemberPaymentReceiptSchema =
  memberPaymentReceiptSchema.partial();

export type MemberPaymentMethodInput = z.infer<typeof memberPaymentMethodEnum>;
export type MemberPaymentReceiptInput = z.infer<
  typeof memberPaymentReceiptSchema
>;
export type CreateMemberPaymentReceiptInput = z.infer<
  typeof createMemberPaymentReceiptSchema
>;
export type UpdateMemberPaymentReceiptInput = z.infer<
  typeof updateMemberPaymentReceiptSchema
>;
