const router = require("express").Router();
const authenticateJWT = require("../middleware/authMiddleware");
const userController = require("../controllers/userController");

// User Login
router.post("/user/login", userController.userLogin);

// User Registration
router.post(
  "/user/register",
  authenticateJWT(["admin", "V06102002T"]),
  userController.registerUser
);

// Fetch Logged-in User Profile
router.get(
  "/user/profile",
  authenticateJWT(["admin", "trainer", "staff", "V06102002T"]),
  userController.userProfile
);

module.exports = router;
