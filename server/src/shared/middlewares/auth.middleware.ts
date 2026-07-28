import type { Request, Response, NextFunction } from "express";

import AppError from "../errors/AppError.js";

import { verifyToken } from "../utils/jwt.js";

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      throw new AppError("Authentication required", 401);
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      throw new AppError("Authentication required", 401);
    }

    req.user = verifyToken(token);

    next();
  } catch {
    next(new AppError("Invalid or expired token", 401));
  }
}
