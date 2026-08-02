import type { Request, Response, NextFunction } from "express";
import type { HydratedDocument } from "mongoose";

import MembershipPlanService from "./membership-plan.service.js";
import type { MembershipPlan } from "./membership-plan.model.js";

import { sendResponse } from "../../shared/utils/response.js";

class MembershipPlanController {
  public async createMembershipPlan(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const membershipPlan: HydratedDocument<MembershipPlan> =
        await MembershipPlanService.createMembershipPlan(req.body);
      sendResponse(
        res,
        201,
        "Membership Plan created successfully",
        membershipPlan,
      );
    } catch (error) {
      next(error);
    }
  }

  public async fetchAllMembershipPlan(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const membershipPlans: HydratedDocument<MembershipPlan>[] =
        await MembershipPlanService.getAllMembershipPlans();
      sendResponse(
        res,
        200,
        "Membership plans fetched successfully",
        membershipPlans,
      );
    } catch (error) {
      next(error);
    }
  }

  public async getMembershipPlanById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { membershipPlanId } = req.params;
      const membershipPlan: HydratedDocument<MembershipPlan> =
        await MembershipPlanService.getMembershipPlanById(
          membershipPlanId as string,
        );
      sendResponse(
        res,
        200,
        "Membership plan fetched successfully",
        membershipPlan,
      );
    } catch (error) {
      next(error);
    }
  }

  public async updateMembershipPlan(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { membershipPlanId } = req.params;
      const membershipPlan: HydratedDocument<MembershipPlan> =
        await MembershipPlanService.updateMembershipPlan(
          membershipPlanId as string,
          req.body,
        );
      sendResponse(
        res,
        200,
        "Membership plan updated successfully",
        membershipPlan,
      );
    } catch (error) {
      next(error);
    }
  }

  public async deleteMembershipPlan(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { membershipPlanId } = req.params;
      const membershipPlan: HydratedDocument<MembershipPlan> =
        await MembershipPlanService.deleteMembershipPlan(
          membershipPlanId as string,
        );
      sendResponse(
        res,
        200,
        "Membership Plan deleted successfully",
        membershipPlan,
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new MembershipPlanController();
