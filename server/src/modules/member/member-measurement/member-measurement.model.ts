import { Schema, model, type InferSchemaType } from "mongoose";

const memberMeasurementSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
      trim: true,
      uppercase: true,
    },
    recordedDate: {
      type: Date,
      default: Date.now,
      index: true,
    },
    height: {
      type: Number,
      required: true,
      min: 0,
    },
    weight: {
      type: Number,
      required: true,
      min: 0,
    },
    bmi: {
      type: Number,
      required: true,
      min: 0,
    },
    bodyFat: {
      type: Number,
      min: 0,
    },
    muscleMass: {
      type: Number,
      min: 0,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

memberMeasurementSchema.index({ userId: 1, recordedDate: -1 });

export type MemberMeasurement = InferSchemaType<typeof memberMeasurementSchema>;

const MemberMeasurementModel = model<MemberMeasurement>(
  "MemberMeasurement",
  memberMeasurementSchema,
);

export default MemberMeasurementModel;
