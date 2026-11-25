import { Router } from "express";
import UploadController from "./upload.controller.js";
import { authenticate } from "../../shared/middlewares/auth.middleware.js";
import { uploadProfileImageMiddleware } from "../../shared/middlewares/upload.middleware.js";

const router: Router = Router();

// Upload profile image
router.post(
  "/profile-image",
  authenticate,
  uploadProfileImageMiddleware,
  UploadController.uploadProfileImage,
);

export default router;
