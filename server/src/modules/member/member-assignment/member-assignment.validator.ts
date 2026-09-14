import { z } from "zod";

export const memberAssignmentStatusEnum = z.enum(
  ["ACTIVE", "EXPIRED", "CANCELLED"],
  { message: "Status looks off — pick active,expired or cancelled" },
);

export const memberAssignmentSchema = z.object({
  assignmentId: z
    .string()
    .length(7, "Assignment ID must be 7 characters long")
    .trim(),
  userId: z.string().length(7, "User ID must be 7 characters long").trim(),
  membershipPlanId: z
    .string()
    .length(7, "Membership Plan ID must be 7 characters long")
    .trim(),
  dietPlanId: z
    .string()
    .length(7, "Diet Plan ID must be 7 characters long")
    .trim(),
  workoutPlanId: z
    .string()
    .length(7, "Workout Plan ID must be 7 characters long")
    .trim(),

  trainerId: z
    .string()
    .length(7, "Trainer ID must be 7 characters long")
    .trim(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  status: memberAssignmentStatusEnum.optional().default("ACTIVE"),
});

export const createMemberAssignmentSchema = memberAssignmentSchema.extend({
  assignmentId: z
    .string()
    .length(7, "Assignment ID must be 7 characters long")
    .trim()
    .optional(),
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
