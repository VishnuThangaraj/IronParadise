import { Schema, model } from "mongoose";
import type { InferSchemaType } from "mongoose";

const credentialSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    userType: {
      type: String,
      enum: ["admin", "trainer", "member"],
      required: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export type Credential = InferSchemaType<typeof credentialSchema>;

const CredentialModel = model<Credential>("Credential", credentialSchema);

export default CredentialModel;
