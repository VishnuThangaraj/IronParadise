import { Router } from "express";

import TrainerController from "./trainer.controller.js";

import {
  createTrainerSchema,
  updateTrainerSchema,
} from "./trainer.validator.js";
import { createTrainerPaymentReceiptSchema } from "./trainer-payment-receipt/trainer-payment-receipt.validator.js";

import { validate } from "../../shared/middlewares/validate.middleware.js";
import { authenticate } from "../../shared/middlewares/auth.middleware.js";
import { authorize } from "../../shared/middlewares/authorize.middleware.js";
import { checkPermission } from "../../shared/middlewares/permission.middleware.js";

const router: Router = Router();

// create trainer
router.post(
  "/",
  authenticate,
  authorize("admin"),
  checkPermission("trainers"),
  validate(createTrainerSchema),
  TrainerController.createTrainer,
);

// fetch all trainers
router.get(
  "/",
  authenticate,
  authorize("admin", "trainer"),
  checkPermission("trainers"),
  TrainerController.getAllTrainers,
);

// record trainer payment / payroll
router.post(
  "/payroll/pay",
  authenticate,
  authorize("admin"),
  checkPermission("trainers"),
  validate(createTrainerPaymentReceiptSchema),
  TrainerController.recordPayment,
);

// fetch all payment receipts
router.get(
  "/payroll/receipts",
  authenticate,
  authorize("admin", "trainer"),
  checkPermission("trainers"),
  TrainerController.getPaymentReceipts,
);

// fetch all trainer payments
router.get(
  "/payroll/payments",
  authenticate,
  authorize("admin", "trainer"),
  checkPermission("trainers"),
  TrainerController.getAllPayments,
);

// fetch receipts for a specific trainer
router.get(
  "/:id/receipts",
  authenticate,
  authorize("admin", "trainer"),
  checkPermission("trainers"),
  TrainerController.getTrainerReceipts,
);

// fetch trainer by id
router.get(
  "/:id",
  authenticate,
  authorize("admin", "trainer"),
  checkPermission("trainers"),
  TrainerController.getTrainerById,
);

// update trainer
router.patch(
  "/:id",
  authenticate,
  authorize("admin", "trainer"),
  checkPermission("trainers"),
  validate(updateTrainerSchema),
  TrainerController.updateTrainer,
);

// delete trainer (permanent delete)
router.delete(
  "/:id/permanent",
  authenticate,
  authorize("admin"),
  checkPermission("trainers"),
  TrainerController.hardDeleteTrainer,
);

// delete trainer (soft delete)
router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  checkPermission("trainers"),
  TrainerController.deleteTrainer,
);

export default router;
