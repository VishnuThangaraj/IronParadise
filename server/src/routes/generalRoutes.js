const router = require("express").Router();
const authenticateJWT = require("../middleware/authMiddleware");
const generalController = require("../controllers/generalController");

// Get Member and Trainers
router.get("/", generalController.getUsers);

// Fetch all attendance
router.get(
  "/attendance",
  authenticateJWT(["admin"]),
  generalController.fetchAttendance
);

// Mark Attendancee
router.post("/attendance", generalController.markAttendance);

// Send Mail
router.post(
  "/sendmail",
  authenticateJWT(["admin"]),
  generalController.sendMailFromAdmin
);

// Send Bulk Mail
router.post(
  "/bulkmail",
  authenticateJWT(["admin"]),
  generalController.sendBulkMail
);

module.exports = router;
