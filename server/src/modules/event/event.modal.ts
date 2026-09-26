import { Schema, model, type InferSchemaType } from "mongoose";

export const EVENT_VISIBILITY = [
  "all",
  "member",
  "trainer",
  "private",
] as const;
export type EventVisibility = (typeof EVENT_VISIBILITY)[number];

const eventSchema = new Schema(
  {
    eventId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    title: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
      trim: true,
    },
    visibility: {
      type: String,
      enum: EVENT_VISIBILITY,
      default: "all",
      lowercase: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export type Event = InferSchemaType<typeof eventSchema>;

const EventModal = model<Event>("Event", eventSchema);

export const EventModel = EventModal;
export default EventModal;
