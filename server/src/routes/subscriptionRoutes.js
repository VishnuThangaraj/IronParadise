const router = require("express").Router();
const authenticateJWT = require("../middleware/authMiddleware");
const subscriptionController = require("../controllers/subscriptionController");

// Add new Subscription Plan
router.post(
  "/add",
  authenticateJWT(["admin"]),
  subscriptionController.addSubscription
);

// Get all Subscription Plans
router.get(
  "/",
  authenticateJWT(["admin"]),
  subscriptionController.fetchSubscriptions
);

// Update Subscription by ID
router.put(
  "/update/:id",
  authenticateJWT(["admin"]),
  subscriptionController.updateSubscriptionById
);

// Delete Subscription by ID
router.delete(
  "/delete/:id",
  authenticateJWT(["admin"]),
  subscriptionController.deleteSubscriptionById
);

module.exports = router;
