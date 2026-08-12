import type { Request, Response, NextFunction } from "express";

import AdminService from "./admin.service.js";
import { sendResponse } from "../../shared/utils/response.js";

class AdminController {
  // create admin
  public async createAdmin(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const admin = await AdminService.createAdmin(req.body);
      sendResponse(res, 201, "Admin created successfully", admin);
    } catch (error) {
      next(error);
    }
  }

  // fetch all admins
  public async getAllAdmins(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const admins = await AdminService.getAllAdmins();
      sendResponse(res, 200, "Admins fetched successfully", admins);
    } catch (error) {
      next(error);
    }
  }

  // fetch admin by id
  public async getAdminById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const admin = await AdminService.getAdminById(id as string);
      sendResponse(res, 200, "Admin details fetched successfully", admin);
    } catch (error) {
      next(error);
    }
  }

  // update admin
  public async updateAdmin(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const updatedAdmin = await AdminService.updateAdmin(
        id as string,
        req.body,
      );
      sendResponse(res, 200, "Admin updated successfully", updatedAdmin);
    } catch (error) {
      next(error);
    }
  }

  // delete admin (soft delete)
  public async deleteAdmin(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const deletedAdmin = await AdminService.deleteAdmin(id as string);
      sendResponse(res, 200, "Admin deactivated successfully", deletedAdmin);
    } catch (error) {
      next(error);
    }
  }

  // hard delete admin (permanent delete)
  public async hardDeleteAdmin(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const deletedAdmin = await AdminService.hardDeleteAdmin(id as string);
      sendResponse(res, 200, "Admin permanently deleted", deletedAdmin);
    } catch (error) {
      next(error);
    }
  }
}

export default new AdminController();
