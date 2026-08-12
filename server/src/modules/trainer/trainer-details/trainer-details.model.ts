import { Schema, model, type InferSchemaType } from "mongoose";

const trainerDetailsSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

    joinDate: {
      type: Date,
      default: Date.now,
    },

    experienceYears: {
      type: Number,
      default: 0,
      min: 0,
    },

    specialization: {
      type: [String],
      default: ["General"],
    },

    qualification: {
      type: String,
      required: true,
      trim: true,
    },

    shiftTime: {
      start: {
        type: String,
        required: true,
        trim: true,
      },
      end: {
        type: String,
        required: true,
        trim: true,
      },
    },

    employmentStatus: {
      type: String,
      enum: ["active", "inactive", "on_leave", "terminated"],
      default: "active",
    },
  },
  {
    timestamps: true,
  },
);

export type TrainerDetails = InferSchemaType<typeof trainerDetailsSchema>;

const TrainerDetailsModel = model<TrainerDetails>(
  "TrainerDetail",
  trainerDetailsSchema,
);

export default TrainerDetailsModel;
