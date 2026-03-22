const router = require("express").Router();
const authenticateJWT = require("../middleware/authMiddleware");
const {
    createWorkoutPlan,
    fetchAllWorkoutPlans,
    fetchWorkoutPlanById,
    updateWorkoutPlanById,
    deleteWorkoutPlanById
} = require("../controllers/workoutPlanController");

// Fetch All Workout Plan
router.get(
    "/",
    authenticateJWT(["admin"]),
    fetchAllWorkoutPlans
);

// Create New Workout Plan
router.post(
    "/create",
    authenticateJWT(["admin"]),
    createWorkoutPlan
);

// Fetch Workout Plan by ID
router.get(
    "/details/:id",
    authenticateJWT(["admin"]),
    fetchWorkoutPlanById
);

// Update Workout Plan by ID
router.put(
    "/update/:id",
    authenticateJWT(["admin"]),
    updateWorkoutPlanById
);

// Delete Workout Plan by ID
router.delete(
    "/delete/:id",
    authenticateJWT(["admin"]),
    deleteWorkoutPlanById
);

module.exports = router;
