import { z } from "zod";

import { userSchema } from "../user/user.validator.js";

const emptyStringToDate = z.preprocess(
  (val) => (val === "" || val === null ? undefined : val),
  z.coerce.date().optional(),
);

const emptyStringToId = z.preprocess(
  (val) => (val === "" || val === null ? undefined : val),
  z.string().min(3, "Identifier must be at least 3 characters long").trim().optional(),
);

export const memberAssignmentPayloadSchema = z.object({
  membershipPlanId: emptyStringToId,
  dietPlanId: emptyStringToId,
  workoutPlanId: emptyStringToId,
  trainerId: emptyStringToId,
  startDate: emptyStringToDate,
  endDate: emptyStringToDate,
});

export const createMemberSchema = userSchema.extend({
  role: z.enum(["member"]).optional().default("member"),
  membershipPlanId: emptyStringToId,
  dietPlanId: emptyStringToId,
  workoutPlanId: emptyStringToId,
  trainerId: emptyStringToId,
  startDate: emptyStringToDate,
  endDate: emptyStringToDate,
  assignment: memberAssignmentPayloadSchema.optional(),
});

export const updateMemberSchema = createMemberSchema.partial();

export type CreateMemberInput = z.infer<typeof createMemberSchema>;
export type UpdateMemberInput = z.infer<typeof updateMemberSchema>;
export type MemberAssignmentPayloadInput = z.infer<
  typeof memberAssignmentPayloadSchema
>;

