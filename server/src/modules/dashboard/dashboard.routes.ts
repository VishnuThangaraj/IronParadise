import { Router } from "express";
import DashboardController from "./dashboard.controller.js";
import { authenticate } from "../../shared/middlewares/auth.middleware.js";
import { authorize } from "../../shared/middlewares/authorize.middleware.js";

const router: Router = Router();

// Fetch Dashboard Overview (available for authenticated users, role-adapted)
router.get(
  "/overview",
  authenticate,
  authorize("admin", "trainer", "member"),
  DashboardController.getOverview,
);

// Fetch Trainer Dedicated Overview
router.get(
  "/trainer",
  authenticate,
  authorize("trainer"),
  DashboardController.getTrainerOverview,
);

// Fetch Member Dedicated Overview
router.get(
  "/member",
  authenticate,
  authorize("member"),
  DashboardController.getMemberOverview,
);

export default router;
