import { z } from "zod";

export const workoutExerciseSchema = z.object({
  name: z.string().trim().min(1, "Exercise name's missing — add one"),
  sets: z.number().nonnegative().nullable().optional(),
  reps: z.string().trim().nullable().optional(),
  rest: z.string().trim().nullable().optional(),
  notes: z.string().trim().nullable().optional(),
});

export const dayWorkoutSchema = z.object({
  focus: z.string().trim().min(1, "Exercise focus's missing — add one"),
  exercises: z.array(workoutExerciseSchema).default([]),
});

export const workoutPlanSchema = z.object({
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
  description: z.string().trim().min(1, "Description cannot be empty").optional(),
  monday: dayWorkoutSchema.nullable().optional(),
  tuesday: dayWorkoutSchema.nullable().optional(),
  wednesday: dayWorkoutSchema.nullable().optional(),
  thursday: dayWorkoutSchema.nullable().optional(),
  friday: dayWorkoutSchema.nullable().optional(),
  saturday: dayWorkoutSchema.nullable().optional(),
  sunday: dayWorkoutSchema.nullable().optional(),
});

export const workoutPlanUpdateSchema = workoutPlanSchema.partial().extend({
  isActive: z
    .boolean({ message: "Status looks off — pick active or inactive" })
    .optional(),
});

export type CreateWorkoutPlanInput = z.infer<typeof workoutPlanSchema>;
export type UpdateWorkoutPlanInput = z.infer<typeof workoutPlanUpdateSchema>;
