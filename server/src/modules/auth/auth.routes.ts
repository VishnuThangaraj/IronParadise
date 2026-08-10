import { Router } from "express";

import { loginSchema, refreshTokenSchema } from "./auth.validator.js";
import AuthController from "./auth.controller.js";

import { authenticate } from "../../shared/middlewares/auth.middleware.js";
import { validate } from "../../shared/middlewares/validate.middleware.js";

const router: Router = Router();

router.post("/", validate(loginSchema), AuthController.login);

router.post(
  "/refresh-token",
  validate(refreshTokenSchema),
  AuthController.refreshToken,
);

router.get("/", authenticate, AuthController.profile);

export default router;
