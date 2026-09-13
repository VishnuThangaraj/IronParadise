import { Schema, model, type InferSchemaType } from "mongoose";

const memberPaymentSchema = new Schema(
  {
    paymentId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
      trim: true,
      uppercase: true,
    },
    assignmentId: {
      type: String,
      required: true,
      index: true,
      trim: true,
      uppercase: true,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    amountPaid: {
      type: Number,
      default: 0,
      min: 0,
    },
    amountDue: {
      type: Number,
      default: 0,
      min: 0,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["PENDING", "PARTIAL", "PAID", "OVERDUE"],
      default: "PENDING",
    },
  },
  { timestamps: true },
);

export type MemberPayment = InferSchemaType<typeof memberPaymentSchema>;

const MemberPaymentModel = model<MemberPayment>(
  "MemberPayment",
  memberPaymentSchema,
);

export default MemberPaymentModel;
