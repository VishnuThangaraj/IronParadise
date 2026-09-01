import { DayDiet } from "../types/diet-plan.types";

export interface DietPlanFormState {
  planName: string;
  goal: string;
  description: string;

  monday: DayDiet[];
  tuesday: DayDiet[];
  wednesday: DayDiet[];
  thursday: DayDiet[];
  friday: DayDiet[];
  saturday: DayDiet[];
  sunday: DayDiet[];

  isActive: boolean;
}

export const initialDietPlanState: DietPlanFormState = {
  planName: "",
  goal: "",
  description: "",

  monday: [],
  tuesday: [],
  wednesday: [],
  thursday: [],
  friday: [],
  saturday: [],
  sunday: [],

  isActive: true,
};

export default initialDietPlanState;
