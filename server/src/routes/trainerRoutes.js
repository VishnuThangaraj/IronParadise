const router = require("express").Router();
const authenticateJWT = require("../middleware/authMiddleware");
const trainerController = require("../controllers/trainerController");

// Fetch All Trainers
router.get("/", authenticateJWT["admin"], trainerController.fetchAllTrainers);

module.exports = router;
