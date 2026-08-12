import { Schema, model, type InferSchemaType } from "mongoose";

const trainerPaymentReceiptSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      index: true,
    },

    receiptNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentDate: {
      type: Date,
      required: true,
      default: Date.now,
    },

    paymentMethod: {
      type: String,
      enum: ["CASH", "UPI", "BANK_TRANSFER", "CHEQUE", "OTHER"],
      required: true,
    },

    transactionId: {
      type: String,
      trim: true,
    },

    salaryMonth: {
      type: String,
      required: true,
    },

    notes: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  },
);

export type TrainerPaymentReceipt = InferSchemaType<
  typeof trainerPaymentReceiptSchema
>;

const TrainerPaymentReceiptModel = model<TrainerPaymentReceipt>(
  "TrainerPaymentReceipt",
  trainerPaymentReceiptSchema,
);

export default TrainerPaymentReceiptModel;
