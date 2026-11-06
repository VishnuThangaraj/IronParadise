import type { Request, Response, NextFunction } from "express";
import DashboardService from "./dashboard.service.js";
import { sendResponse } from "../../shared/utils/response.js";

class DashboardController {
  public async getOverview(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      if (req.user?.role === "trainer") {
        const overview = await DashboardService.getTrainerOverview(
          req.user.userId,
        );
        sendResponse(
          res,
          200,
          "Trainer dashboard overview fetched successfully",
          overview,
        );
        return;
      }

      if (req.user?.role === "member") {
        const overview = await DashboardService.getMemberOverview(
          req.user.userId,
        );
        sendResponse(
          res,
          200,
          "Member dashboard overview fetched successfully",
          overview,
        );
        return;
      }

      const overview = await DashboardService.getOverview();
      sendResponse(
        res,
        200,
        "Dashboard overview fetched successfully",
        overview,
      );
    } catch (error) {
      next(error);
    }
  }

  public async getTrainerOverview(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const trainerId = req.user?.userId;
      if (!trainerId) {
        return sendResponse(res, 401, "Authentication required");
      }
      const overview = await DashboardService.getTrainerOverview(trainerId);
      sendResponse(
        res,
        200,
        "Trainer dashboard overview fetched successfully",
        overview,
      );
    } catch (error) {
      next(error);
    }
  }

  public async getMemberOverview(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const memberId = req.user?.userId;
      if (!memberId) {
        return sendResponse(res, 401, "Authentication required");
      }
      const overview = await DashboardService.getMemberOverview(memberId);
      sendResponse(
        res,
        200,
        "Member dashboard overview fetched successfully",
        overview,
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new DashboardController();
