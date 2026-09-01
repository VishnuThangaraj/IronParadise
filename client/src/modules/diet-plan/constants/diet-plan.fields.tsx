import { DietPlanFormData } from "../types/diet-plan.types";

export interface DietPlanField {
  label: string;
  name: keyof DietPlanFormData;
  type: string;
  placeholder: string;
  size?: number;
}

const dietPlanFields: DietPlanField[] = [
  {
    label: "Plan Name",
    name: "planName",
    type: "text",
    placeholder: "e.g. Intermediate Fasting",
    size: 100,
  },
  {
    label: "Goal",
    name: "goal",
    type: "text",
    placeholder: "e.g. goal",
    size: 50,
  },
  {
    label: "Description",
    name: "description",
    type: "text",
    placeholder: "e.g. goal",
    size: 50,
  },
];

export default dietPlanFields;
