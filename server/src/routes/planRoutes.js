const router = require("express").Router();
const authenticateJWT = require("../middleware/authMiddleware");
const planController = require("../controllers/planController");

// Add New Diet Plan
router.post(
  "/diet/add",
  authenticateJWT(["admin"]),
  planController.addDietPlan
);

// Fetch All Diet Plans
router.get("/diet", authenticateJWT(["admin"]), planController.fetchDietplans);

// Update a Diet PLan by ID
router.put(
  "/diet/update/:id",
  authenticateJWT(["admin"]),
  planController.updateDietplanById
);

// Delete Diet PLan by ID
router.delete(
  "/diet/delete/:id",
  authenticateJWT(["admin"]),
  planController.deleteDietplanById
);

// Add New Workout Plan
router.post(
  "/workout/add",
  authenticateJWT(["admin"]),
  planController.addWorkoutPlan
);

// Fetch All Workout Plans
router.get(
  "/workout",
  authenticateJWT(["admin"]),
  planController.fetchWorkoutplans
);

// Update a Workout PLan by ID
router.put(
  "/workout/update/:id",
  authenticateJWT(["admin"]),
  planController.updateWorkoutplanById
);

// Delete Workout PLan by ID
router.delete(
  "/workout/delete/:id",
  authenticateJWT(["admin"]),
  planController.deleteWorkoutplanById
);

module.exports = router;
