import type { MealType } from "../types/diet-plan.types";

export const meals: readonly MealType[] = [
  "breakfast",
  "lunch",
  "dinner",
  "snacks",
] as const;

export type Meals = MealType;

export default meals;
