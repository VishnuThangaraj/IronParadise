import { z } from "zod";

import { userSchema, userUpdateSchema } from "../user/user.validator.js";

export const createMemberSchema = userSchema.extend({
  role: z.enum(["member"]).optional().default("member"),
});

export const updateMemberSchema = userUpdateSchema;

export type CreateMemberInput = z.infer<typeof createMemberSchema>;
export type UpdateMemberInput = z.infer<typeof updateMemberSchema>;
