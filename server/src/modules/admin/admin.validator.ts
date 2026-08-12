import { z } from "zod";

import { userSchema, userUpdateSchema } from "../user/user.validator.js";

export const createAdminSchema = userSchema.extend({
  role: z.enum(["admin"]).optional().default("admin"),
});

export const updateAdminSchema = userUpdateSchema;

export type CreateAdminInput = z.infer<typeof createAdminSchema>;
export type UpdateAdminInput = z.infer<typeof updateAdminSchema>;
