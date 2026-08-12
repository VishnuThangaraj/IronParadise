import type { Request, Response, NextFunction } from "express";

import AppError from "../errors/AppError.js";
import UserModel from "../../modules/user/user.model.js";

export type Permission =
  | "members"
  | "trainers"
  | "dietplans"
  | "workoutplans"
  | "memberships"
  | "enquiry"
  | "events"
  | "admins";

export function checkPermission(...requiredPermissions: Permission[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return next(new AppError("Unauthorized access", 401));
      }

      const { userId } = req.user;

      const user = await UserModel.findOne({ userId });
      if (!user) {
        return next(new AppError("Forbidden: User profile not found", 403));
      }

      if (!user.isActive) {
        return next(new AppError("Forbidden: Account is inactive", 403));
      }

      const userPermissions = user.permissions || [];

      const hasPermission = requiredPermissions.some((perm) =>
        userPermissions.includes(perm),
      );

      if (!hasPermission) {
        return next(
          new AppError(
            `Forbidden: You don't have permission for [${requiredPermissions.join(", ")}]`,
            403,
          ),
        );
      }

      return next();
    } catch (error) {
      next(error);
    }
  };
}
