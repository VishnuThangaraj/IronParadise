import { z } from "zod";

const emptyStringToUndefined = z.preprocess(
  (val) => (val === "" || val === null ? undefined : val),
  z.string().optional(),
);

const emptyStringToDate = z.preprocess(
  (val) => (val === "" || val === null ? undefined : val),
  z.coerce.date().optional(),
);

export const emergencyContactSchema = z
  .preprocess(
    (val: any) => {
      if (!val || typeof val !== "object") return null;
      if (!val.fullName || !val.phone || !val.relation) return null;
      return val;
    },
    z
      .object({
        fullName: z.string().trim(),
        phone: z.string().trim(),
        relation: z.string().trim(),
      })
      .nullable()
      .optional(),
  );

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
    .min(2, "Name's too short — make it 2+ characters")
    .max(100, "Name's too long — keep it under 100"),
  email: z.string().email("Hmm, check that email again"),
  dob: emptyStringToDate,
  profileImage: emptyStringToUndefined,
  gender: z.enum(["male", "female", "other"], {
    message: "Pick a gender real quick",
  }),
  phone: emptyStringToUndefined,
  address: emptyStringToUndefined,
  permissions: z.array(permissionEnum).optional(),
  role: z.enum(["admin", "trainer", "member"]).optional(),
  emergencyContact: emergencyContactSchema,
});

export const userUpdateSchema = userSchema.partial().extend({
  isActive: z
    .boolean({ message: "Status looks off — pick active or inactive" })
    .optional(),
});

export type CreateUserInput = z.infer<typeof userSchema>;
export type UpdateUserInput = z.infer<typeof userUpdateSchema>;
export type EmergencyContactInput = z.infer<typeof emergencyContactSchema>;
