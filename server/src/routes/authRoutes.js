const router = require("express").Router();
const authenticateJWT = require("../middleware/authMiddleware");
const authController = require("../controllers/authController");

// Admin Login
router.post("/login", authController.adminLogin);

// Admin Registration
router.post("/register", authController.registerAdmin);

// Fetch Loggedin Admin Profile
router.get(
  "/profile",
  authenticateJWT(["admin", "member", "trainer"]),
  authController.adminDetails
);

module.exports = router;
