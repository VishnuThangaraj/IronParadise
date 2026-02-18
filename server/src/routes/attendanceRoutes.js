const router = require("express").Router();
const authenticateJWT = require("../middleware/authMiddleware");
const attendanceController = require("../controllers/attendanceController");

// Fetch All Attendances
router.get(
  "/",
  authenticateJWT(["admin"]),
  attendanceController.fetchAllAttendances,
);

// Create Attendance
router.post(
  "/create",
  authenticateJWT(["admin"]),
  attendanceController.registerAttendance,
);

// Fetch Monthly Attendance
router.post(
  "/monthly",
  authenticateJWT(["admin"]),
  attendanceController.fetchMonthlyAttendance,
);

// Fetch Daily Attendance
router.post(
  "/daily",
  authenticateJWT(["admin"]),
  attendanceController.fetchDailyAttendance,
);

module.exports = router;
