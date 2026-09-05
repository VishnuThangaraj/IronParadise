export interface MealItem {
  name: string;
  quantity: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface DayDiet {
  breakfast: MealItem[];
  lunch: MealItem[];
  dinner: MealItem[];
  snacks: MealItem[];
}

export type MealType = keyof DayDiet;

export interface MacroTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface DietPlan {
  _id: string;
  dietPlanId: string;
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
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export type DietPlanFormData = Omit<
  DietPlan,
  "_id" | "createdAt" | "updatedAt" | "__v"
>;

export type UpdateDietPlanRequest = Partial<DietPlanFormData>;

export interface DietPlanResponse {
  success: boolean;
  message: string;
  data: DietPlan[];
}

export interface SingleDietPlanResponse {
  success: boolean;
  message: string;
  data: DietPlan;
}
