import type { Request, Response, NextFunction } from "express";

import AuthService from "../services/auth.service.js";

import { sendResponse } from "../utils/response.js";

class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const admin = await AuthService.register(req.body);

      sendResponse(res, 201, "Registration successful", admin);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.login(req.body);

      sendResponse(res, 200, "Login successful", result);
    } catch (error) {
      next(error);
    }
  }

  async profile(req: Request, res: Response) {
    sendResponse(res, 200, "Current user", req.user);
  }
}

export default new AuthController();
