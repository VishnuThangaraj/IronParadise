import { Schema, model, type InferSchemaType } from "mongoose";

const emergencyContactSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    relation: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false },
);

const userSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    dob: {
      type: Date,
    },

    profileImage: {
      type: String,
      default: "",
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    address: {
      type: String,
      trim: true,
    },

    permissions: {
      type: [String],
      enum: [
        "admins",
        "events",
        "members",
        "trainers",
        "dietplans",
        "memberships",
        "workoutplans",
        "enquiry",
      ],
      default: ["members", "dietplans", "workoutplans"],
    },

    role: {
      type: String,
      enum: ["admin", "trainer", "member"],
      default: "member",
      immutable: true,
    },

    emergencyContact: {
      type: emergencyContactSchema,
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

export type User = InferSchemaType<typeof userSchema>;

const UserModel = model<User>("User", userSchema);

export default UserModel;
