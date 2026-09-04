export const meals = ["breakfast", "lunch", "dinner", "snacks"] as const;

export type Meals = (typeof meals)[number];

export default meals;
