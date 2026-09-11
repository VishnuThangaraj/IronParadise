import { z } from "zod";

import { userSchema } from "../user/user.validator.js";
import {
  shiftTimeSchema,
  employmentStatusEnum,
} from "./trainer-details/trainer-details.validator.js";

const emptyStringToDate = z.preprocess(
  (val) => (val === "" || val === null ? undefined : val),
  z.coerce.date().optional(),
);

export const createTrainerSchema = userSchema.extend({
  role: z.enum(["trainer"]).optional().default("trainer"),
  salary: z
    .number()
    .min(0, "Salary cannot be negative")
    .optional()
    .default(0),
  joinDate: emptyStringToDate,
  experienceYears: z
    .number()
    .min(0, "Experience years cannot be negative")
    .optional()
    .default(0),
  specialization: z
    .array(z.string().trim())
    .optional()
    .default(["General"]),
  qualification: z.string().trim().optional().default("General"),
  shiftTime: shiftTimeSchema
    .optional()
    .default({ start: "09:00", end: "17:00" }),
  employmentStatus: employmentStatusEnum.optional().default("active"),
});

export const updateTrainerSchema = createTrainerSchema.partial();

export type CreateTrainerInput = z.infer<typeof createTrainerSchema>;
export type UpdateTrainerInput = z.infer<typeof updateTrainerSchema>;
