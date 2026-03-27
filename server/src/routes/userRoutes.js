const router = require("express").Router();
const authenticateJWT = require("../middleware/authMiddleware");
const {
  fetchUserById,
  fetchUserByUserId,
  registerUser,
} = require("../controllers/userController");

// Fetch User by ID
router.get("/profile/:id", authenticateJWT(["admin"]), fetchUserById);

// Fetch User by UserID
router.get("/profile/id/:id", authenticateJWT(["admin"]), fetchUserByUserId);

// Register User
router.post("/register", registerUser);

module.exports = router;
