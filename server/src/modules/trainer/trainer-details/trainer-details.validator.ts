import { z } from "zod";

export const shiftTimeSchema = z.object({
  start: z.string().trim().optional().default("09:00"),
  end: z.string().trim().optional().default("17:00"),
});

export const employmentStatusEnum = z.enum(
  ["active", "inactive", "on_leave", "terminated"],
  {
    message:
      "Status looks off — pick active, inactive, on_leave, or terminated",
  },
);

export const trainerDetailsSchema = z.object({
  userId: z.string().length(7, "User ID must be 7 characters long").trim(),
  joinDate: z.coerce.date().optional(),
  experienceYears: z
    .number()
    .min(0, "Experience years cannot be negative")
    .optional()
    .default(0),
  specialization: z
    .array(z.string().trim())
    .optional()
    .default(["General"]),
  qualification: z
    .string()
    .trim()
    .optional()
    .default("General"),
  shiftTime: shiftTimeSchema,
  employmentStatus: employmentStatusEnum.optional().default("active"),
});

export const createTrainerDetailsSchema = trainerDetailsSchema;

export const updateTrainerDetailsSchema = trainerDetailsSchema.partial();

export type ShiftTimeInput = z.infer<typeof shiftTimeSchema>;
export type TrainerDetailsInput = z.infer<typeof trainerDetailsSchema>;
export type CreateTrainerDetailsInput = z.infer<
  typeof createTrainerDetailsSchema
>;
export type UpdateTrainerDetailsInput = z.infer<
  typeof updateTrainerDetailsSchema
>;
