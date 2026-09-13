import { Schema, model, type InferSchemaType } from "mongoose";

const memberPaymentReceiptSchema = new Schema(
  {
    receiptNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    paymentId: {
      type: String,
      required: true,
      index: true,
      uppercase: true,
      trim: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
      uppercase: true,
      trim: true,
    },
    amountPaid: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentDate: {
      type: Date,
      default: Date.now,
    },
    paymentMethod: {
      type: String,
      enum: ["UPI", "BANK_TRANSFER", "CASH", "CARD", "OTHER"],
      required: true,
    },
    referenceNumber: {
      type: String,
      trim: true,
    },
    remarks: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export type MemberPaymentReceipt = InferSchemaType<
  typeof memberPaymentReceiptSchema
>;

const MemberPaymentReceiptModel = model<MemberPaymentReceipt>(
  "MemberPaymentReceipt",
  memberPaymentReceiptSchema,
);

export default MemberPaymentReceiptModel;
