import { Schema, model, type InferSchemaType } from "mongoose";

export const ENQUIRY_ROLES = [
  "trainer",
  "member",
  "visitor",
  "other",
] as const;

export type EnquiryRole = (typeof ENQUIRY_ROLES)[number];

const enquirySchema = new Schema(
  {
    enquiryId: {
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
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    role: {
      type: String,
      enum: ENQUIRY_ROLES,
      default: "visitor",
      lowercase: true,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    replied: {
      type: Boolean,
      default: false,
    },
    replyMessage: {
      subject: {
        type: String,
        trim: true,
      },
      message: {
        type: String,
        trim: true,
      },
      repliedAt: {
        type: Date,
      },
    },
  },
  { timestamps: true },
);

export type Enquiry = InferSchemaType<typeof enquirySchema>;

const EnquiryModel = model<Enquiry>("Enquiry", enquirySchema);

export default EnquiryModel;
