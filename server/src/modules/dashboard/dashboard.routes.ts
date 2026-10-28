import { Router } from "express";
import DashboardController from "./dashboard.controller.js";
import { authenticate } from "../../shared/middlewares/auth.middleware.js";
import { authorize } from "../../shared/middlewares/authorize.middleware.js";

const router: Router = Router();

// Fetch Dashboard Overview (available for authenticated users)
router.get(
  "/overview",
  authenticate,
  authorize("admin", "trainer", "member"),
  DashboardController.getOverview,
);

export default router;
