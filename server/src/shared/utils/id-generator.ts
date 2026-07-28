import CounterModel from "../models/counter.model.js";

const PREFIX = {
  admin: "ADM",
  trainer: "TRN",
  member: "MBR",
} as const;

export type Role = keyof typeof PREFIX;

export async function generateId(role: Role): Promise<string> {
  const counter = await CounterModel.findByIdAndUpdate(
    role,
    {
      $inc: {
        sequence: 1,
      },
    },
    {
      upsert: true,
      new: true,
    },
  );

  const number = String(counter.sequence).padStart(3, "0");

  return `${PREFIX[role]}-${number}`;
}
