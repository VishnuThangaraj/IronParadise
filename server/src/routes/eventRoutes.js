const router = require("express").Router();
const authenticateJWT = require("../middleware/authMiddleware");
const eventController = require("../controllers/eventController");

// Fetch all events
router.get("/", authenticateJWT(["admin"]), eventController.getEvents);

// Schedule Events
router.get(
  "/schedule",
  authenticateJWT(["admin"]),
  eventController.scheduleBathEvent
);

// Add New Event
router.post("/add", authenticateJWT(["admin"]), eventController.addEvent);

module.exports = router;
