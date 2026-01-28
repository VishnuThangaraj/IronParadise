const router = require("express").Router();
const authenticateJWT = require("../middleware/authMiddleware");
const userController = require("../controllers/userController");

// Fetch User by ID
router.get(
  "/profile/:id",
  authenticateJWT(["admin"]),
  userController.fetchUserById,
);

// Fetch User by UserID
router.get(
  "/profile/id/:id",
  authenticateJWT(["admin"]),
  userController.fetchUserByUserId,
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
