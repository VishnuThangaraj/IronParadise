const router = require("express").Router();
const authenticateJWT = require("../middleware/authMiddleware");
const {
    createMembershipPlan,
    fetchAllMembershipPlans,
    fetchMembershipPlanById,
    updateMembershipPlanById,
    deleteMembershipPlanById,
} = require("../controllers/membershipPlanController");

// Fetch All Membership Plan
router.get(
    "/",
    authenticateJWT(["admin"]),
    fetchAllMembershipPlans
);

// Create New Membership Plan
router.post(
    "/create",
    authenticateJWT(["admin"]),
    createMembershipPlan
);

// Fetch Membership Plan by ID
router.get(
    "/details/:id",
    authenticateJWT(["admin"]),
    fetchMembershipPlanById
);

// Update Membership Plan by ID
router.put(
    "/update/:id",
    authenticateJWT(["admin"]),
    updateMembershipPlanById
);

// Delete Membership Plan by ID
router.delete(
    "/delete/:id",
    authenticateJWT(["admin"]),
    deleteMembershipPlanById
);

module.exports = router;
