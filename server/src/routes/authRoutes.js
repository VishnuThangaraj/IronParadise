const router = require("express").Router();
const authenticateJWT = require("../middleware/authMiddleware");
const authController = require("../controllers/adminController");

// Admin Login
router.post("/admin/login", authController.adminLogin);

// Admin Registration
router.post("/admin/register", authController.registerAdmin);

// Fetch Logged-in Admin Profile
router.get(
  "/admin/profile",
  authenticateJWT(["admin"]),
  authController.adminDetails
);

module.exports = router;
