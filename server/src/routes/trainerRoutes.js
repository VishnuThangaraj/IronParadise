const router = require("express").Router();
const authenticateJWT = require("../middleware/authMiddleware");
const {
  fetchAllTrainers,
  fetchAllTrainersWithSalary,
} = require("../controllers/trainerController");

// Fetch All Trainers
router.get("/", authenticateJWT(["admin"]), fetchAllTrainers);

// Fetch Trainer Salary
router.get("/payroll", fetchAllTrainersWithSalary);

module.exports = router;
