import { Schema, model, type InferSchemaType } from "mongoose";

const messageSchema = new Schema(
  {
    messageId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    subject: {
      type: String,
      trim: true,
      required: true,
    },
    message: {
      type: String,
      trim: true,
      required: true,
    },
  },
  { timestamps: true },
);

export type Message = InferSchemaType<typeof messageSchema>;

const MessageModel = model<Message>("Message", messageSchema);

export default MessageModel;
