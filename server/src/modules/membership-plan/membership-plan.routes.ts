import { Router } from "express";

import MembershipPlanController from "./membership-plan.controller.js";
import {
  membershipPlanSchema,
  membershipPlanUpdateSchema,
} from "./membership-plan.validator.js";

import { validate } from "../../shared/middlewares/validate.middleware.js";
import { authenticate } from "../../shared/middlewares/auth.middleware.js";
import { authorize } from "../../shared/middlewares/authorize.middleware.js";

const router: Router = Router();

// Create Membership Plan
router.post(
  "/",
  authenticate,
  authorize("admin"),
  validate(membershipPlanSchema),
  MembershipPlanController.createMembershipPlan,
);

// Fetch all Membership Plan
router.get(
  "/",
  authenticate,
  authorize("admin", "trainer"),
  MembershipPlanController.fetchAllMembershipPlan,
);

// Fetch Membership Plan with Id
router.get(
  "/:membershipPlanId",
  authenticate,
  authorize("admin", "trainer"),
  MembershipPlanController.getMembershipPlanById,
);

// Update Membership Plan
router.patch(
  "/:membershipPlanId",
  authenticate,
  authorize("admin"),
  validate(membershipPlanUpdateSchema),
  MembershipPlanController.updateMembershipPlan,
);

// Delete Membership Plan
router.delete(
  "/:membershipPlanId",
  authenticate,
  authorize("admin"),
  MembershipPlanController.deleteMembershipPlan,
);

export default router;
