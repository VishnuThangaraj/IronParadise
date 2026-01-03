const router = require("express").Router();
const authenticateJWT = require("../middleware/authMiddleware");
const memberController = require("../controllers/memberController");

// Fetch All Members
router.get("/", authenticateJWT(["admin"]), memberController.fetchAllMembers);

// Fetch Member by ID
router.get(
  "profile/:id",
  authenticateJWT(["admin"]),
  memberController.fetchMemberById
);

// Update Member by ID
router.put(
  "/update/:id",
  authenticateJWT(["admin"]),
  memberController.updateMemberById
);

// Delete User by ID
router.delete(
  "/delete/:id",
  authenticateJWT(["admin"]),
  memberController.deleteMemberById
);

module.exports = router;
