const router = require("express").Router();
const authenticateJWT = require("../middleware/authMiddleware");
const counterController = require("../controllers/counterController");

// Fetch LastCounter
router.post(
  "/",
  authenticateJWT(["admin", "V06102002T"]),
  counterController.fetchLastCounter
);

module.exports = router;
