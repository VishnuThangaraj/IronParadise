const router = require("express").Router();
const authenticateJWT = require("../middleware/authMiddleware");
const fitnessPlanController = require("../controllers/fitnessPlanController");

// Fetch All Fitness Plan
router.get(
  "/",
  authenticateJWT(["admin"]),
  fitnessPlanController.fetchAllFitnessPlans
);

// Create New Fitness Plan
router.post(
  "/create",
  authenticateJWT(["admin"]),
  fitnessPlanController.createFitnessPlan
);

// Fetch Fitness Plan by ID
router.get(
  "/details/:id",
  authenticateJWT(["admin"]),
  fitnessPlanController.fetchFitnessPlanById
);

// Update Fitness Plan by ID
router.put(
  "/update/:id",
  authenticateJWT(["admin"]),
  fitnessPlanController.updateFitnessPlanById
);

// Delete Fitness Plan by ID
router.delete(
  "/delete/:id",
  authenticateJWT(["admin"]),
  fitnessPlanController.deleteFitnessPlanById
);

module.exports = router;
