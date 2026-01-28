const router = require("express").Router();
const authenticateJWT = require("../middleware/authMiddleware");
const memberController = require("../controllers/memberController");

// Fetch All Members
router.get("/", authenticateJWT(["admin"]), memberController.fetchAllMembers);

// Create Member
router.post(
  "/create",
  authenticateJWT(["admin"]),
  memberController.registerMember,
);

// Fetch Member by ID
router.get(
  "/profile/:id",
  authenticateJWT(["admin"]),
  memberController.fetchMemberById,
);

// Fetch Member by MemberID
router.get(
  "/profile/id/:id",
  authenticateJWT(["admin"]),
  memberController.fetchMemberByMemberId,
);

// Update Member by ID
router.put(
  "/update/:id",
  authenticateJWT(["admin"]),
  memberController.updateMemberById,
);

// Delete Member by ID
router.delete(
  "/delete/:id",
  authenticateJWT(["admin"]),
  memberController.deleteMemberById,
);

module.exports = router;
