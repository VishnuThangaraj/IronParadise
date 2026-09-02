import type { HydratedDocument } from "mongoose";
import type { Request, Response, NextFunction } from "express";

import DietPlanService from "./diet-plan.service.js";
import type { DietPlan } from "./diet-plan.model.js";

import { sendResponse } from "../../shared/utils/response.js";

class DietPlanController {
  // create diet plan
  public async createDietPlan(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const dietPlan: HydratedDocument<DietPlan> =
        await DietPlanService.createDietPlan(req.body);
      sendResponse(res, 201, "Diet plan created successfully", dietPlan);
    } catch (error) {
      next(error);
    }
  }

  // fetch all diet plans
  public async fetchAllDietPlan(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const dietPlans: HydratedDocument<DietPlan>[] =
        await DietPlanService.getAllDietPlans();
      sendResponse(res, 200, "Diet plans fetched successfully", dietPlans);
    } catch (error) {
      next(error);
    }
  }

  // fetch diet plan by id
  public async getDietPlanById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { dietPlanId } = req.params;
      const dietPlan: HydratedDocument<DietPlan> =
        await DietPlanService.getDietPlanById(dietPlanId as string);

      sendResponse(res, 200, "Diet plan fetched successfully", dietPlan);
    } catch (error) {
      next(error);
    }
  }

  // update diet plan
  public async updateDietPlan(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { dietPlanId } = req.params;
      const dietPlan: HydratedDocument<DietPlan> =
        await DietPlanService.updateDietPlan(dietPlanId as string, req.body);
      sendResponse(res, 200, "Diet plan updated successfully", dietPlan);
    } catch (error) {
      next(error);
    }
  }

  // delete diet plan (soft delete)
  public async deleteDietPlan(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { dietPlanId } = req.params;
      const dietPlan: HydratedDocument<DietPlan> =
        await DietPlanService.deleteDietPlan(dietPlanId as string);
      sendResponse(res, 200, "Diet plan deleted successfully", dietPlan);
    } catch (error) {
      next(error);
    }
  }

  // delete diet plan permanently (hard delete)
  public async deleteDietPlanPermanently(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { dietPlanId } = req.params;
      const dietPlan: HydratedDocument<DietPlan> =
        await DietPlanService.deleteDietPlanPermanently(dietPlanId as string);
      sendResponse(res, 200, "Diet plan deleted successfully", dietPlan);
    } catch (error) {
      next(error);
    }
  }
}

export default new DietPlanController();
