import { z } from "zod";

const emptyStringToUndefined = z.preprocess(
  (val) => (val === "" || val === null ? undefined : val),
  z.string().optional(),
);

export const enquiryRoleEnum = z.enum(
  ["trainer", "member", "visitor", "other"],
  { message: "Role looks off — pick trainer, member, visitor, or other" },
);

export const enquiryReplySchema = z.object({
  subject: z
    .string()
    .trim()
    .min(1, "Reply subject cannot be empty")
    .max(200, "Subject is too long"),
  message: z
    .string()
    .trim()
    .min(1, "Reply message cannot be empty")
    .max(5000, "Reply message is too long"),
});

export const enquirySchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Name's too short — make it 2+ characters")
    .max(100, "Name's too long — keep it under 100"),
  email: z
    .string()
    .trim()
    .email("Hmm, check that email again"),
  phone: emptyStringToUndefined,
  role: enquiryRoleEnum.default("visitor"),
  subject: z
    .string()
    .trim()
    .min(2, "Subject's too short — add at least 2 characters")
    .max(200, "Subject's too long — keep it under 200"),
  message: z
    .string()
    .trim()
    .min(5, "Message's too short — add at least 5 characters")
    .max(5000, "Message's too long — keep it under 5000"),
});

export const enquiryUpdateSchema = enquirySchema.partial().extend({
  replied: z.boolean().optional(),
  replyMessage: enquiryReplySchema.optional(),
});

export type EnquiryRole = z.infer<typeof enquiryRoleEnum>;
export type CreateEnquiryInput = z.infer<typeof enquirySchema>;
export type UpdateEnquiryInput = z.infer<typeof enquiryUpdateSchema>;
export type ReplyEnquiryInput = z.infer<typeof enquiryReplySchema>;
