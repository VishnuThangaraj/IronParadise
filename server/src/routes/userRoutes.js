const router = require(`express`).Router();
const authenticateJWT = require("../middleware/authMiddleware");
const userController = require("../controllers/userController");

// Fetch Trainer by ID
router.get(
  "/profile/:id",
  authenticateJWT(["admin"]),
  trainerController.fetchTrainerById
);

// Update User by ID
router.put(
  "/update/:id",
  authenticateJWT["admin"],
  userController.UpdateUserById
);

// Delete User by ID
router.delete(
  "/delete/:id",
  authenticateJWT["admin"],
  userController.deleteUser
);

module.exports = router;
