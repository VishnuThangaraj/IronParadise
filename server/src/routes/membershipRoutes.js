const router = require("express").Router();
const authenticateJWT = require("../middleware/authMiddleware");
const membershipController = require("../controllers/membershipController");

// Fetch All Membership Plan
router.get(
  "/",
  authenticateJWT(["admin"]),
  membershipController.fetchAllMemberships
);

// Create New Membership Plan
router.post(
  "/create",
  authenticateJWT(["admin"]),
  membershipController.createMembership
);

// Fetch Membership Plan by ID
router.get(
  "/details/:id",
  authenticateJWT(["admin"]),
  membershipController.fetchMembershipById
);

// Update Membership Plan by ID
router.put(
  "/update/:id",
  authenticateJWT(["admin"]),
  membershipController.updateMembershipById
);

// Delete Membership Plan by ID
router.delete(
  "/delete/:id",
  authenticateJWT(["admin"]),
  membershipController.deleteMembershipById
);

module.exports = router;
