import type { Request, Response, NextFunction } from "express";

import AuthService from "./auth.service.js";

import { sendResponse } from "../../shared/utils/response.js";

class AuthController {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.login(req.body);

      sendResponse(res, 200, "Login successful", result);
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.refreshToken(req.body);

      sendResponse(res, 200, "Token refreshed successfully", result);
    } catch (error) {
      next(error);
    }
  }

  async profile(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user?.userId) {
        return sendResponse(res, 401, "Authentication required");
      }

      const user = await AuthService.getProfile(req.user.userId);

      sendResponse(res, 200, "Current user", user);
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
