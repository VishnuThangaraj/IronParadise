import { Router } from "express";

import AuthController from "./auth.controller.js";

import { authenticate } from "../../shared/middlewares/auth.middleware.js";

import { validate } from "../../shared/middlewares/validate.middleware.js";

import { loginSchema } from "./auth.validator.js";

const router: Router = Router();

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
