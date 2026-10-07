import { Router } from "express";

import MessageController from "./message.controller.js";

import { validate } from "../../shared/middlewares/validate.middleware.js";
import { authenticate } from "../../shared/middlewares/auth.middleware.js";
import { authorize } from "../../shared/middlewares/authorize.middleware.js";
import { checkPermission } from "../../shared/middlewares/permission.middleware.js";

const router: Router = Router();

router.get(
  "/",
  authenticate,
  authorize("admin"),
  checkPermission("message"),
  MessageController.fetchAllUserDetails,
);

export default router;
