import { WorkoutPlanFormData } from "../types/workout-plan.types";

export interface WorkoutPlanField {
  label: string;
  name: keyof WorkoutPlanFormData;
  type: string;
  placeholder: string;
  size?: number;
}

const workoutPlanFields: WorkoutPlanField[] = [
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

export default workoutPlanFields;
