import { z } from "zod";

import { userSchema } from "../user/user.validator.js";

const emptyStringToDate = z.preprocess(
  (val) => (val === "" || val === null ? undefined : val),
  z.coerce.date().optional(),
);

export const memberAssignmentPayloadSchema = z.object({
  membershipPlanId: z
    .string()
    .length(7, "Membership Plan ID must be 7 characters long")
    .trim()
    .optional(),
  dietPlanId: z
    .string()
    .length(7, "Diet Plan ID must be 7 characters long")
    .trim()
    .optional(),
  workoutPlanId: z
    .string()
    .length(7, "Workout Plan ID must be 7 characters long")
    .trim()
    .optional(),
  trainerId: z
    .string()
    .length(7, "Trainer ID must be 7 characters long")
    .trim()
    .optional(),
  startDate: emptyStringToDate,
  endDate: emptyStringToDate,
});

export const createMemberSchema = userSchema.extend({
  role: z.enum(["member"]).optional().default("member"),
  membershipPlanId: z
    .string()
    .length(7, "Membership Plan ID must be 7 characters long")
    .trim()
    .optional(),
  dietPlanId: z
    .string()
    .length(7, "Diet Plan ID must be 7 characters long")
    .trim()
    .optional(),
  workoutPlanId: z
    .string()
    .length(7, "Workout Plan ID must be 7 characters long")
    .trim()
    .optional(),
  trainerId: z
    .string()
    .length(7, "Trainer ID must be 7 characters long")
    .trim()
    .optional(),
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

