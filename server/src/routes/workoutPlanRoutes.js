const router = require("express").Router();
const authenticateJWT = require("../middleware/authMiddleware");
const workoutPlanController = require("../controllers/workoutPlanController");

// Fetch All Workout Plan
router.get(
  "/",
  authenticateJWT(["admin"]),
  workoutPlanController.fetchAllWorkoutPlans
);

// Create New Workout Plan
router.post(
  "/create",
  authenticateJWT(["admin"]),
  workoutPlanController.createWorkoutPlan
);

// Fetch Workout Plan by ID
router.get(
  "/details/:id",
  authenticateJWT(["admin"]),
  workoutPlanController.fetchWorkoutPlanById
);

// Update Workout Plan by ID
router.put(
  "/update/:id",
  authenticateJWT(["admin"]),
  workoutPlanController.updateWorkoutPlanById
);

// Delete Workout Plan by ID
router.delete(
  "/delete/:id",
  authenticateJWT(["admin"]),
  workoutPlanController.deleteWorkoutPlanById
);

module.exports = router;
