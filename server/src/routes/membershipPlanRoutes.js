const router = require("express").Router();
const authenticateJWT = require("../middleware/authMiddleware");
const membershipPlanController = require("../controllers/membershipPlanController");

// Fetch All Membership Pland
router.get(
  "/",
  authenticateJWT(["admin"]),
  membershipPlanController.fetchAllMembershipPlans
);

// Fetch Membership Plan by ID
router.get(
  "details/:id",
  authenticateJWT(["admin"]),
  membershipPlanController.fetchmemberhsipPlanById
);

// Update Membership Plan by ID
router.put(
  "/update/:id",
  authenticateJWT(["admin"]),
  membershipPlanController.updateMembershipPlanById
);

// Delete Membership Plan by ID
router.delete(
  "/delete/:id",
  authenticateJWT(["admin"]),
  membershipPlanController.deleteMembershipPlanById
);

module.exports = router;
