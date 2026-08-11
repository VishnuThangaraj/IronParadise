import { Schema, model } from "mongoose";
import type { InferSchemaType } from "mongoose";

const counterSchema = new Schema(
  {
    _id: {
      type: String,
      required: true,
      trim: true,
    },
    sequence: {
      type: Number,
      default: 0,
    },
  },
  {
    collection: "counters",
    versionKey: false,
    timestamps: false,
  },
);

export type Counter = InferSchemaType<typeof counterSchema>;

const CounterModel = model<Counter>("Counter", counterSchema);

export default CounterModel;
