const router = require("express").Router();
const authenticateJWT = require("../middleware/authMiddleware");
const adminController = require("../controllers/adminController");
const trainerController = require("../controllers/trainerController");

// ADMIN //

// Admin Login
router.post("/admin/login", adminController.adminLogin);

// Admin Registration
router.post("/admin/register", adminController.registerAdmin);

// Fetch Logged-in Admin Profile
router.get(
  "/admin/profile",
  authenticateJWT(["admin"]),
  adminController.adminDetails
);

// TRAINER //

// Trainer Login
router.post("/trainer/login", trainerController.trainerLogin);

// Trainer Registration
router.post(
  "/trainer/register",
  authenticateJWT(["admin"]),
  trainerController.registerTrainer
);

// Fetch Logged-in Trainer Profile
router.get(
  "/trainer/profile",
  authenticateJWT(["trainer"]),
  trainerController.trainerProfile
);

module.exports = router;
