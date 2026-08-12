import { z } from "zod";

import { userSchema, userUpdateSchema } from "../user/user.validator.js";

export const createTrainerSchema = userSchema.extend({
  role: z.enum(["trainer"]).optional().default("trainer"),
});

export const updateTrainerSchema = userUpdateSchema;

export type CreateTrainerInput = z.infer<typeof createTrainerSchema>;
export type UpdateTrainerInput = z.infer<typeof updateTrainerSchema>;
