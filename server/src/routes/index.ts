import { Router } from "express";

import authRoutes from "../modules/auth/auth.routes.js";
import adminRoutes from "../modules/admin/admin.routes.js";
import eventRoutes from "../modules/event/event.routes.js";
import memberRoutes from "../modules/member/member.routes.js";
import messageRoutes from "../modules/message/message.routes.js";
import trainerRoutes from "../modules/trainer/trainer.routes.js";
import dietPlanRoutes from "../modules/diet-plan/diet-plan.routes.js";
import workoutPlanRoutes from "../modules/workout-plan/workout-plan.routes.js";
import membershipPlanRoutes from "../modules/membership-plan/membership-plan.routes.js";
import enquiryRoutes from "../modules/enquiry/enquiry.routes.js";
import attendanceRoutes from "../modules/attendance/attendance.routes.js";

const router: Router = Router();

router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/event", eventRoutes);
router.use("/member", memberRoutes);
router.use("/message", messageRoutes);
router.use("/trainer", trainerRoutes);
router.use("/diet-plan", dietPlanRoutes);
router.use("/workout-plan", workoutPlanRoutes);
router.use("/membership-plan", membershipPlanRoutes);
router.use("/enquiry", enquiryRoutes);
router.use("/attendance", attendanceRoutes);

export default router;
