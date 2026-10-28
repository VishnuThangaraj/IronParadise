import type { Request, Response, NextFunction } from "express";
import DashboardService from "./dashboard.service.js";
import { sendResponse } from "../../shared/utils/response.js";

class DashboardController {
  public async getOverview(
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const overview = await DashboardService.getOverview();
      sendResponse(res, 200, "Dashboard overview fetched successfully", overview);
    } catch (error) {
      next(error);
    }
  }
}

export default new DashboardController();
