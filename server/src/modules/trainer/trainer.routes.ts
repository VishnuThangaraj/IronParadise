import { Router } from "express";

import TrainerController from "./trainer.controller.js";

import {
  createTrainerSchema,
  updateTrainerSchema,
} from "./trainer.validator.js";

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
