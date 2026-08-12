import { Router } from "express";

import AdminController from "./admin.controller.js";

import { createAdminSchema, updateAdminSchema } from "./admin.validator.js";

import { validate } from "../../shared/middlewares/validate.middleware.js";
import { authenticate } from "../../shared/middlewares/auth.middleware.js";
import { authorize } from "../../shared/middlewares/authorize.middleware.js";
import { checkPermission } from "../../shared/middlewares/permission.middleware.js";

const router: Router = Router();

// Create admin (Admin role & "admins" permission required)
router.post(
  "/",
  authenticate,
  authorize("admin"),
  checkPermission("admins"),
  validate(createAdminSchema),
  AdminController.createAdmin,
);

// Fetch all admins (Admin role & "admins" permission required)
router.get(
  "/",
  authenticate,
  authorize("admin"),
  checkPermission("admins"),
  AdminController.getAllAdmins,
);

// Fetch admin by ID (Admin role & "admins" permission required)
router.get(
  "/:id",
  authenticate,
  authorize("admin"),
  checkPermission("admins"),
  AdminController.getAdminById,
);

// Update admin (Admin role & "admins" permission required)
router.patch(
  "/:id",
  authenticate,
  authorize("admin"),
  checkPermission("admins"),
  validate(updateAdminSchema),
  AdminController.updateAdmin,
);

// Permanently delete admin (Admin role & "admins" permission required)
router.delete(
  "/:id/permanent",
  authenticate,
  authorize("admin"),
  checkPermission("admins"),
  AdminController.hardDeleteAdmin,
);

// Delete admin / Soft delete (Admin role & "admins" permission required)
router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  checkPermission("admins"),
  AdminController.deleteAdmin,
);

export default router;
