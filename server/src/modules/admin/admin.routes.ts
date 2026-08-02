import { Router } from "express";

import AdminController from "./admin.controller.js";
import { adminSchema, adminUpdateSchema } from "./admin.validator.js";

import { validate } from "../../shared/middlewares/validate.middleware.js";
import { authenticate } from "../../shared/middlewares/auth.middleware.js";
import { authorize } from "../../shared/middlewares/authorize.middleware.js";

const router: Router = Router();

// Create Admin
router.post(
  "/",
  authenticate,
  authorize("admin"),
  validate(adminSchema),
  AdminController.createAdmin,
);

// Update Admin
router.patch(
  "/:adminId",
  authenticate,
  authorize("admin"),
  validate(adminUpdateSchema),
  AdminController.updateAdmin,
);

// Delete Admin
router.delete(
  "/:adminId",
  authenticate,
  authorize("admin"),
  AdminController.deleteAdmin,
);

export default router;
