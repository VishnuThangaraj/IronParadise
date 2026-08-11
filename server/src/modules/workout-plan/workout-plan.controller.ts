import type { HydratedDocument } from "mongoose";
import type { Request, Response, NextFunction } from "express";

import WorkoutPlanService from "./workout-plan.service.js";
import type { WorkoutPlan } from "./workout-plan.model.js";

import { sendResponse } from "../../shared/utils/response.js";

class WorkoutPlanController {
  // create workout plan
  public async createWorkoutPlan(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const workoutPlan: HydratedDocument<WorkoutPlan> =
        await WorkoutPlanService.createWorkoutPlan(req.body);
      sendResponse(res, 201, "Workout plan created successfully", workoutPlan);
    } catch (error) {
      next(error);
    }
  }

  // fetch all workout plans
  public async fetchAllWorkoutPlan(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const workoutPlans: HydratedDocument<WorkoutPlan>[] =
        await WorkoutPlanService.getAllWorkoutPlans();
      sendResponse(
        res,
        200,
        "Workout plans fetched successfully",
        workoutPlans,
      );
    } catch (error) {
      next(error);
    }
  }

  // fetch workout plan by id
  public async getWorkoutPlanById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { workoutPlanId } = req.params;
      const workoutPlan: HydratedDocument<WorkoutPlan> =
        await WorkoutPlanService.getWorkoutPlanById(workoutPlanId as string);

      sendResponse(res, 200, "Workout plan fetched successfully", workoutPlan);
    } catch (error) {
      next(error);
    }
  }

  // update workout plan
  public async updateWorkoutPlan(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { workoutPlanId } = req.params;
      const workoutPlan: HydratedDocument<WorkoutPlan> =
        await WorkoutPlanService.updateWorkoutPlanById(
          workoutPlanId as string,
          req.body,
        );

      sendResponse(res, 200, "Workout plan updated successfully", workoutPlan);
    } catch (error) {
      next(error);
    }
  }

  // delete workout plan
  public async deleteWorkoutPlan(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { workoutPlanId } = req.params;
      const workoutPlan: HydratedDocument<WorkoutPlan> =
        await WorkoutPlanService.deleteWorkoutPlan(workoutPlanId as string);
      sendResponse(res, 200, "Workout plan deleted successfully", workoutPlan);
    } catch (error) {
      next(error);
    }
  }
}

export default new WorkoutPlanController();
