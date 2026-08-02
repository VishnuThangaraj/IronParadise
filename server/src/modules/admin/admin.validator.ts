import { z } from "zod";

export const adminSchema = z.object({
  fullName: z
    .string()
    .min(5, "Name's too short — make it 5+ characters")
    .max(100, "Name's too long — keep it under 100"),
  email: z.email("Hmm, check that email again"),
  password: z.string().min(8, "Password's too short — make it 8+ characters"),
  profileImage: z.string().optional(),
  gender: z.enum(["male", "female", "other"], {
    message: "Pick a gender real quick",
  }),
  phone: z.string().optional(),
});

export const adminUpdateSchema = z.object({
  fullName: z
    .string()
    .min(5, "Name's too short — make it 5+ characters")
    .max(100, "Name's too long — keep it under 100")
    .optional(),
  email: z.email("Hmm, check that email again").optional(),
  gender: z
    .enum(["male", "female", "other"], {
      message: "Pick a gender real quick",
    })
    .optional(),
  phone: z.string().optional(),
  profileImage: z.string().optional(),
  isActive: z
    .boolean({ message: "Status looks off — pick active or inactive" })
    .optional(),
});

export type CreateAdminInput = z.infer<typeof adminSchema>;
export type UpdateAdminInput = z.infer<typeof adminUpdateSchema>;
