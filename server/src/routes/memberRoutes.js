const router = require("express").Router();
const authenticateJWT = require("../middleware/authMiddleware");
const memberController = require("../controllers/memberController");

// Member Registration
router.post(
  "/add",
  authenticateJWT(["admin"]),
  memberController.registerMember
);

// Fetch all Member
router.get("/", authenticateJWT(["admin"]), memberController.fetchMembers);

// Update Member
router.put(
  "/update/:id",
  authenticateJWT(["admin"]),
  memberController.updateMember
);

// Deleta Member
router.delete(
  "/delete/:id",
  authenticateJWT(["admin"]),
  memberController.deleteMember
);

module.exports = router;
