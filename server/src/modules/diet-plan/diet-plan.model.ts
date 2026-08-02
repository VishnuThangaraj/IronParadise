import { Schema, model, type InferSchemaType } from "mongoose";

const mealItemSchema = new Schema(
  {
    name: { type: String, required: true },
    quantity: { type: String, default: null },
    calories: { type: Number, default: null },
    protein: { type: Number, default: null },
    carbs: { type: Number, default: null },
    fat: { type: Number, default: null },
  },
  { _id: false }
);

const dayDietSchema = new Schema(
  {
    breakfast: { type: [mealItemSchema], default: [] },
    lunch: { type: [mealItemSchema], default: [] },
    dinner: { type: [mealItemSchema], default: [] },
    snacks: { type: [mealItemSchema], default: [] },
  },
  { _id: false }
);

const dietPlanSchema = new Schema(
  {
    dietPlanId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    planName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    goal: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    monday: { type: dayDietSchema, default: () => ({}) },
    tuesday: { type: dayDietSchema, default: () => ({}) },
    wednesday: { type: dayDietSchema, default: () => ({}) },
    thursday: { type: dayDietSchema, default: () => ({}) },
    friday: { type: dayDietSchema, default: () => ({}) },
    saturday: { type: dayDietSchema, default: () => ({}) },
    sunday: { type: dayDietSchema, default: () => ({}) },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export type DietPlan = InferSchemaType<typeof dietPlanSchema>;

const DietPlanModel = model<DietPlan>("DietPlan", dietPlanSchema);

export default DietPlanModel;
