const router = require("express").Router();
const authenticateJWT = require("../middleware/authMiddleware");
const {
    createDietPlan,
    fetchAllDietPlans,
    fetchDietPlanById,
    updateDietPlanById,
    deleteDietPlanById
} = require("../controllers/dietPlanController");

// Fetch All Diet Plan
router.get(
    "/",
    authenticateJWT(["admin"]),
    fetchAllDietPlans
);

// Create New Diet Plan
router.post(
    "/create",
    authenticateJWT(["admin"]),
    createDietPlan
);

// Fetch Diet Plan by ID
router.get(
    "/details/:id",
    authenticateJWT(["admin"]),
    fetchDietPlanById
);

// Update Diet Plan by ID
router.put(
    "/update/:id",
    authenticateJWT(["admin"]),
    updateDietPlanById
);

// Delete Diet Plan by ID
router.delete(
    "/delete/:id",
    authenticateJWT(["admin"]),
    deleteDietPlanById
);

module.exports = router;
