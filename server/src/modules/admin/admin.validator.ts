import { z } from "zod";

export const adminSchema = z.object({
  fullName: z.string().min(3),

  email: z.email(),

  password: z.string().min(8),

  profileImage: z.string().optional(),

  gender: z.enum(["male", "female", "other"]),

  phone: z.string().optional(),
});

