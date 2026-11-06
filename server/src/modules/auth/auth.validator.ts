import { z } from "zod";

export const loginSchema = z.object({
  userId: z.string().min(7).max(12),
  password: z.string().min(8),
});

export const registerSchema = z.object({
  userId: z.string(),
  userType: z.enum(["admin", "trainer", "member"]),
  password: z.string().min(8),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
