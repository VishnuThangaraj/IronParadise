const router = require("express").Router();
const fileUpload = require("../middleware/fileUpload");
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

// Check Attendancee
router.post("/check", generalController.checkAttendance);

// Send Mail
router.post(
  "/sendmail",
  authenticateJWT(["admin"]),
  generalController.sendMailFromAdmin
);

// Subscription Mail
router.post(
  "/subscriptionmail",
  authenticateJWT(["admin"]),
  generalController.subscriptionMail
);

// Send Bulk Mail
router.post(
  "/bulkmail",
  fileUpload.single("file"),
  generalController.sendBulkMail
);

module.exports = router;
