import { Router } from "express";

import WorkoutPlanController from "./workout-plan.controller.js";
import {
  workoutPlanSchema,
  workoutPlanUpdateSchema,
} from "./workout-plan.validator.js";

import { validate } from "../../shared/middlewares/validate.middleware.js";
import { authenticate } from "../../shared/middlewares/auth.middleware.js";
import { authorize } from "../../shared/middlewares/authorize.middleware.js";

const router: Router = Router();

// create workout plan
router.post(
  "/",
  authenticate,
  authorize("admin", "trainer"),
  validate(workoutPlanSchema),
  WorkoutPlanController.createWorkoutPlan,
);

// fetch all workout plan
router.get(
  "/",
  authenticate,
  authorize("admin", "trainer", "member"),
  WorkoutPlanController.fetchAllWorkoutPlan,
);

// fetch workout plan by id
router.get(
  "/:workoutPlanId",
  authenticate,
  authorize("admin", "trainer", "member"),
  WorkoutPlanController.getWorkoutPlanById,
);

// update workout plan
router.patch(
  "/:workoutPlanId",
  authenticate,
  authorize("admin", "trainer"),
  validate(workoutPlanUpdateSchema),
  WorkoutPlanController.updateWorkoutPlan,
);

// delete workout plan
router.delete(
  "/:workoutPlanId",
  authenticate,
  authorize("admin", "trainer"),
  WorkoutPlanController.deleteWorkoutPlan,
);

// delete workout plan (hard delete)
router.delete(
  "/:workoutPlanId/permanent",
  authenticate,
  authorize("admin", "trainer"),
  WorkoutPlanController.deleteWorkoutPlanPermanently,
);

export default router;
