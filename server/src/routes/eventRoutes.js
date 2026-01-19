const router = require("express").Router();
const authenticateJWT = require("../middleware/authMiddleware");
const eventController = require("../controllers/eventController");

// Fetch All Diet Plan
router.get("/", authenticateJWT(["admin"]), eventController.fetchAllEvents);

// Create New Diet Plan
router.post(
  "/create",
  authenticateJWT(["admin", "trainer"]),
  eventController.createEvent,
);

// Fetch Diet Plan by ID
router.get(
  "/details/:id",
  authenticateJWT(["admin", "trainer"]),
  eventController.fetchEventById,
);

module.exports = router;
