const router = require("express").Router();
const authenticateJWT = require("../middleware/authMiddleware");
const {
  fetchUserById,
  fetchUserByUserId,
  updateUserById,
  deleteUserById,
} = require("../controllers/userController");

// Fetch User by ID
router.get("/profile/:id", authenticateJWT(["admin"]), fetchUserById);

// Fetch User by UserID
router.get("/profile/id/:id", authenticateJWT(["admin"]), fetchUserByUserId);

// Update User by ID
router.put("/update/:id", authenticateJWT(["admin"]), updateUserById);

// Delete User by ID
router.delete("/delete/:id", authenticateJWT(["admin"]), deleteUserById);

module.exports = router;
