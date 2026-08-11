import { Schema, model, type InferSchemaType } from "mongoose";

const membershipPlanSchema = new Schema(
  {
    membershipPlanId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    planName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    durationMonths: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    features: {
      type: [String],
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export type MembershipPlan = InferSchemaType<typeof membershipPlanSchema>;

const MembershipPlanModel = model<MembershipPlan>(
  "MembershipPlan",
  membershipPlanSchema,
);

export default MembershipPlanModel;
