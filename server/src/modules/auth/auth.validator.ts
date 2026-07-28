import { z } from "zod";

export const loginSchema = z.object({
  userId: z.string().length(7),

  password: z.string().min(8),
});
