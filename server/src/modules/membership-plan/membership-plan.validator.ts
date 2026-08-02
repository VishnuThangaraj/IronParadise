import { z } from "zod";

export const membershipPlanSchema = z.object({
  planName: z
    .string()
    .min(1, "Plan name's missing — add one")
    .max(100, "Plan name's too long — shorten it a bit"),
  durationMonths: z
    .number()
    .int("Duration needs a whole number")
    .positive("Duration's too low — keep it above 0"),
  price: z.number().positive("Price's too low — keep it above 0"),
  features: z
    .array(z.string().trim().min(1, "Feature's missing — add one"))
    .optional(),
});

export const membershipPlanUpdateSchema = membershipPlanSchema
  .partial()
  .extend({
    isActive: z
      .boolean({ message: "Status looks off — pick active or inactive" })
      .optional(),
  });

export type CreateMembershipPlanInput = z.infer<typeof membershipPlanSchema>;
export type UpdateMembershipPlanInput = z.infer<
  typeof membershipPlanUpdateSchema
>;
