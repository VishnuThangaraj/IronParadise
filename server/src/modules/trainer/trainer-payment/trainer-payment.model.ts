import { Schema, model, type InferSchemaType } from "mongoose";

const trainerPaymentSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

    salary: {
      type: Number,
      required: true,
      min: 0,
    },

    amountDue: {
      type: Number,
      default: 0,
      min: 0,
    },

    amountPaid: {
      type: Number,
      default: 0,
      min: 0,
    },

    paymentStatus: {
      type: String,
      enum: ["PENDING", "PARTIAL", "PAID", "OVERDUE"],
      default: "PENDING",
    },

    lastAccruedMonth: {
      type: String,
      default: null,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export type TrainerPayment = InferSchemaType<typeof trainerPaymentSchema>;

const TrainerPaymentModel = model<TrainerPayment>(
  "TrainerPayment",
  trainerPaymentSchema,
);

export default TrainerPaymentModel;
