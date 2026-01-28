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

module.exports = router;
