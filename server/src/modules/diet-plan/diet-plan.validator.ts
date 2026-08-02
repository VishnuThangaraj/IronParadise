import { z } from "zod";

export const mealItemSchema = z.object({
  name: z.string().trim().min(1, "Meal name's missing — add one"),
  quantity: z.string().trim().nullable().optional(),
  calories: z.number().nonnegative("Calories can't be negative").nullable().optional(),
  protein: z.number().nonnegative("Protein can't be negative").nullable().optional(),
  carbs: z.number().nonnegative("Carbs can't be negative").nullable().optional(),
  fat: z.number().nonnegative("Fat can't be negative").nullable().optional(),
});

export const dayDietSchema = z.object({
  breakfast: z.array(mealItemSchema).default([]),
  lunch: z.array(mealItemSchema).default([]),
  dinner: z.array(mealItemSchema).default([]),
  snacks: z.array(mealItemSchema).default([]),
});

export const dietPlanSchema = z.object({
  planName: z
    .string()
    .trim()
    .min(1, "Plan name's missing — add one")
    .max(100, "Plan name's too long — shorten it a bit"),
  goal: z
    .string()
    .trim()
    .min(1, "Plan goal's missing — add one")
    .max(100, "Plan goal's too long — shorten it a bit"),
  description: z.string().trim().optional(),
  monday: dayDietSchema.optional(),
  tuesday: dayDietSchema.optional(),
  wednesday: dayDietSchema.optional(),
  thursday: dayDietSchema.optional(),
  friday: dayDietSchema.optional(),
  saturday: dayDietSchema.optional(),
  sunday: dayDietSchema.optional(),
});

export const dietPlanUpdateSchema = dietPlanSchema.partial().extend({
  isActive: z
    .boolean({ message: "Status looks off — pick active or inactive" })
    .optional(),
});

export type CreateDietPlanInput = z.infer<typeof dietPlanSchema>;
export type UpdateDietPlanInput = z.infer<typeof dietPlanUpdateSchema>;

