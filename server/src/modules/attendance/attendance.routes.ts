import { Router } from "express";

import AttendanceController from "./attendance.controller.js";
import {
  checkInSchema,
  checkOutSchema,
  createAttendanceSchema,
  updateAttendanceSchema,
} from "./attendance.validator.js";

import { validate } from "../../shared/middlewares/validate.middleware.js";
import { authenticate } from "../../shared/middlewares/auth.middleware.js";
import { authorize } from "../../shared/middlewares/authorize.middleware.js";

const router: Router = Router();

// Kiosk Search Active Members & Trainers (Public / Kiosk endpoint)
router.get(
  "/search-users",
  AttendanceController.searchUsersForKiosk,
);

router.get(
  "/kiosk/search",
  AttendanceController.searchUsersForKiosk,
);

// Kiosk / Quick Check-In (Public for Kiosk terminals or Authenticated)
router.post(
  "/check-in",
  validate(checkInSchema),
  AttendanceController.checkIn,
);

// Kiosk / Quick Check-Out (Public for Kiosk terminals or Authenticated)
router.post(
  "/check-out",
  validate(checkOutSchema),
  AttendanceController.checkOut,
);

// Kiosk Toggle Check-In / Check-Out
router.post(
  "/toggle",
  validate(checkInSchema),
  AttendanceController.toggleAttendance,
);

// Daily Statistics & KPI (Authenticated)
router.get(
  "/stats",
  authenticate,
  authorize("admin", "trainer"),
  AttendanceController.getAttendanceStats,
);

// User attendance history
router.get(
  "/user/:userId",
  authenticate,
  authorize("admin", "trainer", "member"),
  AttendanceController.getAttendanceByUser,
);

// Fetch all attendance records with query filters
router.get(
  "/",
  authenticate,
  authorize("admin", "trainer"),
  AttendanceController.fetchAllAttendance,
);

// Fetch single record by ID
router.get(
  "/:id",
  authenticate,
  authorize("admin", "trainer"),
  AttendanceController.getAttendanceById,
);

// Admin manual create attendance
router.post(
  "/",
  authenticate,
  authorize("admin", "trainer"),
  validate(createAttendanceSchema),
  AttendanceController.createAttendance,
);

// Update attendance record
router.patch(
  "/:id",
  authenticate,
  authorize("admin"),
  validate(updateAttendanceSchema),
  AttendanceController.updateAttendance,
);

// Delete attendance record
router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  AttendanceController.deleteAttendance,
);

export default router;
