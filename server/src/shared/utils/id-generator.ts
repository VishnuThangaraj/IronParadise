import CounterModel from "../models/counter.model.js";

const PREFIX = {
  event: "EVT",
  admin: "ADM",
  member: "MBR",
  enquiry: "ENQ",
  payment: "PAY",
  trainer: "TRN",
  dietPlan: "DPL",
  assignment: "MAS",
  workoutPlan: "WPL",
  memberPayment: "MPY",
  memberReceipt: "MPR",
  membershipPlan: "MPL",
  trainerReceipt: "TPR",
} as const;

export type Role = keyof typeof PREFIX;
export type PaymentReceiptRole = "memberReceipt" | "trainerReceipt";

export async function generateId(role: Role): Promise<string> {
  if (role === "memberReceipt" || role === "trainerReceipt") {
    return generatePaymentId(role);
  }

  const counter = await CounterModel.findByIdAndUpdate(
    role,
    {
      $inc: {
        sequence: 1,
      },
    },
    {
      upsert: true,
      returnDocument: "after",
    },
  );

  const number = String(counter.sequence).padStart(3, "0");

  return `${PREFIX[role]}-${number}`;
}

export async function generatePaymentId(
  role: PaymentReceiptRole,
): Promise<string> {
  const counter = await CounterModel.findByIdAndUpdate(
    role,
    {
      $inc: {
        sequence: 1,
      },
    },
    {
      upsert: true,
      returnDocument: "after",
    },
  );

  const number = String(counter.sequence).padStart(5, "0");

  return `${PREFIX[role]}-${number}`;
}
