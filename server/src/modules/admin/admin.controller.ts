import type { Request, Response, NextFunction } from "express";
import type { HydratedDocument } from "mongoose";

import AdminService from "./admin.service.js";
import type { Admin } from "./admin.model.js";

import { sendResponse } from "../../shared/utils/response.js";

class AdminController {
  public async createAdmin(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const admin: HydratedDocument<Admin> = await AdminService.createAdmin(
        req.body,
      );
      sendResponse(res, 201, "Admin created successfully", admin);
    } catch (error) {
      next(error);
    }
  }
  public async updateAdmin(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { adminId } = req.params;
      const admin: HydratedDocument<Admin> = await AdminService.updateAdmin(
        adminId as string,
        req.body,
      );
      sendResponse(res, 200, "Admin updated successfully", admin);
    } catch (error) {
      next(error);
    }
  }

  public async deleteAdmin(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { adminId } = req.params;
      const admin: HydratedDocument<Admin> = await AdminService.deleteAdmin(
        adminId as string,
      );
      sendResponse(res, 200, "Admin deleted successfully", admin);
    } catch (error) {
      next(error);
    }
  }
}

export default new AdminController();

