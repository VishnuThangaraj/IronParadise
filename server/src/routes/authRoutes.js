const router = require("express").Router();
const authenticateJWT = require("../middleware/authMiddleware");
const adminController = require("../controllers/adminController");
const trainerController = require("../controllers/trainerController");
const customerController = require("../controllers/customerController");

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

// Customer //

// Customer Login
router.post("/customer/login", customerController);

// Customer Registration
router.post(
  "/customer/register",
  authenticateJWT(["admin"]),
  customerController
);

// Fetch Loggin-in Customer Profile
router.get("/customer/profile", customerController);

module.exports = router;
