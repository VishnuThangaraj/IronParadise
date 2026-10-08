import { Router } from "express";

import EnquiryController from "./enquiry.controller.js";
import {
  enquirySchema,
  enquiryReplySchema,
  enquiryUpdateSchema,
} from "./enquiry.validator.js";

import { validate } from "../../shared/middlewares/validate.middleware.js";
import { authenticate } from "../../shared/middlewares/auth.middleware.js";
import { authorize } from "../../shared/middlewares/authorize.middleware.js";
import { checkPermission } from "../../shared/middlewares/permission.middleware.js";

const router: Router = Router();

// Create new enquiry (Public - e.g. from Contact Us page)
router.post(
  "/",
  validate(enquirySchema),
  EnquiryController.createEnquiry,
);

// Fetch all enquiries (Authorized and Permitted)
router.get(
  "/",
  authenticate,
  authorize("admin"),
  checkPermission("enquiry"),
  EnquiryController.fetchAllEnquiries,
);

// Fetch enquiry by ID (Authorized and Permitted)
router.get(
  "/:id",
  authenticate,
  authorize("admin"),
  checkPermission("enquiry"),
  EnquiryController.getEnquiryById,
);

// Reply to enquiry (Authorized and Permitted)
router.post(
  "/:id/reply",
  authenticate,
  authorize("admin"),
  checkPermission("enquiry"),
  validate(enquiryReplySchema),
  EnquiryController.replyToEnquiry,
);

router.patch(
  "/:id/reply",
  authenticate,
  authorize("admin"),
  checkPermission("enquiry"),
  validate(enquiryReplySchema),
  EnquiryController.replyToEnquiry,
);

// Update enquiry (Authorized and Permitted)
router.patch(
  "/:id",
  authenticate,
  authorize("admin"),
  checkPermission("enquiry"),
  validate(enquiryUpdateSchema),
  EnquiryController.updateEnquiry,
);

// Delete enquiry (Authorized and Permitted)
router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  checkPermission("enquiry"),
  EnquiryController.deleteEnquiry,
);

export default router;
