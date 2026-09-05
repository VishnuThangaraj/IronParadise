import { DayDiet } from "../types/diet-plan.types";


export const emptyDayDiet: DayDiet = {
  breakfast: [],
  lunch: [],
  dinner: [],
  snacks: [],
};

export interface DietPlanFormState {
  planName: string;
  goal: string;
  description: string;

  monday: DayDiet;
  tuesday: DayDiet;
  wednesday: DayDiet;
  thursday: DayDiet;
  friday: DayDiet;
  saturday: DayDiet;
  sunday: DayDiet;

  isActive: boolean;
}

export const initialDietPlanState: DietPlanFormState = {
  planName: "",
  goal: "",
  description: "",

  monday: { ...emptyDayDiet },
  tuesday: { ...emptyDayDiet },
  wednesday: { ...emptyDayDiet },
  thursday: { ...emptyDayDiet },
  friday: { ...emptyDayDiet },
  saturday: { ...emptyDayDiet },
  sunday: { ...emptyDayDiet },

  isActive: true,
};

export default initialDietPlanState;
