import type { Request, Response, NextFunction } from "express";

import AdminService from "./admin.service.js";
import { sendResponse } from "../../shared/utils/response.js";

class AdminController {
  async createAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const admin = await AdminService.createAdmin(req.body);
      sendResponse(res, 201, "Admin created successfully", admin);
    } catch (error) {
      next(error);
    }
  }
}

export default new AdminController();
