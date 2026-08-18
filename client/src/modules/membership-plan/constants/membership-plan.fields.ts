import type { MembershipPlanFormData } from "../types/membership-plan.types";

export interface MembershipPlanField {
  label: string;
  name: keyof MembershipPlanFormData;
  type: string;
  placeholder: string;
  size?: number;
}

const membershipPlanFields: MembershipPlanField[] = [
  {
    label: "Plan Name",
    name: "planName",
    type: "text",
    placeholder: "e.g. Platinum Annual Pass",
    size: 100,
  },
  {
    label: "Duration (in Months)",
    name: "durationMonths",
    type: "number",
    placeholder: "Enter duration in months (e.g. 1, 3, 6, 12)",
    size: 50,
  },
  {
    label: "Price (in ₹)",
    name: "price",
    type: "number",
    placeholder: "Enter membership fee (e.g. 2999)",
    size: 50,
  },
];

export default membershipPlanFields;
