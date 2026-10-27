import { z } from "zod";

export const memberAssignmentStatusEnum = z.enum(
  ["ACTIVE", "EXPIRED", "CANCELLED"],
  { message: "Status looks off — pick active,expired or cancelled" },
);

const emptyStringToId = z.preprocess(
  (val) => (val === "" || val === null ? undefined : val),
  z.string().min(3, "Identifier must be at least 3 characters long").trim().optional(),
);

export const memberAssignmentSchema = z.object({
  assignmentId: z.string().min(3, "Assignment ID must be at least 3 characters long").trim(),
  userId: z.string().min(3, "User ID must be at least 3 characters long").trim(),
  membershipPlanId: emptyStringToId,
  dietPlanId: emptyStringToId,
  workoutPlanId: emptyStringToId,
  trainerId: emptyStringToId,
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  status: memberAssignmentStatusEnum.optional().default("ACTIVE"),
});

export const createMemberAssignmentSchema = memberAssignmentSchema.extend({
  assignmentId: z
    .string()
    .min(3, "Assignment ID must be at least 3 characters long")
    .trim()
    .optional(),
  membershipPlanId: emptyStringToId,
  dietPlanId: emptyStringToId,
  workoutPlanId: emptyStringToId,
  trainerId: emptyStringToId,
  endDate: z.coerce.date({ message: "End date is required" }),
});
export const updateMemberAssignmentSchema = memberAssignmentSchema.partial();

export type MemberAssignmentInput = z.infer<typeof memberAssignmentSchema>;
export type CreateMemberAssignmentInput = z.infer<
  typeof createMemberAssignmentSchema
>;
export type UpdateMemberAssignmentInput = z.infer<
  typeof updateMemberAssignmentSchema
>;
