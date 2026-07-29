import { z } from "zod";

export const adminSchema = z.object({
  fullName: z.string().min(3),
  email: z.email(),
  password: z.string().min(8),
  profileImage: z.string().optional(),
  gender: z.enum(["male", "female", "other"]),
  phone: z.string().optional(),
});

export const adminUpdateSchema = z.object({
  fullName: z.string().min(3).optional(),
  email: z.email().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  phone: z.string().optional(),
  profileImage: z.string().optional(),
  isActive: z.boolean().optional(),
});

export type CreateAdminInput = z.infer<typeof adminSchema>;
export type UpdateAdminInput = z.infer<typeof adminUpdateSchema>;
