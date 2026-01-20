const router = require("express").Router();
const authenticateJWT = require("../middleware/authMiddleware");
const userController = require("../controllers/userController");

// Fetch Trainer by ID
router.get(
  "/profile/:id",
  authenticateJWT(["admin"]),
  userController.fetchUserById,
);

// Update User by ID
router.put(
  "/update/:id",
  authenticateJWT(["admin"]),
  userController.updateUserById,
);

// Delete User by ID
router.delete(
  "/delete/:id",
  authenticateJWT(["admin"]),
  userController.deleteUserById,
);

module.exports = router;
