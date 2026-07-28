import { Router } from "express";
import AdminController from "./admin.controller.js";
import { validate } from "../../shared/middlewares/validate.middleware.js";
import { adminSchema } from "./admin.validator.js";
import { authenticate } from "../../shared/middlewares/auth.middleware.js";

const router: Router = Router();

router.post(
  "/register",
  // authenticate,
  validate(adminSchema),
  AdminController.createAdmin,
);

export default router;
