import { Schema, model, type InferSchemaType } from "mongoose";

const memberAssignmentSchema = new Schema(
  {
    assignmentId: {
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
    membershipPlanId: {
      type: String,
      trim: true,
      uppercase: true,
      default: null,
    },
    dietPlanId: {
      type: String,
      trim: true,
      uppercase: true,
      default: null,
    },
    workoutPlanId: {
      type: String,
      trim: true,
      uppercase: true,
      default: null,
    },
    trainerId: {
      type: String,
      trim: true,
      uppercase: true,
      default: null,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "EXPIRED", "CANCELLED"],
      default: "ACTIVE",
    },
  },
  { timestamps: true },
);

export type MemberAssignment = InferSchemaType<typeof memberAssignmentSchema>;

const MemberAssignmentModel = model<MemberAssignment>(
  "MemberAssignment",
  memberAssignmentSchema,
);

export default MemberAssignmentModel;
