const router = require("express").Router();
const authenticateJWT = require("../middleware/authMiddleware");
const {
  fetchAllTrainers,
  registerTrainer,
  fetchTrainerById,
  fetchTrainerByUserId,
  deleteTrainerById,
  fetchAllTrainersWithSalary,
} = require("../controllers/trainerController");

// Fetch All Trainers
router.get("/", authenticateJWT(["admin"]), fetchAllTrainers);

// Fetch Trainer Salary
router.get("/payroll", authenticateJWT(["admin"]), fetchAllTrainersWithSalary);

// Register Trainer
router.post("/register", authenticateJWT(["admin"]), registerTrainer);

// Fetch Trainer by ID
router.get("/profile/:id", authenticateJWT(["admin"]), fetchTrainerById);

// Fetch Trainer by UserID
router.get(
  "/profile/id/:userId",
  authenticateJWT(["admin"]),
  fetchTrainerByUserId,
);

// Delete Trainer by ID
router.delete(
  "/delete/:trainerId",
  authenticateJWT(["admin"]),
  deleteTrainerById,
);

module.exports = router;
