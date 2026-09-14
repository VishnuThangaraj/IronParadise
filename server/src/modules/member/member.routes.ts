import { Router } from "express";

import MemberController from "./member.controller.js";

import {
  createMemberSchema,
  updateMemberSchema,
} from "./member.validator.js";

import { validate } from "../../shared/middlewares/validate.middleware.js";
import { authenticate } from "../../shared/middlewares/auth.middleware.js";
import { authorize } from "../../shared/middlewares/authorize.middleware.js";
import { checkPermission } from "../../shared/middlewares/permission.middleware.js";

const router: Router = Router();

// create member
router.post(
  "/",
  authenticate,
  authorize("admin", "trainer"),
  checkPermission("members"),
  validate(createMemberSchema),
  MemberController.createMember,
);

// fetch all members
router.get(
  "/",
  authenticate,
  authorize("admin", "trainer"),
  checkPermission("members"),
  MemberController.getAllMembers,
);

// fetch member by id
router.get(
  "/:id",
  authenticate,
  authorize("admin", "trainer", "member"),
  checkPermission("members"),
  MemberController.getMemberById,
);

// update member
router.patch(
  "/:id",
  authenticate,
  authorize("admin", "trainer"),
  checkPermission("members"),
  validate(updateMemberSchema),
  MemberController.updateMember,
);

// delete member (permanent delete)
router.delete(
  "/:id/permanent",
  authenticate,
  authorize("admin"),
  checkPermission("members"),
  MemberController.hardDeleteMember,
);

// delete member (soft delete)
router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  checkPermission("members"),
  MemberController.deleteMember,
);

export default router;
