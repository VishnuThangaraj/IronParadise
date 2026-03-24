const router = require("express").Router();
const authenticateJWT = require("../middleware/authMiddleware");
const { fetchAllTrainers } = require("../controllers/trainerController");

// Fetch All Trainers
router.get("/", authenticateJWT(["admin"]), fetchAllTrainers);

module.exports = router;
