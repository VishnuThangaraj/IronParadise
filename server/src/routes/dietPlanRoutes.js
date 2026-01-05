const router = require("express").Router();
const authenticateJWT = require("../middleware/authMiddleware");
const dietPlanController = require("../controllers/dietPlanController");

// Fetch All Diet Plan
router.get(
  "/",
  authenticateJWT(["admin"]),
  dietPlanController.fetchAllDietPlans
);

// Create New Diet Plan
router.post(
  "/create",
  authenticateJWT(["admin"]),
  dietPlanController.createDietPlan
);

// Fetch Diet Plan by ID
router.get(
  "/details/:id",
  authenticateJWT(["admin"]),
  dietPlanController.fetchDietPlanById
);

// Update Diet Plan by ID
router.put(
  "/update/:id",
  authenticateJWT(["admin"]),
  dietPlanController.updateDietPlanById
);

// Delete Diet Plan by ID
router.delete(
  "/delete/:id",
  authenticateJWT(["admin"]),
  dietPlanController.deleteDietPlanById
);

module.exports = router;
