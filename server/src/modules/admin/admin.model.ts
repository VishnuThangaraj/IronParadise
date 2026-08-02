import { Schema, model } from "mongoose";
import type { InferSchemaType } from "mongoose";

const adminSchema = new Schema(
  {
    adminId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
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

    role: {
      type: String,
      enum: ["admin"],
      default: "admin",
      immutable: true,
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

export type Admin = InferSchemaType<typeof adminSchema>;

const AdminModel = model<Admin>("Admin", adminSchema);

export default AdminModel;
