import { z } from "zod";

const emptyStringToUndefined = z.preprocess(
  (val) => (typeof val === "string" && val.trim() === "" ? undefined : val),
  z.string().trim().optional(),
);

export const workoutExerciseSchema = z.object({
  name: z.string().trim().min(1, "Exercise name's missing — add one"),
  sets: z.coerce.number().nonnegative().nullable().optional(),
  reps: z.string().trim().nullable().optional(),
  rest: z.string().trim().nullable().optional(),
  notes: z.string().trim().nullable().optional(),
});

export const dayWorkoutSchema = z
  .object({
    focus: z.string().trim().optional().nullable(),
    exercises: z.array(workoutExerciseSchema).default([]),
  })
  .transform((data) => {
    const focusTrimmed = data.focus?.trim();
    const defaultFocus =
      data.exercises.length > 0 ? "Workout Session" : "Rest & Recovery";
    return {
      focus:
        focusTrimmed && focusTrimmed.length > 0 ? focusTrimmed : defaultFocus,
      exercises: data.exercises,
    };
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
  description: emptyStringToUndefined,
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
