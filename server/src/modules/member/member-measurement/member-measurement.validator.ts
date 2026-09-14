import { z } from "zod";

export const memberMeasurementSchema = z.object({
  userId: z.string().length(7, "User ID must be 7 characters long").trim(),
  recordedDate: z.coerce.date().optional(),
  height: z.number().positive("Height must be greater than 0"),
  weight: z.number().positive("Weight must be greater than 0"),
  bmi: z.number().min(0, "BMI cannot be negative").optional(),
  bodyFat: z.number().min(0, "Body fat cannot be negative").optional(),
  muscleMass: z.number().min(0, "Muscle mass cannot be negative").optional(),
  notes: z.string().trim().optional(),
});

export const createMemberMeasurementSchema = memberMeasurementSchema;
export const updateMemberMeasurementSchema = memberMeasurementSchema.partial();

export type MemberMeasurementInput = z.infer<typeof memberMeasurementSchema>;
export type CreateMemberMeasurementInput = z.infer<
  typeof createMemberMeasurementSchema
>;
export type UpdateMemberMeasurementInput = z.infer<
  typeof updateMemberMeasurementSchema
>;