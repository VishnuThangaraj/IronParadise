const router = require("express").Router();
const authenticateJWT = require("../middleware/authMiddleware");
const {
  userLogin,
  userProfile,
  registerUser,
} = require("../controllers/userController");

// User Login
router.post("/user/login", userLogin);

// User Registration
router.post(
  "/user/register",
  // authenticateJWT(["admin", "V06102002T"]),
  registerUser,
);

// Fetch Logged-in User Profile
router.get(
  "/user/profile",
  authenticateJWT(["admin", "trainer", "staff", "V06102002T"]),
  userProfile,
);

module.exports = router;
