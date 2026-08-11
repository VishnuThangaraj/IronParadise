import { Router } from "express";

import DietPlanController from "./diet-plan.controller.js";
import { dietPlanSchema, dietPlanUpdateSchema } from "./diet-plan.validator.js";

import { validate } from "../../shared/middlewares/validate.middleware.js";
import { authenticate } from "../../shared/middlewares/auth.middleware.js";
import { authorize } from "../../shared/middlewares/authorize.middleware.js";

const router: Router = Router();

// Create Diet Plan
router.post(
  "/",
  authenticate,
  authorize("admin"),
  validate(dietPlanSchema),
  DietPlanController.createDietPlan,
);

// Fetch all Diet Plan
router.get(
  "/",
  authenticate,
  authorize("admin", "trainer", "member"),
  DietPlanController.fetchAllDietPlan,
);

// Fetch Diet Plan with Id
router.get(
  "/:dietPlanId",
  authenticate,
  authorize("admin", "trainer", "member"),
  DietPlanController.getDietPlanById,
);

// Update Diet Plan
router.patch(
  "/:dietPlanId",
  authenticate,
  authorize("admin", "trainer"),
  validate(dietPlanUpdateSchema),
  DietPlanController.updateDietPlan,
);

// Delete Diet Plan
router.delete(
  "/:dietPlanId",
  authenticate,
  authorize("admin", "trainer"),
  DietPlanController.deleteDietPlan,
);

export default router;
