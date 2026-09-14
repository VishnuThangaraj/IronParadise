import { z } from "zod";

export const memberPaymentMethodEnum = z.enum(
  ["UPI", "BANK_TRANSFER", "CASH", "CARD", "OTHER"],
  {
    message: "Payment method must be UPI, BANK_TRANSFER, CASH, CARD, or OTHER",
  },
);

export const memberPaymentReceiptSchema = z.object({
  receiptNumber: z.string().trim(),
  paymentId: z.string().trim(),
  userId: z.string().length(7, "User ID must be 7 characters long").trim(),
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
