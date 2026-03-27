const router = require("express").Router();
const authenticateJWT = require("../middleware/authMiddleware");
const {
  registerTrainer,
  fetchAllTrainers,
  fetchTrainerById,
  deleteTrainerById,
  updateTrainerById,
  fetchTrainerByUserId,
} = require("../controllers/trainerController");

// Fetch All Trainers
router.get("/", authenticateJWT(["admin"]), fetchAllTrainers);

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

// Update Trainer by ID
router.put("/update/:trainerId", authenticateJWT(["admin"]), updateTrainerById);

// Delete Trainer by ID
router.delete(
  "/delete/:trainerId",
  authenticateJWT(["admin"]),
  deleteTrainerById,
);

module.exports = router;
