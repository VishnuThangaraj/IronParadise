import { Router } from "express";

import AuthController from "../controllers/auth.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";

import { validate } from "../middlewares/validate.middleware.js";

import { registerSchema, loginSchema } from "../validators/auth.validator.js";

const router: Router = Router();

router.post(
  "/register",

  validate(registerSchema),

  AuthController.register,
);

router.post(
  "/login",

  validate(loginSchema),

  AuthController.login,
);

router.get(
  "/profile",

  authenticate,

  AuthController.profile,
);

export default router;
