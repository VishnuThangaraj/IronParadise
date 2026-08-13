import { z } from "zod";

export const emergencyContactSchema = z.object({
  fullName: z
    .string()
    .min(1, "Emergency contact name's missing — add one")
    .max(100, "Emergency contact name's too long — keep it under 100"),
  phone: z.string().min(1, "Emergency contact phone's missing — add one"),
  relation: z.string().min(1, "Emergency contact relation's missing — add one"),
});

export const permissionEnum = z.enum([
  "admins",
  "events",
  "members",
  "trainers",
  "dietplans",
  "memberships",
  "workoutplans",
  "enquiry",
]);

export const userSchema = z.object({
  fullName: z
    .string()
    .min(5, "Name's too short — make it 5+ characters")
    .max(100, "Name's too long — keep it under 100"),
  email: z.email("Hmm, check that email again"),
  dob: z.coerce.date().optional(),
  profileImage: z.string().optional(),
  gender: z.enum(["male", "female", "other"], {
    message: "Pick a gender real quick",
  }),
  phone: z.string().optional(),
  address: z.string().optional(),
  permissions: z.array(permissionEnum).optional(),
  role: z.enum(["admin", "trainer", "member"]).optional(),
  emergencyContact: emergencyContactSchema.optional(),
});

export const userUpdateSchema = userSchema.partial().extend({
  isActive: z
    .boolean({ message: "Status looks off — pick active or inactive" })
    .optional(),
});

export type CreateUserInput = z.infer<typeof userSchema>;
export type UpdateUserInput = z.infer<typeof userUpdateSchema>;
export type EmergencyContactInput = z.infer<typeof emergencyContactSchema>;
