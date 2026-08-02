import { Router } from "express";

import authRoutes from "../modules/auth/auth.routes.js";
import adminRoutes from "../modules/admin/admin.routes.js";
import membershipPlanRoutes from "../modules/membership-plan/membership-plan.routes.js";

const router: Router = Router();

router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/membership-plan", membershipPlanRoutes);

export default router;
